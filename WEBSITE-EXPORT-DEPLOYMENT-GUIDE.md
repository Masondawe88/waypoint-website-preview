# WEBSITE EXPORT & DEPLOYMENT GUIDE
## WAYPOINT & Co. · v1.0 · Next.js production export

---

## 1 · Project stack

Next.js **14.2** (App Router) · **TypeScript** (strict) · **Tailwind CSS 3.4** (utilities available; preflight disabled so the frozen design CSS is never altered) · React 18 · zero runtime dependencies beyond React/Next — no UI libraries, no icon packs, no animation libraries. All motion is hand-written CSS/JS from the frozen v1.0 design system. Fonts: Fraunces, Hanken Grotesk (homepage · SEA · Journey Engine · Design System) and Instrument Serif, Instrument Sans, IBM Plex Mono (AIR · STAY · The World · modules), loaded once via `app/globals.css`.

**Conversion approach:** each frozen page ships as its exact HTML/CSS/JS payload inside a thin React client component (`app/<route>/client.tsx`), with metadata in a server `page.tsx`. Internal links are plain anchors → full page loads, which is what keeps per-page palettes and scripts perfectly isolated. This is deliberate: pixel-exact preservation over SPA transitions. The pristine sources live in `design-source/`; `scripts/convert.py` regenerates routes from them.

## 2 · Folder structure

```
app/
  layout.tsx            Root layout — fonts, favicon, Ecosystem + Fast Lane modules, metadata
  page.tsx + client.tsx Homepage
  sea/ air/ stay/       Service pages (frozen builds)
  world/                The World index + world/whitsundays (master template, World 01)
  begin/                Journey Engine (POST now wired to /api/enquiry)
  design-system/        Internal living design system (consider removing or protecting before public launch)
  journeys/ journal/    Index + [slug] placeholder surfaces (house language)
  about/ contact/ terms/ privacy/  Quiet placeholder pages — no dead links anywhere
  enquire/              Direct Fast Lane route (auto-opens the modal, deep-linkable)
  api/enquiry/route.ts  Enquiry endpoint — FastLane + JourneyEngine, spam gates, Sanity persist, email notify, failsafe log
  api/continue/route.ts Continue-the-Journey resolver (returns 404 until Sanity is configured; page fallbacks stand)
components/StubPage.tsx
public/js/              waypoint-ecosystem.js · waypoint-fastlane.js
design-source/          Frozen v1.0 HTML builds (source of truth for design edits)
scripts/convert.py      Regenerates app routes from design-source
sanity/                 Sanity Studio (schema v1.1 as code, desk structure) — deploy separately (§7)
docs/                   ADMIN-GUIDE · LAUNCH-CHECKLIST · frozen schema · strategic review · module specs
.github/workflows/      Nightly Sanity dataset backup action
```

## 3 · Local setup

1. Install Node 18.17+ (or 20+).
2. `npm install`
3. `npm run dev` → http://localhost:3000
4. Optional: `cp .env.example .env.local` and fill values (§6). Without them the site runs fully; enquiries print to the terminal with the tag `[WAYPOINT ENQUIRY — FAILSAFE LOG]`.

## 4 · GitHub upload

The folder is a ready git repository (initial commit included). To publish:

1. Create an empty repository on github.com (no README/licence — the repo has them). Suggested name: `waypoint-and-co`.
2. In the project folder:
   ```bash
   git remote add origin https://github.com/<your-username>/waypoint-and-co.git
   git push -u origin main
   ```
3. Recommended: in GitHub → Settings → Branches, protect `main` (require PRs) per the infrastructure workflow; schema changes travel on `content-schema/*` branches.

## 5 · Vercel deployment

1. vercel.com → **Add New → Project** → Import the GitHub repo.
2. Framework preset auto-detects **Next.js** — accept defaults (build `next build`, output `.next`).
3. Add Environment Variables (§6) for Production (and Preview if desired).
4. **Deploy.** Every push to `main` redeploys; every PR gets a preview URL.
5. Add your domain under Project → Settings → Domains when ready.

## 6 · Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | public | Sanity project (also enables `/api/continue`) |
| `NEXT_PUBLIC_SANITY_DATASET` | public | usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | public | `2024-06-01` |
| `SANITY_API_WRITE_TOKEN` | server | persists enquiries as CMS documents |
| `SANITY_API_READ_TOKEN` | server | private reads (drafts/preview, future) |
| `ENQUIRY_EMAIL_PROVIDER_KEY` | server | Resend API key for enquiry notifications |
| `ENQUIRY_FROM_ADDRESS` / `ENQUIRY_TO_ADDRESS` / `ENQUIRY_FAILSAFE_ADDRESS` | server | notification routing |

All are optional for the site to run; each unlocks its capability when present. Never commit `.env.local`.

## 7 · Sanity Studio

`sanity/` contains the full v1.1 schema and desk structure. Deploy it separately (it is excluded from the Next build): create a project at sanity.io, then from `sanity/` run `npm create sanity@latest -- --template clean` OR drop these schema files into a fresh studio and `sanity deploy`. Follow `docs/ADMIN-GUIDE.md` and `docs/LAUNCH-CHECKLIST.md`. Once the project ID is in Vercel env, enquiries persist to the Enquiries desk and `/api/continue` serves the relationship graph.

## 8 · Replacing imagery

By design there is **no stock imagery**. Every visual is a labelled tonal frame carrying its shot brief (e.g. `SHOT · DESCENT OVER THE PASSAGE`) — this doubles as the photography commission list. To replace: commission per the label, then in `design-source/<page>.html` set the frame's `background-image` (keep the existing gradient as the loading fallback: `background-image:url(/images/…), linear-gradient(…)`), drop the file in `public/images/`, and re-run `python3 scripts/convert.py`. Aspect ratios are enforced by CSS (`aspect-ratio` per frame — 16/10, 4/5, 4/3, 1/1, 16/9 as labelled); supply ≥1600px on the long edge, and the layout can never break on a missing image because the tonal frame remains underneath. Longer term, imagery should flow from Sanity `mediaAsset` per the admin guide.

## 9 · Updating page content

Two tiers. **Copy/design edits now:** edit the page in `design-source/`, run `python3 scripts/convert.py`, commit — the converter re-applies the freeze patches automatically. **Content at scale:** the pages carry `data-cms` bindings mapped to `lib/queries.ts`; hydrating those against Sanity (per the strategic review wiring list) moves copy, vessels, residences, journeys and journal into the CMS so editors never touch code. Placeholder/quiet pages (`journeys`, `journal`, `about`, etc.) are ordinary TSX — edit directly.

## 10 · Adding future pages

New world: copy `app/world/whitsundays` as the master template, author the new world's palette + waypoints per the template rules (or better, from CMS). New simple page: create `app/<route>/page.tsx` using `components/StubPage` or the house patterns. Never introduce a new design system, navigation concept or interaction pattern — the architecture is frozen at v1.0 (see `docs/waypoint-strategic-alignment-review.md` §10).

## 11 · Known limitations & unfinished items

1. `data-cms` bindings are not yet hydrated from Sanity — pages render their authored v1.0 content until that wiring is done (the intended next step).
2. `/api/continue` returns 404 until Sanity is configured; Continue-the-Journey mounts are not yet placed on pages (Ecosystem checklist item) — no visual gap meanwhile.
3. Placeholder routes (`/journeys`, `/journal/*`, `/about`, `/contact`, `/terms`, `/privacy`, world index) are intentional quiet surfaces awaiting content, not missing pages.
4. All specifications render "—"/CMS-gated until verified data is entered (by governance, not omission); photography is commission-pending per §8.
5. `/design-system` is internal — remove the route or gate it before public launch.
6. Fonts load via Google Fonts CSS; migrating to `next/font` self-hosting is a safe future optimisation (cosmetic performance only).
7. Full-page navigation between sections is by design (see §1); converting to shared-layout SPA navigation would require componentising the frozen pages and is a v2 discussion.
8. Analytics endpoints are stubbed off until an endpoint is chosen (`journey-analytics` — see ecosystem spec §14).

## 12 · Pre-launch checklist (condensed)

`npm run build` passes (verified) → push → Vercel deploy → set env → deploy Studio → name enquiry owners in Site Settings → submit a test enquiry down both lanes (Fast Lane + Journey Engine) and confirm it arrives → run the 30-second test on ALANI → connect domain.
