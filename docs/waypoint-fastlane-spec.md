# WAYPOINT & Co. — The Fast Lane
## Integration Specification · v1.0 Final Feature

**Deliverables:** `waypoint-fastlane.js` (drop-in module) · this spec · `fastlane-reference.html` (workbench)
**Depends on:** frozen platform v1.0 · `api/enquiry.ts` · Ecosystem module (optional but recommended — inheritance degrades gracefully without it)

---

## 1 · What ships

One module beside the Ecosystem script on every page. On load it provides the enquiry modal (built once, opens instantly — no navigation, no reload, no assets); automatic trigger binding for any `[data-fastlane]` element and any `<a href="/enquire…">` link; an **Enquire** item injected into the existing nav beside Begin; the discreet desktop floating action (bottom-right — Journey Memory keeps bottom-left); and the mobile sticky bar with two equal lanes, **Enquire · Shape Journey**, with safe-area padding. When the bar is present the Ecosystem pill lifts above it automatically.

The modal inherits the platform language wholesale: Instrument Serif headline ("Tell us a little about your plans."), hairline fields, mono labels, house easing, charcoal primary action. Only email is mandatory. Confirmation is the exact promise from the brief — never "submitted".

## 2 · Context — the visitor never explains what they clicked

Context resolves in priority order: explicit `data-fastlane-ref/-kind/-title` on the trigger → nearest `data-cms` ancestor (the markup every page already carries) → `/enquire` link parameters → the page's own root context. It renders as a quiet chip ("VESSEL · ALANI") the visitor can remove but never has to fill in.

Journey Engine and session inheritance: on open, the module calls `WaypointJourney.seed()`. Destination, journey, experiences, guests and timing already expressed arrive as removable chips and prefills — **never as questions**. A visitor who abandoned the engine at waypoint four completes only contact details here.

## 3 · CTA rules (from the freeze — now enforced in markup)

Commercial surfaces (vessels, residences, aircraft categories, experiences, journeys): **primary Enquire** (or Request Availability / Request Charter / Speak with Concierge where context reads better) via `data-fastlane`; **secondary Shape This Journey** via the existing `/begin` deep link. Editorial surfaces (The World, Journal, Manifesto): primary Shape / Begin a Journey; secondary Enquire. Banned everywhere: Book Now, Reserve, Buy, Purchase.

Markup pattern (inside any tagged block — context is automatic):

```html
<a class="action" href="#" data-fastlane>Request availability <span class="mark">→</span></a>
<a class="action quiet" href="/begin?journey=island-passage&src=sea-fleet">Shape this journey …</a>
```

## 4 · API contract — one endpoint, two lanes

`POST /api/enquiry` (unchanged endpoint; existing spam protections satisfied — honeypot field + dwell-time included in the payload):

```json
{
  "submissionType": "FastLane",
  "contact": { "name": null, "email": "…", "phone": null },
  "plans": { "dates": "Late June, 5 nights", "flexibleDates": true, "guests": 6, "message": null },
  "context": { "kind": "vessel", "ref": "alani", "title": "ALANI", "cmsId": "vessel.alani" },
  "session": { "seeds": { "dest": "whitsundays", "exp": "private-chef" }, "journeyMemory": { "places": 4 } },
  "tracking": { "sourcePage": "/sea", "sourceCta": "Request availability", "openedAt": 0, "completionMs": 14200 },
  "antiSpam": { "website": "", "dwellMs": 14200 }
}
```

Engine submissions add `submissionType: "JourneyEngine"` to their existing payload. CMS change (additive, freeze-compatible): one `submissionType` string field on the read-only `enquiry` document, surfaced as a column in the desk's Enquiries view so the team sees which lane each conversation arrived through.

## 5 · Analytics — conversations, not clicks

Events emitted (same beacon pattern as the Ecosystem): `fastlane_open` (source page, asset), `fastlane_submit` (asset, source, `completionMs`), `fastlane_error`. Together with the engine's `journey_start`, the dashboard answers: Fast Lane vs Journey Engine share of conversations, median completion time (target: well under 30s), and which surfaces start conversations. Successful submissions also register in Journey Memory as an explicit fix, so the drawer reflects the enquiry.

## 6 · Accessibility & performance (acceptance)

`role="dialog" aria-modal` with focus trap; Escape closes; focus returns to the trigger; polite live-region confirmation; labelled fields; 44px minimum touch targets; guest stepper is a labelled group with live count; reduced-motion renders everything instantly. The modal is DOM built at boot and toggled — perceived open is one class flip, comfortably under 100 ms; zero images, zero additional requests.

## 7 · Rollout checklist

1. Ship `waypoint-fastlane.js` after the Ecosystem script; call `WaypointFastLane.configure({ endpoint:'/api/enquiry', analyticsEndpoint:'/api/journey-analytics' })`.
2. Convert primary CTAs per §3 (commercial → `data-fastlane`; editorial keep `/begin` primary). Existing `/enquire?ref=…` links from the Strategic Review work unmodified — the module intercepts them.
3. Add `submissionType` to the enquiry schema + desk column; accept the extended payload in `api/enquiry.ts` (additive fields only).
4. Add the engine's "Prefer to just ask? Skip to enquiry" quiet link → `WaypointFastLane.open()` with the course-so-far in seeds.
5. Run the final test below on ALANI, the Capelli, one residence, one aircraft category, one experience, one journey — desktop and mobile.

## 8 · The final test

Land on SEA → open ALANI → **Request availability** → modal opens pre-labelled ALANI → type email → Send. Four interactions, one typed field. The workbench measures `completionMs` live; a brisk visitor lands near fifteen seconds. If any surface can't reproduce this, its primary CTA is wired to the wrong lane.

The Fast Lane is now the commercial heartbeat; the Journey Engine remains the soul. Neither waits on the other.
