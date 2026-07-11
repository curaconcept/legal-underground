// ============================================================
// LEGAL UNDERGROUND — Data layer
// One API, two backends:
//   • Firebase (Auth + Firestore) when js/config.js has real keys
//   • localStorage demo mode otherwise, seeded with sample listings
// ============================================================
import { firebaseConfig, FIREBASE_ENABLED } from "./config.js";

export const MODE = FIREBASE_ENABLED ? "firebase" : "demo";

// ---------- shared auth pub-sub ----------
const authListeners = [];
let currentUser = null; // { uid, email, name, role }

export function onAuth(cb) {
  authListeners.push(cb);
  cb(currentUser);
}
function emitAuth() { authListeners.forEach((cb) => cb(currentUser)); }
export function getUser() { return currentUser; }

// ============================================================
// DEMO BACKEND (localStorage)
// ============================================================
const LS = {
  users: "lu_users", session: "lu_session", jobs: "lu_jobs",
  apps: "lu_apps", profiles: "lu_profiles", seedVer: "lu_seed_v",
};
const SEED_VERSION = "1";

function lsGet(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
const uid = () => "id_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const DAY = 86400000;
function seedJobs() {
  const now = Date.now();
  const mk = (days) => now - days * DAY;
  const dl = (days) => now + days * DAY;
  return [
    {
      id: "seed_1", title: "Immigration Law Intern", org: "Westside Immigrant Rights Clinic",
      city: "Los Angeles (Sawtelle)", workMode: "Hybrid", type: "Internship", comp: "School credit",
      topics: ["Immigration", "Human Rights"], hours: "8–12 hrs/week", deadline: dl(21), postedAt: mk(2),
      description: "Support attorneys serving low-income immigrant families on the Westside. Interns help with intake interviews, translate client declarations, assemble asylum and DACA renewal filings, and observe removal-defense hearings.",
      requirements: ["Interest in immigration or human-rights law", "Spanish proficiency a plus (not required)", "Strong writing and attention to detail"],
      status: "open", ownerId: "demo_emp",
    },
    {
      id: "seed_2", title: "Criminal Defense Research Assistant", org: "Beacon Public Defenders Project",
      city: "Downtown LA", workMode: "In-person", type: "Research", comp: "Stipend",
      topics: ["Criminal Law", "Legal Research"], hours: "10–15 hrs/week", deadline: dl(14), postedAt: mk(4),
      description: "Work alongside deputy public defenders researching sentencing mitigation, Fourth Amendment suppression issues, and post-conviction relief under recent California reform statutes.",
      requirements: ["Comfort with legal research databases", "Ability to attend court downtown twice a week"],
      status: "open", ownerId: "demo_emp",
    },
    {
      id: "seed_3", title: "IP & Tech Law Intern", org: "Nova IP Group",
      city: "Santa Monica", workMode: "Remote", type: "Internship", comp: "Paid",
      topics: ["Intellectual Property", "Tech Law", "Contracts"], hours: "15–20 hrs/week", deadline: dl(30), postedAt: mk(1),
      description: "Boutique IP practice serving startups and creators. Interns draft trademark filings, run clearance searches, summarize licensing agreements, and sit in on client strategy calls.",
      requirements: ["Interest in IP, startups, or entertainment tech", "Organized, deadline-driven work style"],
      status: "open", ownerId: "demo_emp",
    },
    {
      id: "seed_4", title: "Environmental Justice Fellow", org: "Pacific Environmental Law Center",
      city: "Long Beach", workMode: "Hybrid", type: "Internship", comp: "Stipend",
      topics: ["Environmental", "Public Interest", "Policy"], hours: "10 hrs/week", deadline: dl(25), postedAt: mk(6),
      description: "Support litigation and policy work on port pollution and community air quality in South LA and Long Beach. Fellows compile administrative records, draft public comments, and attend coalition meetings.",
      requirements: ["Passion for environmental justice", "Coursework in environmental studies or policy a plus"],
      status: "open", ownerId: "demo_emp",
    },
    {
      id: "seed_5", title: "Family Law Clinic Volunteer", org: "Harbor Family Legal Aid",
      city: "Torrance", workMode: "In-person", type: "Volunteer", comp: "Unpaid",
      topics: ["Family Law", "Public Interest"], hours: "4–8 hrs/week", deadline: dl(40), postedAt: mk(9),
      description: "Help self-represented litigants complete custody, support, and restraining-order paperwork at weekly walk-in clinics. Volunteers are trained and supervised by staff attorneys.",
      requirements: ["Empathy and patience with clients in crisis", "Weekly availability on Tuesday or Thursday afternoons"],
      status: "open", ownerId: "demo_emp",
    },
    {
      id: "seed_6", title: "Civil Rights Litigation Intern", org: "Equal Ground Legal Foundation",
      city: "Downtown LA", workMode: "Hybrid", type: "Internship", comp: "Paid",
      topics: ["Civil Rights", "Litigation", "Appellate"], hours: "15 hrs/week", deadline: dl(12), postedAt: mk(3),
      description: "Join an impact-litigation team focused on police accountability and voting rights. Interns cite-check briefs, digest depositions, and help prepare appellate records for the Ninth Circuit.",
      requirements: ["Excellent writing sample required", "Prior research experience preferred"],
      status: "open", ownerId: "demo_emp",
    },
    {
      id: "seed_7", title: "Entertainment Law Intern", org: "Marquee Entertainment Counsel",
      city: "West Hollywood", workMode: "In-person", type: "Internship", comp: "Unpaid",
      topics: ["Entertainment", "Contracts", "Intellectual Property"], hours: "12 hrs/week", deadline: dl(18), postedAt: mk(5),
      description: "Talent-side entertainment firm representing musicians and content creators. Interns summarize recording and brand deals, track option deadlines, and research name-image-likeness questions.",
      requirements: ["Interest in music or media industries", "Discretion with confidential client matters"],
      status: "open", ownerId: "demo_emp",
    },
    {
      id: "seed_8", title: "Housing Rights Caseworker", org: "Tenant Power Law Collective",
      city: "Koreatown", workMode: "Hybrid", type: "Volunteer", comp: "Stipend",
      topics: ["Housing", "Public Interest", "Civil Rights"], hours: "6–10 hrs/week", deadline: dl(35), postedAt: mk(8),
      description: "Support eviction-defense attorneys with tenant intake, habitability documentation, and rent-registry research. Caseworkers join know-your-rights workshops across Koreatown and Pico-Union.",
      requirements: ["Korean or Spanish language skills a plus", "Commitment through the end of the quarter"],
      status: "open", ownerId: "demo_emp",
    },
    {
      id: "seed_9", title: "Corporate Law Summer Clerk", org: "Meridian & Cole LLP",
      city: "Century City", workMode: "In-person", type: "Clerkship", comp: "Paid",
      topics: ["Corporate", "Contracts", "Litigation"], hours: "Full-time (summer)", deadline: dl(10), postedAt: mk(7),
      description: "Ten-week summer clerkship rotating through M&A, securities, and commercial litigation groups. Clerks attend closings, draft diligence memos, and present to the summer committee.",
      requirements: ["Junior or senior standing preferred", "Strong academic record"],
      status: "open", ownerId: "demo_emp",
    },
    {
      id: "seed_10", title: "Remote Legal Research Intern", org: "OpenBrief Research Lab",
      city: "Remote (US)", workMode: "Remote", type: "Research", comp: "School credit",
      topics: ["Legal Research", "Appellate", "Tech Law"], hours: "Flexible, 8+ hrs/week", deadline: dl(45), postedAt: mk(10),
      description: "Nonprofit legal-research lab building open tools for appellate practitioners. Interns verify citations, tag case metadata, and write plain-language summaries of new appellate decisions.",
      requirements: ["Self-directed and reliable in a remote setting", "Careful, detail-oriented reading"],
      status: "open", ownerId: "demo_emp",
    },
    {
      id: "seed_11", title: "Immigration Court Observer", org: "Justice Watch LA",
      city: "Downtown LA", workMode: "In-person", type: "Volunteer", comp: "Unpaid",
      topics: ["Immigration", "Human Rights", "Policy"], hours: "4 hrs/week", deadline: dl(60), postedAt: mk(12),
      description: "Observe immigration court proceedings and document due-process concerns for a transparency report published each quarter. Training and court etiquette briefing provided.",
      requirements: ["Weekday morning availability", "Objective, detailed note-taking"],
      status: "open", ownerId: "demo_emp",
    },
    {
      id: "seed_12", title: "Health Law & Policy Intern", org: "Bruin Health Law Initiative",
      city: "Westwood", workMode: "Hybrid", type: "Internship", comp: "School credit",
      topics: ["Health Law", "Policy", "Public Interest"], hours: "8 hrs/week", deadline: dl(28), postedAt: mk(0),
      description: "Campus-adjacent initiative researching Medi-Cal access and patient-privacy policy. Interns brief coalition partners, track state legislation, and co-author a policy explainer series.",
      requirements: ["Interest in health policy or pre-law/pre-med overlap", "Clear, concise writing"],
      status: "open", ownerId: "demo_emp",
    },
  ];
}

function demoInit() {
  if (lsGet(LS.seedVer, null) !== SEED_VERSION) {
    lsSet(LS.jobs, seedJobs());
    lsSet(LS.seedVer, SEED_VERSION);
    if (!lsGet(LS.apps, null)) lsSet(LS.apps, []);
    if (!lsGet(LS.users, null)) lsSet(LS.users, []);
    if (!lsGet(LS.profiles, null)) lsSet(LS.profiles, {});
  }
  const session = lsGet(LS.session, null);
  if (session) {
    const u = lsGet(LS.users, []).find((x) => x.uid === session);
    if (u) currentUser = { uid: u.uid, email: u.email, name: u.name, role: u.role };
  }
  emitAuth();
}

const demoBackend = {
  async signUp({ email, password, name, role }) {
    const users = lsGet(LS.users, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      throw new Error("An account with that email already exists.");
    const u = { uid: uid(), email, password, name, role, createdAt: Date.now() };
    users.push(u); lsSet(LS.users, users);
    lsSet(LS.session, u.uid);
    currentUser = { uid: u.uid, email, name, role };
    emitAuth();
    return currentUser;
  },
  async signIn({ email, password }) {
    const u = lsGet(LS.users, []).find(
      (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password
    );
    if (!u) throw new Error("Invalid email or password.");
    lsSet(LS.session, u.uid);
    currentUser = { uid: u.uid, email: u.email, name: u.name, role: u.role };
    emitAuth();
    return currentUser;
  },
  async signOut() {
    localStorage.removeItem(LS.session);
    currentUser = null; emitAuth();
  },

  async getProfile(id) { return lsGet(LS.profiles, {})[id] || null; },
  async saveProfile(id, data) {
    const p = lsGet(LS.profiles, {});
    p[id] = { ...(p[id] || {}), ...data, updatedAt: Date.now() };
    lsSet(LS.profiles, p);
  },

  async listJobs() {
    return lsGet(LS.jobs, []).filter((j) => j.status === "open" || j.status === "soon")
      .sort((a, b) => b.postedAt - a.postedAt);
  },
  async listJobsByOwner(ownerId) {
    return lsGet(LS.jobs, []).filter((j) => j.ownerId === ownerId)
      .sort((a, b) => b.postedAt - a.postedAt);
  },
  async getJob(id) { return lsGet(LS.jobs, []).find((j) => j.id === id) || null; },
  async createJob(data) {
    const jobs = lsGet(LS.jobs, []);
    const status = data.status === "soon" ? "soon" : "open";
    const job = { ...data, id: uid(), postedAt: Date.now(), status };
    jobs.unshift(job); lsSet(LS.jobs, jobs);
    return job;
  },
  async updateJob(id, data) {
    const jobs = lsGet(LS.jobs, []);
    const i = jobs.findIndex((j) => j.id === id);
    if (i >= 0) { jobs[i] = { ...jobs[i], ...data }; lsSet(LS.jobs, jobs); }
  },
  async deleteJob(id) {
    const apps = lsGet(LS.apps, []).filter((a) => a.jobId === id);
    lsSet(LS.apps, lsGet(LS.apps, []).filter((a) => a.jobId !== id));
    lsSet(LS.jobs, lsGet(LS.jobs, []).filter((j) => j.id !== id));
  },

  async listAppsByOwner(ownerId) {
    return lsGet(LS.apps, []).filter((a) => a.jobOwnerId === ownerId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async apply(data) {
    const apps = lsGet(LS.apps, []);
    if (apps.some((a) => a.jobId === data.jobId && a.applicantId === data.applicantId))
      throw new Error("You already applied to this opportunity.");
    const app = { ...data, id: uid(), status: "Submitted", createdAt: Date.now() };
    apps.unshift(app); lsSet(LS.apps, apps);
    return app;
  },
  async listAppsByApplicant(applicantId) {
    return lsGet(LS.apps, []).filter((a) => a.applicantId === applicantId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  async listAppsByJob(jobId) {
    return lsGet(LS.apps, []).filter((a) => a.jobId === jobId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  async setAppStatus(id, status) {
    const apps = lsGet(LS.apps, []);
    const i = apps.findIndex((a) => a.id === id);
    if (i >= 0) { apps[i].status = status; apps[i].statusUpdatedAt = Date.now(); lsSet(LS.apps, apps); }
  },
  async deleteApp(id) {
    const user = getUser();
    if (!user) throw new Error("Sign in to manage applications.");
    const apps = lsGet(LS.apps, []);
    const app = apps.find((a) => a.id === id);
    if (!app || app.applicantId !== user.uid)
      throw new Error("Cannot delete this application.");
    lsSet(LS.apps, apps.filter((a) => a.id !== id));
  },
};

// ============================================================
// FIREBASE BACKEND (loaded only when configured)
// ============================================================
let fb = null;

async function firebaseInit() {
  const [{ initializeApp }, authMod, fsMod, analyticsMod] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js"),
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = authMod.getAuth(app);
  const db = fsMod.getFirestore(app);
  if (firebaseConfig.measurementId) {
    try { analyticsMod.getAnalytics(app); } catch { /* analytics optional */ }
  }
  fb = { auth, db, authMod, fsMod };

  authMod.onAuthStateChanged(auth, async (u) => {
    if (u) {
      const snap = await fsMod.getDoc(fsMod.doc(db, "users", u.uid));
      const extra = snap.exists() ? snap.data() : {};
      currentUser = { uid: u.uid, email: u.email, name: extra.name || u.email, role: extra.role || "student" };
    } else {
      currentUser = null;
    }
    emitAuth();
  });
}

function docsToList(snap) {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

const firebaseBackend = {
  async signUp({ email, password, name, role }) {
    const { authMod, fsMod, auth, db } = fb;
    const cred = await authMod.createUserWithEmailAndPassword(auth, email, password);
    await fsMod.setDoc(fsMod.doc(db, "users", cred.user.uid), {
      name, role, email, createdAt: Date.now(),
    });
    currentUser = { uid: cred.user.uid, email, name, role };
    emitAuth();
    return currentUser;
  },
  async signIn({ email, password }) {
    const { authMod, auth } = fb;
    await authMod.signInWithEmailAndPassword(auth, email, password);
    return currentUser;
  },
  async signOut() { await fb.authMod.signOut(fb.auth); },

  async getProfile(id) {
    const { fsMod, db } = fb;
    const snap = await fsMod.getDoc(fsMod.doc(db, "profiles", id));
    return snap.exists() ? snap.data() : null;
  },
  async saveProfile(id, data) {
    const { fsMod, db } = fb;
    await fsMod.setDoc(fsMod.doc(db, "profiles", id), { ...data, updatedAt: Date.now() }, { merge: true });
  },

  async listJobs() {
    const { fsMod, db } = fb;
    const q = fsMod.query(fsMod.collection(db, "jobs"),
      fsMod.where("status", "in", ["open", "soon"]), fsMod.orderBy("postedAt", "desc"));
    return docsToList(await fsMod.getDocs(q));
  },
  async listJobsByOwner(ownerId) {
    const { fsMod, db } = fb;
    const q = fsMod.query(fsMod.collection(db, "jobs"), fsMod.where("ownerId", "==", ownerId));
    const list = docsToList(await fsMod.getDocs(q));
    return list.sort((a, b) => b.postedAt - a.postedAt);
  },
  async getJob(id) {
    const { fsMod, db } = fb;
    const snap = await fsMod.getDoc(fsMod.doc(db, "jobs", id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },
  async createJob(data) {
    const { fsMod, db } = fb;
    const status = data.status === "soon" ? "soon" : "open";
    const ref = await fsMod.addDoc(fsMod.collection(db, "jobs"),
      { ...data, postedAt: Date.now(), status });
    return { id: ref.id, ...data, status };
  },
  async updateJob(id, data) {
    const { fsMod, db } = fb;
    await fsMod.updateDoc(fsMod.doc(db, "jobs", id), data);
  },
  async deleteJob(id) {
    const { fsMod, db } = fb;
    const user = getUser();
    if (!user) throw new Error("Sign in to manage listings.");
    const jobRef = fsMod.doc(db, "jobs", id);
    const jobSnap = await fsMod.getDoc(jobRef);
    if (!jobSnap.exists() || jobSnap.data().ownerId !== user.uid)
      throw new Error("Cannot delete this listing.");
    const appsQ = fsMod.query(
      fsMod.collection(db, "applications"),
      fsMod.where("jobOwnerId", "==", user.uid),
      fsMod.where("jobId", "==", id),
    );
    const snap = await fsMod.getDocs(appsQ);
    const batch = fsMod.writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(jobRef);
    await batch.commit();
  },

  async listAppsByOwner(ownerId) {
    const { fsMod, db } = fb;
    const q = fsMod.query(fsMod.collection(db, "applications"),
      fsMod.where("jobOwnerId", "==", ownerId));
    return docsToList(await fsMod.getDocs(q)).sort((a, b) => b.createdAt - a.createdAt);
  },

  async apply(data) {
    const { fsMod, db } = fb;
    const dup = fsMod.query(fsMod.collection(db, "applications"),
      fsMod.where("jobId", "==", data.jobId), fsMod.where("applicantId", "==", data.applicantId));
    if (!(await fsMod.getDocs(dup)).empty)
      throw new Error("You already applied to this opportunity.");
    const ref = await fsMod.addDoc(fsMod.collection(db, "applications"),
      { ...data, status: "Submitted", createdAt: Date.now() });
    return { id: ref.id, ...data };
  },
  async listAppsByApplicant(applicantId) {
    const { fsMod, db } = fb;
    const q = fsMod.query(fsMod.collection(db, "applications"),
      fsMod.where("applicantId", "==", applicantId));
    return docsToList(await fsMod.getDocs(q)).sort((a, b) => b.createdAt - a.createdAt);
  },
  async listAppsByJob(jobId) {
    const { fsMod, db } = fb;
    const user = getUser();
    const q = user?.uid
      ? fsMod.query(
          fsMod.collection(db, "applications"),
          fsMod.where("jobOwnerId", "==", user.uid),
          fsMod.where("jobId", "==", jobId),
        )
      : fsMod.query(fsMod.collection(db, "applications"), fsMod.where("jobId", "==", jobId));
    return docsToList(await fsMod.getDocs(q)).sort((a, b) => b.createdAt - a.createdAt);
  },
  async setAppStatus(id, status) {
    const { fsMod, db } = fb;
    await fsMod.updateDoc(fsMod.doc(db, "applications", id), {
      status,
      statusUpdatedAt: Date.now(),
    });
  },
  async deleteApp(id) {
    const { fsMod, db } = fb;
    const user = getUser();
    if (!user) throw new Error("Sign in to manage applications.");
    const ref = fsMod.doc(db, "applications", id);
    const snap = await fsMod.getDoc(ref);
    if (!snap.exists() || snap.data().applicantId !== user.uid)
      throw new Error("Cannot delete this application.");
    await fsMod.deleteDoc(ref);
  },
};

// ============================================================
// PUBLIC API
// ============================================================
const backend = FIREBASE_ENABLED ? firebaseBackend : demoBackend;

let readyPromise = null;
export function ready() {
  if (!readyPromise) {
    readyPromise = FIREBASE_ENABLED ? firebaseInit() : Promise.resolve(demoInit());
  }
  return readyPromise;
}

export const store = backend;
