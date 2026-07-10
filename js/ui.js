// ============================================================
// LEGAL UNDERGROUND — Shared UI: nav, auth modal, toasts, helpers
// ============================================================
import { store, ready, onAuth, getUser, MODE } from "./store.js";

// ---------- tiny helpers ----------
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function fmtDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function timeAgo(ts) {
  const d = Math.floor((Date.now() - ts) / 86400000);
  if (d <= 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 30) return `${d}d ago`;
  return fmtDate(ts);
}

export function daysUntil(ts) {
  return Math.ceil((ts - Date.now()) / 86400000);
}

// ---------- toasts ----------
export function toast(msg, isErr = false) {
  let wrap = $(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const t = document.createElement("div");
  t.className = "toast" + (isErr ? " err" : "");
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .4s"; }, 3400);
  setTimeout(() => t.remove(), 3900);
}

// ---------- modal scaffolding ----------
export function openModal(innerHTML, { large = false } = {}) {
  closeModal();
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `<div class="modal${large ? " modal-lg" : ""}">
    <button class="modal-close" aria-label="Close">✕</button>${innerHTML}</div>`;
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  overlay.querySelector(".modal-close").addEventListener("click", closeModal);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
  return overlay;
}
export function closeModal() {
  $(".modal-overlay")?.remove();
  document.body.style.overflow = "";
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// ---------- brand mark (miniature seal) ----------
export const LOGO_SVG = `
<svg width="36" height="36" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="22" cy="22" r="20" fill="#faf4de" stroke="#4553b8" stroke-width="2"/>
  <circle cx="22" cy="22" r="15.5" stroke="#4553b8" stroke-width="1"/>
  <path d="M22 12v18" stroke="#d9a916" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M13 16h18" stroke="#d9a916" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M13 16l-3 6.5a3.6 3.6 0 007.2 0L14.6 16" stroke="#d9a916" stroke-width="1.6" stroke-linejoin="round" fill="#f0d576"/>
  <path d="M31 16l-3 6.5a3.6 3.6 0 007.2 0L32.6 16" stroke="#d9a916" stroke-width="1.6" stroke-linejoin="round" fill="#f0d576"/>
  <path d="M17 31h10" stroke="#d9a916" stroke-width="2.2" stroke-linecap="round"/>
</svg>`;

// ---------- navigation ----------
export function renderNav(active = "") {
  const nav = document.createElement("nav");
  nav.className = "nav";
  nav.innerHTML = `
    <div class="container nav-inner">
      <a class="brand" href="index.html">${LOGO_SVG}<span>Legal<b>Underground</b></span></a>
      <div class="nav-links" id="navLinks">
        <a href="jobs.html" class="${active === "jobs" ? "active" : ""}">Opportunities</a>
        <a href="guide.html" class="${active === "guide" ? "active" : ""}">How it works</a>
        <a href="dashboard.html" class="${active === "dash" ? "active" : ""}">Dashboard</a>
      </div>
      <div class="nav-auth" id="navAuth"></div>
      <button class="nav-burger" id="navBurger" aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>`;
  document.body.prepend(nav);

  const navLinks = $("#navLinks");
  const navBurger = $("#navBurger");
  const closeNav = () => navLinks.classList.remove("open");
  navBurger.addEventListener("click", () => navLinks.classList.toggle("open"));
  $$("#navLinks a").forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("click", (e) => {
    if (!navLinks.classList.contains("open")) return;
    if (e.target.closest(".nav-inner")) return;
    closeNav();
  });

  onAuth((user) => {
    const box = $("#navAuth");
    if (user) {
      const initials = (user.name || user.email).split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
      box.innerHTML = `
        <a class="nav-user" href="dashboard.html" title="Dashboard">
          <span class="avatar">${esc(initials)}</span><span>${esc((user.name || "Account").split(" ")[0])}</span>
        </a>
        <button class="btn btn-ghost btn-sm" id="navSignOut">Sign out</button>`;
      $("#navSignOut").addEventListener("click", async () => {
        await store.signOut();
        toast("Signed out. See you soon.");
      });
    } else {
      box.innerHTML = `
        <button class="btn btn-ghost btn-sm" id="navSignIn">Sign in</button>
        <button class="btn btn-primary btn-sm" id="navJoin">Join free</button>`;
      $("#navSignIn").addEventListener("click", () => openAuthModal("signin"));
      $("#navJoin").addEventListener("click", () => openAuthModal("signup"));
    }
  });
}

// ---------- auth modal ----------
export function openAuthModal(mode = "signin", afterAuth = null) {
  let role = "student";
  const overlay = openModal(`
    <h3>${mode === "signin" ? "Welcome back" : "Join Legal Underground"}</h3>
    <p class="sub">${mode === "signin"
      ? "Sign in to apply and track your applications."
      : "Free forever. Students find experience — organizations find talent."}</p>
    <div class="tabs">
      <button data-t="signin" class="${mode === "signin" ? "active" : ""}">Sign in</button>
      <button data-t="signup" class="${mode === "signup" ? "active" : ""}">Create account</button>
    </div>
    <form id="authForm">
      <div id="signupExtras" style="display:${mode === "signup" ? "block" : "none"}">
        <div class="role-pick">
          <button type="button" data-role="student" class="active">
            <span class="ico"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z" stroke="#4553b8" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 10.8V16c0 1.4 2.7 2.8 6 2.8s6-1.4 6-2.8v-5.2" stroke="#9a7714" stroke-width="1.8"/><path d="M21.5 9v5" stroke="#9a7714" stroke-width="1.8" stroke-linecap="round"/></svg></span>
            <strong>Student</strong><span>Find legal experience</span>
          </button>
          <button type="button" data-role="employer">
            <span class="ico"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M4 21V9h16v12M12 3 4 9h16l-8-6Z" stroke="#4553b8" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 21v-8m4 8v-8m4 8v-8" stroke="#9a7714" stroke-width="1.8" stroke-linecap="round"/></svg></span>
            <strong>Organization</strong><span>Post opportunities</span>
          </button>
        </div>
        <div class="field"><label>Full name</label>
          <input class="input" name="name" placeholder="Joe Bruin" autocomplete="name"></div>
      </div>
      <div class="field"><label>Email</label>
        <input class="input" name="email" type="email" required placeholder="you@ucla.edu" autocomplete="email"></div>
      <div class="field"><label>Password</label>
        <input class="input" name="password" type="password" required minlength="6" placeholder="••••••••" autocomplete="current-password"></div>
      <button class="btn btn-primary btn-block btn-lg" type="submit" id="authSubmit">
        ${mode === "signin" ? "Sign in" : "Create free account"}</button>
      ${MODE === "demo" ? `<p style="margin-top:14px;font-size:12px;color:var(--faint);text-align:center">
        Demo mode — accounts are stored only in this browser until Firebase is connected.</p>` : ""}
    </form>`);

  const setMode = (m) => {
    mode = m;
    $$(".tabs button", overlay).forEach((b) => b.classList.toggle("active", b.dataset.t === m));
    $("#signupExtras", overlay).style.display = m === "signup" ? "block" : "none";
    $("#authSubmit", overlay).textContent = m === "signin" ? "Sign in" : "Create free account";
    $("[name=name]", overlay).required = m === "signup";
  };
  $$(".tabs button", overlay).forEach((b) =>
    b.addEventListener("click", () => setMode(b.dataset.t)));
  setMode(mode);

  $$(".role-pick button", overlay).forEach((b) =>
    b.addEventListener("click", () => {
      role = b.dataset.role;
      $$(".role-pick button", overlay).forEach((x) => x.classList.toggle("active", x === b));
    }));

  $("#authForm", overlay).addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const btn = $("#authSubmit", overlay);
    btn.disabled = true;
    try {
      if (mode === "signup") {
        await store.signUp({
          email: f.get("email").trim(), password: f.get("password"),
          name: (f.get("name") || "").trim() || f.get("email").split("@")[0], role,
        });
        toast("Account created — welcome to Legal Underground.");
      } else {
        await store.signIn({ email: f.get("email").trim(), password: f.get("password") });
        toast("Signed in.");
      }
      closeModal();
      if (afterAuth) afterAuth(getUser());
    } catch (err) {
      toast(err.message || "Something went wrong.", true);
      btn.disabled = false;
    }
  });
}

// ---------- reveal-on-scroll ----------
export function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));
}

// ---------- footer ----------
export function renderFooter() {
  const f = document.createElement("footer");
  f.className = "footer";
  f.innerHTML = `
    <div class="container footer-inner">
      <div>
        <a class="brand" href="index.html">${LOGO_SVG}<span>Legal<b>Underground</b></span></a>
        <p class="fine">A free student organization at UCLA connecting undergraduates with pro bono
        legal clinics, public-interest organizations, and law firms. Not affiliated with the
        UCLA School of Law. Listings are provided by partner organizations.</p>
      </div>
      <div class="footer-links">
        <a href="jobs.html">Opportunities</a>
        <a href="guide.html">How it works</a>
        <a href="dashboard.html">Dashboard</a>
        <a href="mailto:legalunderground@g.ucla.edu">Contact</a>
      </div>
    </div>`;
  document.body.appendChild(f);
}

// ---------- page bootstrap ----------
export async function bootPage(activeNav) {
  renderNav(activeNav);
  await ready();
}
