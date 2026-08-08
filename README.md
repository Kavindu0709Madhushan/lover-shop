# Bloom & Tag — Flower Shop Staff QR System

React + Vite app. Worker data lives in **Firebase Firestore** (Google's free
cloud database) so that a QR code scanned from *any* customer's phone shows
the same worker details you added from the shop's laptop/tablet — no matter
what device or browser each side is using.

There is no custom backend server to write or host — the React app talks
directly to Firestore from the browser using Firebase's client SDK.

## How it works

- **`/` (Staff Directory / Admin page)** — add workers with a photo, name,
  phone number, work section and job role. Each worker gets a unique QR code.
- **`/w/:id` (Public profile page)** — this is what the QR code points to.
  Any phone that scans it loads this page straight from Firestore.

## 1. Create your free Firebase project

1. Go to <https://console.firebase.google.com> and sign in with a Google account.
2. Click **Add project**, give it a name (e.g. `bloom-and-tag`), and finish
   the wizard (you can turn off Google Analytics — not needed here).
3. Once the project opens, click the **`</>` (web) icon** to add a web app.
   Give it a nickname and click **Register app**. You'll now see a
   `firebaseConfig` object with keys like `apiKey`, `authDomain`, etc. —
   keep this tab open, you'll need these values in step 3 below.
4. In the left sidebar, go to **Build → Firestore Database → Create database**.
   Choose a region close to you, and start in **test mode** for now (lets the
   app read/write freely — fine for a small internal tool; see the security
   note at the bottom of this file).

## 1b. Create a free ImgBB account (for worker photos)

Worker photos are hosted on **ImgBB** instead of being stored inside
Firestore. This keeps each worker's database record small and photos load
fast on any customer's phone, straight from ImgBB's own servers.

1. Go to <https://api.imgbb.com/> and sign in / create a free account.
2. Copy the API key shown on that page — you'll paste it into `.env` in step 3.

## 2. Project setup commands

```bash
npm install
```

(`firebase`, `react-router-dom` and `qrcode.react` are already listed in
`package.json`, so this one command installs everything.)

## 3. Connect your Firebase + ImgBB keys

```bash
cp .env.example .env
```

Open `.env` and paste in the matching values from the `firebaseConfig`
object (step 1.3) and your ImgBB API key (step 1b):

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=bloom-and-tag.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bloom-and-tag
VITE_FIREBASE_STORAGE_BUCKET=bloom-and-tag.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_IMGBB_API_KEY=abcdef1234567890abcdef1234567890
```

`.env` is already in `.gitignore`, so these keys won't get committed to git.

## 4. Run it locally

```bash
npm run dev
```

Add a worker, then open their profile URL on your phone (same wifi isn't
even required — Firestore is cloud-hosted) to confirm it loads.

## 5. Deploy so any customer's phone can scan it

```bash
npm run build
```

Push to GitHub and deploy on Vercel (Import Git Repository → it auto-detects
Vite). **Important:** add the same seven `VITE_FIREBASE_...` / `VITE_IMGBB_...`
values from your `.env` file into **Vercel → Project → Settings →
Environment Variables**, then redeploy — otherwise the live site won't be
able to reach Firestore or upload photos.

Once deployed, add your real workers **from the live URL** (or locally, it
doesn't matter anymore — both read/write the same Firestore database now).
Download each worker's QR from the dashboard and print it. Any phone
scanning it will load that worker's profile straight from Firestore.

## Project structure

```
src/
  data/
    firebase.js         # Firebase app + Firestore init (reads .env)
    storage.js           # Firestore read/write helpers (shared across devices)
  components/
    IdTag.jsx / .css      # plant-tag styled worker card + QR code
    WorkerForm.jsx / .css  # add / edit worker modal form
  pages/
    AdminDashboard.jsx / .css  # "/" staff directory & management
    WorkerProfile.jsx / .css   # "/w/:id" public page shown after scanning
  App.jsx    # routes
  main.jsx   # app entry, wraps App in HashRouter
```

## Notes & security

- Worker photos are uploaded to ImgBB and only the resulting URL is stored
  in Firestore — keeps documents small and photos load fast for customers.
- **Test mode Firestore rules allow anyone with your project's API key to
  read *and write* the `workers` collection.** That's fine to get started,
  but before relying on this for a real shop, tighten the rules in
  **Firestore → Rules**, e.g. allow public `read`, but require Firebase Auth
  (sign-in) for `write` so only staff can add/edit/delete workers:

  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /workers/{workerId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
  ```

  Adding a login screen for the admin page is a natural next step if you
  want that extra protection — ask if you'd like this built in.
