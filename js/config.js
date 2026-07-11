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
