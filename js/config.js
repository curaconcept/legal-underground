// ============================================================
// LEGAL UNDERGROUND — Firebase configuration
// ============================================================

export const firebaseConfig = {
  apiKey: "AIzaSyC6uvgDvHCZNNntexeswQYl-TCJON6TJK4",
  authDomain: "legal-underground.firebaseapp.com",
  projectId: "legal-underground",
  storageBucket: "legal-underground.firebasestorage.app",
  messagingSenderId: "897212446743",
  appId: "1:897212446743:web:75c3744c5e32d166080452",
  measurementId: "G-PP4GMEC0V1",
};

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
