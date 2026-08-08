# Bloom & Tag — Flower Shop Staff QR System

Frontend-only React app. No backend, no database — everything is saved in the
browser's `localStorage`.

## How it works

- **`/` (Staff Directory / Admin page)** — add workers with a photo, name,
  phone number, work section and job role. Each worker automatically gets a
  unique QR code.
- **`/w/:id` (Public profile page)** — this is what the QR code points to.
  When a customer scans a worker's QR code with their phone camera, it opens
  this page and shows that worker's photo, name, phone, section and role.

⚠️ **Important limitation of a frontend-only setup:** because data lives in
`localStorage`, it only exists in the browser that added it. If you only run
this on `npm run dev` on your laptop, a customer's phone camera won't be able
to reach that data. To make scanning actually work in the shop:

1. Build the app (`npm run build`) and deploy the `dist/` folder to any free
   static host (Netlify, Vercel, GitHub Pages, etc.) so it has a public URL.
2. Open that public URL on the device you'll use to **add workers** (e.g. the
   shop's tablet/computer) and add everyone there.
3. Print/download each worker's QR from that same device.

Because the QR encodes a link back to that public URL, any customer's phone
can open the page — but the worker details are still only stored in the
browser of the device that added them, not shared globally. For details to
reliably appear on *every* customer's phone regardless of which device added
them, you'd eventually need a small backend/database instead of
`localStorage`. This project is built exactly as requested — frontend only —
so keep that trade-off in mind.

## Project setup commands

```bash
# 1. Create the project
npm create vite@latest flower-shop-worker-id -- --template react
cd flower-shop-worker-id

# 2. Install dependencies
npm install
npm install react-router-dom qrcode.react

# 3. Run the dev server
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Building for production

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

Production files are written to `dist/`. Upload that folder's contents to
any static host to make it reachable from customers' phones.

## Project structure

```
src/
  data/
    storage.js          # all localStorage read/write helpers
  components/
    IdTag.jsx / .css     # the plant-tag styled worker card + QR code
    WorkerForm.jsx / .css # add / edit worker modal form
  pages/
    AdminDashboard.jsx / .css  # "/" staff directory & management
    WorkerProfile.jsx / .css   # "/w/:id" public page shown after scanning
  App.jsx    # routes
  main.jsx   # app entry, wraps App in HashRouter
```

## Notes

- Photos are stored as base64 directly inside `localStorage` — keep photos
  reasonably small (a phone photo resized to a few hundred KB is plenty).
- QR codes encode a full URL (`.../#/w/<workerId>`), so scanning with any
  phone camera app opens the profile directly — no extra app needed.
- Click **Download QR** on any worker card in the dashboard to save that
  worker's QR code as a PNG you can print onto a badge or lanyard.
