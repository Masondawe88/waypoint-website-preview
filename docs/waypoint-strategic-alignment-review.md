# WAYPOINT & Co. — Strategic Alignment Review
## Platform Freeze v1.0 · Phase Ten

**Scope reviewed:** Homepage · SEA (flagship v2) · AIR · STAY · The World (Whitsundays) · Journey Engine · Ecosystem (Phase Nine module + spec) · CMS Schema v1.1 · Production Infrastructure v1.0 · Brand Philosophy (Phase One)
**Nature of this document:** refinement and governance. Nothing here proposes a redesign, a new design system, or a new interaction pattern. Every recommendation reuses components that already exist.

---

## 1 · Strategic review of the completed platform

The platform set out to make a visitor feel *"I trust these people"* rather than *"these people look expensive"*, and the built work holds that line. The three service pages carry distinct movement languages (SEA horizontal, AIR vertical, STAY inward) inside one visual system; The World proves the destination-parent model; the Journey Engine turns enquiry into plotting a course; the Ecosystem connects it all through one module and one relationship graph. Governance has been unusually disciplined for a project of this pace: no fabricated specifications anywhere, verified-only rendering gates, honest attribution modes, no pricing fields, and CMS-authored relationships with no algorithmic recommendation.

The strategic gap — and it is the only serious one — is that the platform was built outward from the *slow* visitor. Group Two is served superbly. Group One, the visitor who arrives knowing they want ALANI on a Saturday in June, is currently asked to walk through the front garden to reach the front desk. Nearly every principal CTA on AIR, STAY and The World resolves to `/begin` — the seven-step Journey Engine. The engine is excellent, optional in spirit, but in practice it is the *only* doorway on several pages. That is friction by Principle Five's own definition, and fixing it is the core of this review.

The fix is small because the pieces already exist. It is specified in §3.

---

## 2 · Identified friction points

**F1 — The fast path funnels into the slow path.** On AIR, STAY and The World, "Plan a flight", "Begin your stay", "Enquire about turboprop journeys" and every journey action deep-link into the Journey Engine. A known-intent visitor cannot reach a contact form without seven waypoint screens. (SEA's vessel disclosure has an enquiry action, but it also routes to `/begin`.) *Severity: high. This is the launch blocker.*

**F2 — No skip within the Journey Engine.** A visitor who enters the engine and realises they simply want to talk has no way to jump to the contact step; they must step through or abandon. *Severity: medium.*

**F3 — Navigation offers only "Begin".** The persistent nav action on every page is the slow-path verb. There is no equally visible direct line to enquiry or contact. *Severity: medium.*

**F4 — Session seeds are enriched but not yet consumed.** The Ecosystem enriches `/begin` links with `ctx=session` parameters, but until the engine reads `WaypointJourney.seed()` and skips already-answered steps, Concierge Awareness exists in the URL and not in the experience — visitors are still asked to repeat themselves. Integration item, not design flaw. *Severity: medium, wiring.*

**F5 — Three font families per page.** Instrument Serif + Instrument Sans + IBM Plex Mono load from Google Fonts on every page. Acceptable, but un-preloaded they cost first-paint time on mobile connections. *Severity: low.*

**F6 — Two persistent pills during migration.** Until the AIR/STAY page-local "Add to journey" pills are removed per the Ecosystem checklist, pages could show both the old (bottom-right) and new (bottom-left) controls. *Severity: low, checklist item already written.*

**F7 — "Book Now" cannot be honest yet.** Principle Two lists Book Now among required actions. The platform deliberately has no live availability (`availabilityMode: subject-to-confirmation`; the enquiry *is* the availability check). A "Book Now" button would promise what operations cannot deliver and would violate the no-fabricated-availability rule. *Resolution in §3: the fast path uses "Enquire" and "Request availability" — truthful verbs that are just as fast.*

No friction was found in: motion discipline (everything honours reduced-motion and serves comprehension), accessibility structure, CMS governance, copyright/content honesty, or the editorial voice.

---

## 3 · Recommended simplifications

**S1 — Direct Enquiry (the fast lane).** One new route, `/enquire`, built entirely from existing parts: the correspondence form pattern from the Design System (Chapter: Forms), posting to the existing `api/enquiry.ts` endpoint, pre-seeded exactly like the engine (`/enquire?ref=vessel.alani`, `?ref=residence.hamilton-island-residence`, `?dest=whitsundays&mode=air`). One screen: what you're enquiring about (pre-filled, editable), dates if known, party size if known, message, email. Same routing, escalation and reply promises as the engine. **This is a page assembly, not a design task — estimated at a day of wiring.**

**S2 — Dual actions on every commercial surface.** Wherever a principal CTA exists today, it becomes a pair drawn from the existing action vocabulary: primary `Enquire` (or `Request availability` on vessels and residences) → `/enquire?…`; secondary `Shape a journey` / `Begin a journey` → `/begin?…`. Both paths pre-seeded, both tracked (`src` preserved). Applied to: SEA vessel disclosures, AIR aircraft categories and hero, STAY residences and hero, The World pillars and close, Homepage concierge close. No layout changes — the second action slots into patterns that already show paired actions elsewhere.

**S3 — "Skip to enquiry" inside the engine.** A quiet mono link on every engine step ("Prefer to just ask? Skip to enquiry") jumping to the contact waypoint with the course-so-far preserved in the message payload. Resolves F2 with one component.

**S4 — Nav carries both verbs.** The persistent nav action becomes two: `Enquire` and `Begin`. Same styling family; four characters more.

**S5 — Engine consumes the seed.** Implement the already-specified `WaypointJourney.seed()` read on engine load; `ctx=session` parameters render as pre-selected, editable chips and their steps are skipped. Resolves F4.

**S6 — Font preload.** Add `<link rel="preload">` for the three families' primary weights and `font-display: swap` (Google Fonts URL already sets swap). Resolves F5.

**Explicitly rejected simplifications:** collapsing the three movement languages into one (they are the brand); shortening The World's geographic descent (it is the product story); adding a floating "Book" button to every page (redundant once S2 lands, and it would compete with Journey Memory in violation of Principle Four).

---

## 4 · Booking-flow review

Fast path after S1–S4: any entry page → one click (`Enquire`) → one screen → submitted. From a search landing on ALANI: under fifteen seconds for a visitor who types briskly. Routing, spam protection, escalation and CMS persistence already exist in `api/enquiry.ts`; Direct Enquiry posts to the same endpoint with `channel: "direct"` so the team sees fast-lane volume separately.

Slow path: unchanged and unforced. The engine remains the most beautiful enquiry form in the category; it is now chosen, never required.

Language ruling per F7: **"Enquire"** is the house's fast verb (Phase One decision, reaffirmed); **"Request availability"** is permitted on vessels and residences where it reads more naturally; **"Book now" is banned platform-wide** until live inventory exists — at which point it becomes a v2.0 conversation, not a copy change.

---

## 5 · Navigation review

Structure confirmed: The World / Sea / Stay / Air / Journeys + wordmark + action(s). With S4, both visitor groups are served from the persistent chrome on every page. Footer indexes remain complete and consistent. The Ecosystem's final test (remove the menus — can you still move?) passes through Continue the Journey mounts, Nearby Worlds and the Journal gates. No new navigation concepts are proposed or permitted.

---

## 6 · Mobile review

Confirmed across the built pages: poster-first heroes; vertical course logs replacing plotted charts; no hover-dependent information (dwell observation, expandable categories and destination panels are all touch-first); reduced-motion honoured everywhere; Journey Memory pill and drawer sized for small screens. Actions required: S6 (font preload) and the F6 pill de-duplication; recommend safe-area insets (`env(safe-area-inset-bottom)`) added to the two fixed pills during Ecosystem integration — a two-line CSS addition to the module. Mobile is otherwise launch-grade.

---

## 7 · Journey Engine review

The engine remains the platform's signature: one question per screen, the course drawing live, ghost suggestions from the graph, only email required, human-planning promise at the close. Rulings: it is an enhancement, never a requirement (S2 makes this true everywhere, S3 makes it true even mid-engine); it must consume session seeds (S5); it keeps its seven waypoints — shortening it would trade its character for seconds the fast lane already provides. Deep-link contract unchanged and now shared by `/enquire`.

---

## 8 · Commercial readiness assessment

**Pillars confirmed as focused.** SEA: Whitsundays, Noosa, Sydney; AIR: fixed-wing + rotary, domestic + international, mission-led; STAY: curated Whitsundays, Noosa, Tasmania. Nothing built exceeds this scope; horizon content rules cover the rest.

**The Capelli Stradivari 52 slots into the frozen architecture with zero structural work** — which is precisely what the freeze was for. As a content package: a `vessel` document (commercialRelationship per the actual arrangement; specs verified-only); a hero editorial feature in SEA's fleet chapter using the ALANI presentation pattern; a v1.2 `seasonality` entry expressing the operating profile in editorial language ("Noosa through the summer · Hamilton Island, March–November"); `experience` documents for the day-charter profile (island lunches, proposals, sunset, corporate, wellness, photography, transfers) related through the graph so they surface in Continue the Journey, The World and the engine's ghost nodes; direct enquiry at `/enquire?ref=vessel.capelli-stradivari-52`. Recommended as the first content sprint after the wiring items — it will exercise every system end-to-end and become the template for onboarding any future vessel.

**Enquiry economics:** routing, escalation, reply promises and status pipeline exist; they await the one decision only the business can make — the named primary and backup enquiry owners.

---

## 9 · Launch readiness assessment

**Ready now:** design system, five experience surfaces, engine, ecosystem module and spec, CMS schemas as working code, enquiry API, backup/restore, admin documentation, brand and content governance.

**Wiring (days, not weeks):** create the Sanity project and set environment variables; hydrate `data-cms` bindings against `queries.ts`; point the engine's POST at `/api/enquiry`; implement `/api/continue`; S1–S6 above; run the content migration in documented order.

**Content (parallel):** verified ALANI specifications; Capelli Stradivari 52 package; commissioned photography per the shot briefs embedded in every placeholder frame; first journal entries (minimum two relationships each, per the publish gate); seasonality entries.

**Decisions (business, not build):** enquiry owners (primary + backup); confirmation of the Capelli commercial relationship mode; photography commissioning.

Nothing on this list is architectural. That is the definition of ready to freeze.

---

## 10 · Freeze declaration — Platform Architecture v1.0

The following are frozen as of this review: the design-system token set and component vocabulary; the three movement languages and their assignments; the Waypoint Navigation System family (Passage / Route / Belonging / Descent) as the only plotted-course patterns; the action vocabulary (Enquire · Request availability · Begin/Shape/Continue the Journey — Book Now excluded); the page anatomies of Homepage, SEA, AIR, STAY, The World and the Journey Engine; the Ecosystem module's public API and the two seams (resolver + store); CMS Schema v1.1 with v1.2-seasonality as the sole approved pending migration; the brand-language table; the governance rules (verified-only, attribution modes, no pricing fields, CMS-authored relationships only, no fabricated content).

Future work is content and integration inside this frame: new worlds from the master template, new vessels and residences as documents, experiences and journal entries into the graph, operational integrations behind the enquiry pipeline, and concierge functionality through the two seams. Any proposal that requires a new design system, navigation concept, interaction pattern or competing visual language is out of scope for v1.x by definition and requires a versioned architecture review to even be discussed.

---

## The final question

*Could a guest who knows exactly what they want enquire in under 30 seconds, while another spends an hour discovering extraordinary journeys?*

**The hour of discovery — yes, today.** The slow path is the finest work on the platform.

**The 30-second enquiry — honestly, not yet.** Today that guest is routed through the Journey Engine. With S1–S4 implemented — one assembled page, paired actions, a skip link, one nav verb — the answer becomes an unqualified yes, at roughly fifteen seconds.

The platform is therefore declared **architecturally complete and frozen at v1.0**, with launch readiness conditional on the fast-lane items in §3 and the wiring list in §9 — days of work, none of it design.

Build the fast lane. Then open the doors.
