# ⚖️ Legal Underground

UCLA's free legal-experience network. A static site that connects students with
pro bono clinics, public-interest organizations, and law firms — with accounts,
one-click applications, an employer dashboard, and a filterable job board.

## Pages

| Page | What it does |
|---|---|
| `index.html` | Animated landing page |
| `jobs.html` | Job board — search + filters (practice area, work mode, role type, compensation, location) with detail + apply modals |
| `dashboard.html` | Role-aware dashboard: students manage a profile and track applications; organizations post roles and review applicants |
| `guide.html` | Step-by-step how-to for both sides + FAQ |

## Running it locally

The site uses ES modules, so it needs a local web server (opening the file
directly won't work). From this folder:

```bash
python3 -m http.server 5500
# then open http://localhost:5500
```

or use the VS Code "Live Server" extension.

## Demo mode vs. Firebase

Out of the box the site runs in **demo mode**: 12 sample listings are seeded and
all accounts/applications are stored in the browser's localStorage. Perfect for
trying the flows and showing the club board — but data isn't shared between
visitors.

To go live with real shared data, connect **Firebase** (free Spark plan is plenty):

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
   (call it `legal-underground`). Google Analytics optional.
2. In the project, click the **Web** icon (`</>`) → register the app → copy the
   `firebaseConfig` object it shows you.
3. Paste that object over the placeholder in [`js/config.js`](js/config.js).
   The site detects the real key and switches from demo mode automatically.
4. In the console sidebar:
   - **Build → Authentication → Get started → Email/Password → Enable**
   - **Build → Firestore Database → Create database** (production mode, `us-west1`)
5. Open **Firestore → Rules**, replace the contents with
   [`firestore.rules`](firestore.rules), and **Publish**.
6. Post your first real listing from an Organization account — done.

### Firestore data model

```
users/{uid}          → { name, role: "student" | "employer", email, createdAt }
profiles/{uid}       → student: { name, year, major, resume, interests, bio }
                       employer: { orgName, website, contact, about }
jobs/{jobId}         → { title, org, city, workMode, type, comp, topics[],
                         hours, deadline, description, requirements[],
                         ownerId, postedAt, status: "open" | "closed" }
applications/{appId} → { jobId, jobTitle, org, jobOwnerId, applicantId,
                         name, email, year, major, resume, note,
                         status, createdAt }
```

> One composite index is needed for the board query (`status ==` + `postedAt desc`).
> The first time the board loads with Firebase on, Firestore prints a link in the
> browser console — click it and the index builds itself.

## Deploying

Any static host works. Two easy options:

- **Firebase Hosting** (pairs naturally): `npm i -g firebase-tools`, then
  `firebase init hosting` (public dir: `.`) and `firebase deploy`.
- **GitHub Pages**: push this folder to a repo → Settings → Pages → deploy from
  `main`.

## Customizing

- **Practice areas / filters**: edit the lists at the bottom of `js/config.js`.
- **Colors & fonts**: CSS variables at the top of `css/style.css`
  (`--blue`, `--gold`, etc.).
- **Club contact email**: search for `legalunderground@g.ucla.edu` and replace.
- **Sample listings**: `seedJobs()` in `js/store.js` (demo mode only).
