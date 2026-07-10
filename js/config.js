// ============================================================
// LEGAL UNDERGROUND — Firebase configuration
// ============================================================
// The site works out of the box in DEMO MODE (data saved in your
// browser via localStorage) so you can explore everything today.
//
// To go live with real shared data:
//   1. Create a project at https://console.firebase.google.com
//   2. Add a Web App, then copy its config object over the
//      placeholder below.
//   3. In the console enable:  Authentication → Email/Password
//      and  Firestore Database  (production mode).
//   4. Paste the rules from firestore.rules into
//      Firestore → Rules, then publish.
// Full walkthrough in README.md.
// ============================================================

export const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxx",
};

// Firestore turns on automatically once a real apiKey is pasted above.
export const FIREBASE_ENABLED =
  !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE");

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
