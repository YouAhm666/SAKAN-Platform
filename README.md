# Marasi — Host Operations Dashboard

A Vite + React + Tailwind project, ready to deploy to Vercel.

## Run locally
```bash
npm install
npm run dev
```

## Deploy to Vercel

**Option A — CLI (fastest)**
```bash
npm i -g vercel
vercel
```
Follow the prompts (link or create a project). Vercel auto-detects Vite —
build command `vite build`, output directory `dist`. Then run `vercel --prod`
to promote it to your production URL.

**Option B — Dashboard**
1. Push this folder to a GitHub repo.
2. Go to vercel.com/new and import the repo.
3. Framework preset: Vite (auto-detected). Click Deploy.

No environment variables are required — this is a static front-end demo
with mock data (no backend calls).
