# PREVIEW-IMAGE-REGISTER · v2.2 · 2026-07-19
Internal only. Every preview image = imageStatus:preview, imageReplacementRequired:true, ownerApprovalRequired per owner column. No public indicator renders anywhere.
**Drop-in convention (zero code changes):** `/public/images/inventory/{slug}/hero.jpg` (+ `g1.jpg`, `g2.jpg`) = preview · `/public/images/inventory/{slug}/verified/hero.jpg` = owner photography, wins automatically. 16:10 landscape, ≥2400×1500, JPEG q80, subject in central 70%. Style: editorial, natural light, no HDR, no posing, no watermarks, no busy marinas/airports.

## P0 — Luke demo (Noosa Air / Capelli 52)
| Asset (slug) | Preview subject to source | Replace with | Owner |
|---|---|---|---|
| capelli-stradivari-52 | Capelli Stradivari 52 underway, Noosa-like coastal water, quarter view | Actual vessel | Luke |
| ec130 | EC130 on coastal apron/helipad, morning light | Actual aircraft | Luke / operator |
| citation-cj4 | CJ4 on Australian regional apron, first light | Operated aircraft | Operator |
| alani | 82 ft motor yacht at island anchorage (type-representative) | M/Y ALANI | House |

## P1 — remaining AIR
king-air-b200 (modern B200, remote strip) · challenger-605 (large-cabin on apron) · gulfstream-g650 (G650 taxi/apron) · pilatus-pc-12 (PC-12, southern light) · robinson-r44 / robinson-r66 (type on island pad) — owners: respective operators.

## P1 — remaining SEA
rascal (110 ft class underway) · nisi (25 m class at anchor) · aix / aura / impulsive / murcielago / oneworld (size-class representative motor yachts, no name/branding visible) — owners: vessel owners/managers.

## P1 — STAY
hti-residence (island contemporary house) · noosa-residence (coastal architectural home) · syd-residence (harbour-city residence) · tasmania-lodge (stone/timber lodge for two) · tasmania-golf (large country house) · the-cowries / jasmine / one-w / mountain-majesty / tasmanian-slow-stay (held-POA residences: destination-appropriate architecture only, nothing implying the actual property) — owners: owners/managers.

## Editorial (destinations, supports worlds not inventory)
Whitehaven · Hook/Hayman aerials · Noosa National Park · Sydney Harbour · Tasmania highlands · Queenstown (future). Path: /public/images/editorial/{dest}/…

Rule preserved: preview imagery is type/size-class representative and must never contradict listed capacity, configuration or claims. Verified replacement removes the register row.


## v2.2.2 — preview images placed (2026-07-19)
Live previews (all imageStatus:preview, imageReplacementRequired:true): capelli hero+g1 (REAL vessel — TMM/Short Marine, confirm usage rights), capelli g2 + alani hero (owner-supplied renders/photos), alani g1+g2 (AI-generated, Higgsfield, provenance on file), rascal (Sunseeker 100ft class-representative), nisi (52ft class render), citation-cj4/challenger-605/gulfstream-g650 (generic/Gulfstream airframes — class guides only), ec130 (correct type), robinson-r66 (EC130 reused as rotary guide). STILL TONAL: king-air-b200, pilatus-pc-12, robinson-r44 (no suitable prop/piston imagery supplied — deliberately not faked), all POA yachts, all STAY residences (no residence photography supplied — never substituted). Homepage/editorial frozen pages keep tonal plates by architecture; imagery enters via fleet pages, featured moments and details.
