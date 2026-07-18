# BUILD MANIFEST · WAYPOINT & Co.
**Version:** v1.4 (full consolidated build) · **Date:** 2026-07-18 · **Source commit:** 4b4a55e
**Lineage:** v1.0 (3cec664) → QA v1.1 (2c85b50) → v1.2 (df8fedf) → v1.3 (090783c) → v1.3.1 (3952b39) → v1.4 (4b4a55e)

**Build command:** `next build` · **Result:** ✓ clean, TypeScript strict passes, 54 static pages generated, 47 route entries.

## Included features
Frozen editorial pages (homepage, AIR, SEA, STAY, The World/Whitsundays master, Journey Engine, design system prod-gated) · Fast Lane + Ecosystem/Journey Memory modules (stand down on /begin) · unified inventory system v1.3.1 (cards, Editorial/Index modes, featured moments, filters + reset + zero-state, seasonal logic, considered→journey toast, grouped drawer with removal) · fleet/collection + detail routes (14 items, 3 categories) · global destination atlas + open/horizon/future worlds · dual-lane enquiry API with spam gates, Sanity persist + Resend notify + failsafe log · /api/continue resolver · robots/sitemap/noindex launch switch · v1.4 image governance (5 classifications, WaypointImage component, brief gating, registers in content/, Sanity waypointImage schema with publication validation, image-direction + admin-generation docs).

## Environment variables
Required behaviour switches (set in Vercel, keep false on preview): NEXT_PUBLIC_SITE_LIVE · NEXT_PUBLIC_SHOW_DESIGN_SYSTEM · NEXT_PUBLIC_SHOW_SHOT_BRIEFS.
Optional capability unlocks: Sanity project vars + tokens, Resend key + enquiry addresses (see .env.example).

## Known limitations
No real imagery yet — all frames tonal (register: content/image-register.csv). Inventory heroBrief strings exist in the client data payload though never rendered publicly; strip via public CMS projection when Sanity serves inventory. Journal/journeys/about/legal routes are quiet placeholder surfaces. Fonts load via CSS @import (next/font migration deferred pending visual-weight verification). No OG images yet (register rows SOC-*).

## Requires before launch
Real photography + written rights for all 13 REAL_ASSET items (see content/image-register.csv, docs/waypoint-photography-requests.md) · Sanity project connection (schemas ready in sanity/) · commercial confirmation for every rate + spec marked indicative (content/asset-confirmation.csv) · owner/operator approvals per the confirmation register · final legal copy for terms/privacy.
