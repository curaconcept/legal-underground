/**
 * Legal Underground — Firestore-triggered email notifications.
 *
 * Deploy: firebase deploy --only functions --project legal-underground
 *
 * Required (Firebase Functions params / .env):
 *   RESEND_API_KEY  — from https://resend.com (free tier works)
 *   NOTIFY_FROM     — verified sender, e.g. "Legal Underground <onboarding@resend.dev>"
 *   SITE_URL        — link back to the site in emails
 */
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { defineString } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const resendKey = defineString("RESEND_API_KEY", { default: "" });
const fromEmail = defineString("NOTIFY_FROM", {
  default: "Legal Underground <onboarding@resend.dev>",
});
const siteUrl = defineString("SITE_URL", {
  default: "https://curaconcept.github.io/legal-underground",
});

function fmtDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

async function resolveUserEmail(uid) {
  if (!uid) return null;
  const [userSnap, profSnap] = await Promise.all([
    db.doc(`users/${uid}`).get(),
    db.doc(`profiles/${uid}`).get(),
  ]);
  const user = userSnap.exists ? userSnap.data() : {};
  const prof = profSnap.exists ? profSnap.data() : {};
  return prof.contact || user.email || null;
}

async function sendEmail(to, subject, html) {
  const key = resendKey.value();
  if (!key) {
    console.log("Email skipped (no RESEND_API_KEY):", { to, subject });
    return false;
  }
  if (!to) {
    console.log("Email skipped (no recipient):", { subject });
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail.value(),
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    console.error("Resend error:", await res.text());
    return false;
  }
  return true;
}

function wrap(body) {
  const url = siteUrl.value();
  return `<div style="font-family:Inter,system-ui,sans-serif;max-width:560px;color:#211b10;line-height:1.55">
    <p style="font-size:13px;color:#9a7714;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Legal Underground</p>
    ${body}
    <p style="margin-top:28px;font-size:13px;color:#93855f"><a href="${url}/dashboard.html" style="color:#33409c">Open your dashboard</a> · UCLA legal experience network</p>
  </div>`;
}

/** Employer receives an email when a student applies. */
exports.onApplicationCreated = onDocumentCreated("applications/{appId}", async (event) => {
  const app = event.data?.data();
  if (!app) return;

  const employerEmail = await resolveUserEmail(app.jobOwnerId);
  const html = wrap(`
    <h2 style="font-family:Georgia,serif;font-size:22px;margin:0 0 12px">New application received</h2>
    <p><strong>${app.name || "A student"}</strong> applied to <strong>${app.jobTitle || "your listing"}</strong>${app.org ? ` at ${app.org}` : ""}.</p>
    <ul style="padding-left:18px;color:#6b5b3e">
      <li>Year: ${app.year || "—"}</li>
      <li>Major: ${app.major || "—"}</li>
      <li>Email: ${app.email || "—"}</li>
      <li>Applied: ${fmtDate(app.createdAt)}</li>
    </ul>
    <p style="color:#6b5b3e;font-style:italic">"${(app.note || "").replace(/"/g, "&quot;")}"</p>
    <p>Review applicants and export a CSV from your organization dashboard.</p>
  `);

  await sendEmail(
    employerEmail,
    `New application: ${app.jobTitle || "your listing"}`,
    html,
  );
});

/** Student receives an email when an employer updates application status. */
exports.onApplicationUpdated = onDocumentUpdated("applications/{appId}", async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();
  if (!before || !after || before.status === after.status) return;

  const html = wrap(`
    <h2 style="font-family:Georgia,serif;font-size:22px;margin:0 0 12px">Application status updated</h2>
    <p>Your application to <strong>${after.jobTitle || "a role"}</strong>${after.org ? ` at ${after.org}` : ""} is now:</p>
    <p style="font-size:20px;font-weight:700;color:#33409c">${after.status}</p>
    <p>Sign in to your dashboard anytime to see all of your applications in one place.</p>
  `);

  await sendEmail(
    after.email,
    `Application update: ${after.status} — ${after.jobTitle || "Legal Underground"}`,
    html,
  );
});
