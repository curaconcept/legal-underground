// ============================================================
// LEGAL UNDERGROUND — App configuration
// ============================================================
// Firebase credentials live in firebase-config.js (gitignored).
// Copy js/firebase-config.example.js → js/firebase-config.js for local dev.
// Production injects firebase-config.js via GitHub Actions secret.

import { firebaseConfig } from "./firebase-config.js";

export { firebaseConfig };

export const FIREBASE_ENABLED =
  !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE");

/** Official UCLA club site (Google Sites) — events, LSAT tutoring, membership, board. */
export const CLUB_SITE_URL = "https://sites.google.com/view/legal-underground-ucla/home";

/** GitHub Pages project prefix (empty when serving locally from repo root). */
export function sitePath(rel = "") {
  if (/^https?:\/\//.test(rel) || rel.startsWith("mailto:")) return rel;
  const gh = "/legal-underground";
  const base = location.pathname.startsWith(gh) ? gh : "";
  if (!rel || rel === "/") return `${base}/` || "/";
  const path = rel.startsWith("/") ? rel : `/${rel}`;
  return `${base}${path}`;
}

export function isHomePage() {
  const p = location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");
  return !p || p === "/legal-underground";
}

export function aboutSectionHref() {
  return `${sitePath("/")}#about`;
}

// Practice areas offered in filters and posting forms.
export const TOPICS = [
  "Immigration", "Criminal Law", "Civil Rights", "Intellectual Property",
  "Environmental", "Family Law", "Entertainment", "Corporate",
  "Housing", "Public Interest", "Health Law", "Litigation",
  "Policy", "Legal Research", "Contracts", "Human Rights",
  "Tech Law", "Appellate",
];

export const WORK_MODES = ["Remote", "Hybrid", "In-person"];
export const JOB_TYPES = ["Internship", "Volunteer", "Clerkship", "Research"];
export const COMP_TYPES = ["Paid", "Stipend", "School credit", "Unpaid"];
export const APP_STATUSES = ["Submitted", "Reviewed", "Interview", "Accepted", "Declined"];

/** Job listing visibility on the public board. */
export const JOB_BOARD_STATUSES = ["open", "soon"];

export function isJobAcceptingApplications(job) {
  return job?.status === "open";
}

export function jobStatusLabel(status) {
  return ({ open: "Open", soon: "Accepting soon", closed: "Closed" })[status] || "Closed";
}

export function jobStatusChipClass(status) {
  return ({ open: "chip-green", soon: "chip-gold", closed: "chip-muted" })[status] || "chip-muted";
}

/** Build a standard weekly hours string, e.g. "10 hrs/week" or "8–12 hrs/week". */
export function formatHoursPerWeek(min, max) {
  const lo = Math.round(Number(min));
  const hiRaw = max != null && max !== "" ? Number(max) : lo;
  const hi = Math.round(hiRaw);
  if (!Number.isFinite(lo) || lo < 1) return "";
  if (!Number.isFinite(hi) || hi < lo) return `${lo} hrs/week`;
  if (lo === hi) return `${lo} hrs/week`;
  return `${lo}–${hi} hrs/week`;
}

/** Normalize stored hours for display (handles legacy free-text values). */
export function displayHours(hours) {
  if (!hours) return "";
  const s = String(hours).trim();
  if (/^\d+–\d+ hrs\/week$/.test(s) || /^\d+ hrs\/week$/.test(s)) return s;
  const range = s.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (range) return formatHoursPerWeek(range[1], range[2]);
  const plus = s.match(/(\d+)\+/);
  if (plus) return formatHoursPerWeek(plus[1], plus[1]);
  const single = s.match(/(\d+)/);
  if (single) return formatHoursPerWeek(single[1], single[1]);
  return s;
}

/** Parse a stored hours string into min/max for form inputs. */
export function parseHoursToMinMax(hours) {
  const d = displayHours(hours);
  const range = d.match(/^(\d+)–(\d+) hrs\/week$/);
  if (range) return { min: range[1], max: range[2] };
  const single = d.match(/^(\d+) hrs\/week$/);
  if (single) return { min: single[1], max: single[1] };
  return { min: "", max: "" };
}
