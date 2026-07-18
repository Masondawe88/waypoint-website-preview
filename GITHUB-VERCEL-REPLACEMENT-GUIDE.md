# GITHUB / VERCEL FULL-REPLACEMENT GUIDE · WAYPOINT & Co. v1.4
For replacing an out-of-date repository with this complete build using GitHub Desktop.
This ZIP is self-contained — it does not depend on anything in the old repository.

## 1 · What to copy
1. Download and unzip `waypoint-site-v1.4-full.zip`. The unzipped folder IS the project root
   (you should see `app/`, `components/`, `package.json` immediately — no nesting).
2. In GitHub Desktop: clone your existing repository to a local folder (if not already cloned).
3. In the cloned repository folder, DELETE everything **except** the hidden `.git/` folder
   (enable hidden files to see it). The `.git` folder is the repository's history and its
   connection to GitHub — keeping it is what makes this a "replacement commit" rather than
   a brand-new repo, and it preserves rollback to every earlier deploy.
4. Copy the ENTIRE contents of the unzipped folder into the cloned repository folder.
   Copy everything: `app/`, `components/`, `lib/`, `content/`, `docs/`, `design-source/`,
   `public/`, `sanity/`, `scripts/`, `.github/`, and all root files including `.gitignore`
   and `.env.example`.
   Do NOT copy: any `.env.local` you create later (never commit it), `node_modules/`, `.next/`
   (neither is in the ZIP anyway).

## 2 · Commit and push
5. GitHub Desktop will show the full change set. Summary: `v1.4 full replacement — complete current build`.
6. Commit to `main`, then **Push origin**.
7. Vercel redeploys automatically on push. Watch the deployment in vercel.com → your project →
   Deployments; it should build with the standard `next build` and finish green (54 pages).

## 3 · Environment variables in Vercel (Project → Settings → Environment Variables)
Required for the preview to behave correctly:
- `NEXT_PUBLIC_SITE_LIVE=false`  ← keep **false** until the final domain; this serves
  `robots.txt Disallow: /` and a noindex meta on every page.
- `NEXT_PUBLIC_SHOW_DESIGN_SYSTEM=false`  ← /design-system stays 404 in production.
- `NEXT_PUBLIC_SHOW_SHOT_BRIEFS=false`  ← internal shot briefs never render publicly.
Optional (each unlocks a capability, site runs fully without them):
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_WRITE_TOKEN` (persist enquiries), `SANITY_API_READ_TOKEN`
- `ENQUIRY_EMAIL_PROVIDER_KEY` (Resend) + `ENQUIRY_FROM_ADDRESS` / `ENQUIRY_TO_ADDRESS` / `ENQUIRY_FAILSAFE_ADDRESS`
Without email/Sanity config, enquiries log to the Vercel function logs tagged
`[WAYPOINT ENQUIRY — FAILSAFE LOG]` — check Deployments → Functions.

## 4 · Confirm the preview is not indexed
Visit `<preview-url>/robots.txt` → should read `User-Agent: *  Disallow: /`.
View page source on the homepage → `<meta name="robots" content="noindex, nofollow">`.
Both flip automatically when `NEXT_PUBLIC_SITE_LIVE=true` on the launch domain.

## 5 · Rollback
GitHub: Desktop → History → right-click the previous commit → Revert; push.
Vercel (faster): Deployments → previous green deployment → ⋯ → **Promote to Production**.
Because `.git/` was preserved, every earlier state remains reachable.
