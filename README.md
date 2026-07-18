# WAYPOINT & Co. — Website (v1.0)

A precision travel house. Air. Sea. Stay. One considered journey.

Production codebase for the WAYPOINT & Co. platform: Next.js 14 (App Router) + TypeScript + Tailwind, deployable to Vercel, with Sanity CMS wiring, the Journey Engine, the Ecosystem (Journey Memory) and the Fast Lane (direct enquiry).

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (passes clean)
npm start          # serve the production build
```

No environment variables are required to run locally — enquiries log to the server console until Sanity/email are configured. See `.env.example` and `docs/`.

## Structure

```
app/                  Routes (App Router). Each design page = page.tsx (metadata) + client.tsx (exact frozen build)
app/api/enquiry       One endpoint, two lanes: FastLane + JourneyEngine submissions
app/api/continue      "Continue the Journey" graph resolver (Sanity GROQ over HTTP)
components/           StubPage — quiet placeholder surface in the house language
public/js/            waypoint-ecosystem.js + waypoint-fastlane.js (loaded site-wide in layout)
design-source/        Pristine frozen v1.0 HTML builds (edit here, re-run scripts/convert.py)
scripts/convert.py    HTML → route converter (applies the freeze patches)
sanity/               Sanity Studio v3 — full v1.1 schema as working code + desk structure
docs/                 Admin guide, launch checklist, frozen schema, strategic review, module specs
```

Full instructions: **WEBSITE-EXPORT-DEPLOYMENT-GUIDE.md**.
