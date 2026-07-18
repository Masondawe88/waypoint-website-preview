# WAYPOINT & Co. — The Ecosystem
## Phase Nine Specification · v1.0

**Status:** Ready for implementation
**Depends on:** CMS Schema v1.1 (frozen) · Production Infrastructure v1.0 · Pages: Homepage, SEA, AIR, STAY, The World, Journey Engine
**Deliverables in this phase:** `waypoint-ecosystem.js` (the shared runtime) · this specification · `ecosystem-reference.html` (integration reference)

---

## 0 · What this phase is, and is not

No new pages. No redesigns. Phase Nine is one shared module plus relationship discipline.

Every page built since Phase Four already carries the connective tissue this phase needs — `data-cms` attributes on destinations, residences, vessels, journeys, experiences and journal entries; deep links into the Journey Engine with `src` tracking; and the `window.WaypointJourney` hook the AIR and STAY pills anticipated. The ecosystem is delivered by **listening to what the pages already say**, not by changing what they say.

The three quiet questions every page must answer — *Where am I? Where could I go next? How does this connect to my journey?* — are answered by three mechanisms:

| Question | Mechanism | Delivered by |
|---|---|---|
| Where am I? | Page context registers in Journey Memory | `waypoint-ecosystem.js` (zero page changes) |
| Where could I go next? | Continue the Journey (graph-rendered) | One mount `<div>` per page + `/api/continue` |
| How does this connect to my journey? | The living plotted course in the Journey drawer | `waypoint-ecosystem.js` (zero page changes) |

---

## 1 · Journey Memory

**What it is.** The visitor's evolving journey — not a cart, not favourites. A session-scoped record of the course they are already plotting by moving through the world.

**How memory forms.** Three quiet inputs, in ascending order of intent:

1. **Entered** — page-level context on load (`<body data-cms>` or the page's root world/destination marker).
2. **Explored** — any tagged element held ≥55% in view for ~2.5 seconds. Skimming past something is not remembering it; spending time with it is.
3. **Chosen** — explicit acts: "Add to a journey", the Journey Memory pill, any `/begin` link followed.

Deduplication is by `kind:ref`; revisiting moves a fix to the top rather than duplicating it. Memory is capped at 40 fixes — a journey, not a history.

**The interface.** One pill, bottom-left, platform-wide:

> **Journey · 4 places explored · 2 experiences saved · 1 journey started**

It appears only after the visitor has passed the hero (or immediately if memory already exists), never announces itself, and never opens on its own. Clicking reveals the drawer: the living plotted course (same node-and-line vocabulary as SEA/AIR/STAY/The World), *The Way Forward* (explicit choices), *Recently Explored*, Collections, one Resume/Begin action, and *Forget this journey*.

**Privacy is structural, not a setting.** Storage is `sessionStorage` — memory lives and dies with the tab. No sign-in, no cookies, no cross-session identity. Account continuity later is an adapter swap inside `Store` (§15), touching nothing else.

**Supersedes:** the page-local "Add AIR to journey" / "Add STAY to journey" pills from Phases 6–7. Remove them when the module lands; Journey Memory is the single control. (The bottom-left position was chosen so any page-local controls that remain during migration don't collide bottom-right.)

---

## 2 · Contextual Continuation — "Continue the Journey"

"Related content" does not exist on this platform. Every page ends with the next chapter, and the next chapter is **read from the graph, never decided by the interface**.

**The mount.** One line, placed before the footer of every content page:

```html
<div data-continue-the-journey data-ref="vessel.alani">
  <!-- server-rendered fallback lives here; JS enhances, never requires -->
</div>
```

**The resolver.** `GET /api/continue?ref=kind.slug` — a thin server endpoint over one GROQ query against the v1.1 `relatedLink` graph:

```groq
*[_type == $kind && slug.current == $slug][0]{
  "items": related[]{
    "kind": target->_type,
    "ref": target->slug.current,
    "title": target->title,
    "essence": coalesce(essence, target->essence),
    "url": target->url,
    role, stage, order,
    "group": select(
      role == "canonical" => "next-chapter",
      stage == "after"    => "further-along",
      role == "editorial" => "more-to-discover",
      "next-chapter"
    )
  } | order(order asc) [0...6]
}
```

Listing gates from Phase-Infrastructure `queries.ts` apply (featured/listed only; unverified aircraft excluded). If the endpoint is unreachable, the server-rendered fallback stands — continuation is progressive enhancement.

**Rendering.** The module renders items with kind label, serif title, one-line essence, staggered reveal, full keyboard focus. Six items maximum. The examples from the brief (ALANI → Hamilton Island Residence, Whitehaven, Private Chef, Island Passage, *Morning on Whitehaven*, Begin Journey) are exactly what the graph already expresses through `relatedLink` — the editor authors them once; every surface renders them.

---

## 3 · Journey Collections

Quiet gathering, not wishlists. Created and held inside Journey Memory (`WaypointJourney.collections.create('Summer 2027')`, `.add('Summer 2027', item)`), named by the visitor, holding any content kind — destinations, residences, aircraft, yachts, experiences, journal entries, complete journeys. Collections appear in the drawer with item counts, and the plotted course reflects them as they evolve.

Version One scope: session-scoped like all memory. Collections are the first candidate for account continuity (§15) — the data shape is already what a saved itinerary needs.

**UI affordance for pages (optional, no redesign):** any element may carry `data-collect` — the module can attach a quiet "Return Here" affordance in a later minor version. Not required for Phase Nine acceptance.

---

## 4 · Editorial Navigation — the Journal as discovery

Journal entries are full graph citizens. Each `journalEntry` carries `relatedLink`s to its destination, relevant AIR/SEA/STAY content, experiences and journeys — so every article ends with Continue the Journey like any other page, and every destination surfaces its stories (The World §8 already renders them).

Rule: **a journal entry with no relationships cannot be published.** Editorial without connection is content marketing; editorial with connection is navigation. Add this as a publish-gate validation in Sanity (one `validation` rule on `journalEntry.related`, minimum 2 links, one of which must target a destination or world).

---

## 5 · The Living Relationship Graph — rendered, never exposed

Every content type answers *Continue the Journey* through the same resolver. What the visitor sees on Whitehaven Beach — Whitsundays · Hamilton Island · ALANI · Helicopter Scenic · Private Chef · Island Passage · nearby stories — is the graph rendered elegantly: kind labels in mono, titles in serif, essences in prose. No "graph", no "nodes", no technical vocabulary anywhere in the interface.

**Relationship depth is the platform's health metric.** A content item with fewer than three relationships is an island; the weekly editorial review (Admin Guide task) should list islands for connection or retirement. Never duplicate content to fake connection — author the relationship instead.

---

## 6 · Seasonal Intelligence

**CMS v1.2 migration proposal** (the only schema change this phase requires; per the freeze it ships as `content-schema/v1-2-seasonality` with editorial + operations sign-off):

```ts
// object: seasonality — attach to destination and world documents
defineType({
  name: 'seasonality', type: 'object', fields: [
    { name: 'window',    type: 'string', title: 'Window',
      description: 'Editorial, e.g. "June–October". Never operational dates.' },
    { name: 'character', type: 'string', title: 'Character',
      description: 'e.g. "Whale season", "Harvest", "Quiet season", "Wildflowers".' },
    { name: 'note',      type: 'text',   rows: 2, title: 'Editorial note (optional)' }
  ]
})
```

Rendering is one attribute on any page — the module fills it:

```html
<span data-season data-window="June–October" data-character="Whale season"></span>
<!-- renders: BEST EXPERIENCED · JUNE–OCTOBER · WHALE SEASON -->
```

Language is always editorial ("Best experienced", "Quiet season"), never forecast, never urgency ("Book before…" is banned). Seasonal continuation (e.g. surfacing whale-season experiences within their window) is a resolver filter on `seasonal` fields already present in v1.1 `relatedLink` — no interface change.

---

## 7 · Recently Explored

Lives **only** inside the Journey Memory drawer — never the homepage, never a page section. The drawer shows the last twelve fixes as a plotted course; journal fixes read as *Continue Reading*, engine starts as *Resume Journey*. It never dominates because it never appears unbidden.

---

## 8 · Concierge Awareness

The Journey Engine must never ask a visitor to repeat themselves. Two mechanisms:

1. **Link enrichment at the moment of intent.** When any `/begin` link is followed, the module merges the session seed into its parameters — without overwriting anything the page already declared. Viewed Hamilton Island → the engine opens with the Whitsundays selected. Added Private Chef → `exp=private-chef` arrives with the visitor. Viewed ALANI → `vessel=alani` lets the engine suggest Island Passage (a graph relationship, not a module decision). A `ctx=session` flag tells the engine the extra parameters are ambient context, to be treated as pre-selection, not commitment.

2. **`WaypointJourney.seed()`** — the engine may call this directly on load for the same context, plus ghost-node suggestions from the visitor's added experiences.

The engine's existing deep-link contract (`/begin?dest=…&mode=…&journey=…`) is unchanged; awareness only ever adds parameters the visitor's own session generated.

**Voice rule:** the engine says *"Continue where you left off"* — never "We noticed you were looking at…". Awareness is felt, not narrated.

---

## 9 · Relationship Rules (governance)

- Every relationship is CMS-authored via v1.1 `relatedLink`. The module renders; it never infers, ranks by popularity, or falls back to "people also viewed".
- No duplicated content, ever. If two pages need the same story, they reference the same document.
- No disconnected islands: minimum viable connection for publishable content is two relationships (journal: two, incl. a destination; everything else: reviewed weekly per §5).
- Roles keep their v1.1 meanings: `canonical` = the next chapter; `suggested` = ghost nodes in the engine; `editorial` = discovery. Continuation groups map from these (§2).

---

## 10 · World Navigation — Nearby Worlds

Each world quietly references neighbouring worlds through `relatedLink` role `editorial` targeting other `world`/`destination` documents — surfaced by the same resolver under the group heading **Nearby Worlds**. Neighbours are chosen for shared editorial or experiential character (Whitsundays → Noosa, Lord Howe Island, Great Barrier Reef, Fiji), never popularity. Horizon destinations (not yet in Version One) may appear with `listingStatus: listed` as horizon content per the STAY rules — named, evocative, not yet enquirable.

---

## 11 · Personalisation voice

Allowed: *Continue where you left off · Continue the Journey · Inspired by your recent explorations.*
Banned: *We noticed… · Only X left · Others also viewed · Don't miss out · any urgency device.*
Data source: current session only, unless explicit consent exists (future accounts, §15). This is enforced by architecture — the module has no cross-session identity to draw on.

---

## 12 · Motion

Journey Memory's drawer slides as one plane (700ms, the house curve `cubic-bezier(.22,1,.36,1)`); the pill fades up only after the hero. Continuation items assemble with a 90ms stagger — gathered, not loaded. Plotted courses in the drawer use the same node/line vocabulary as every page. Nothing pulses, bounces, or badges. `prefers-reduced-motion` renders everything static and complete, including plotted routes at full length.

---

## 13 · Accessibility (acceptance criteria)

- Pill: `<button aria-haspopup="dialog" aria-expanded>`; drawer: `role="dialog" aria-modal` with focus trap, Escape to close, focus returned to the pill.
- Every continuation item is a real link, focus-visible, reachable without hover; no hover-only information anywhere in the ecosystem.
- Additions announce via a polite live region ("Private Chef — Added to Journey").
- Reduced-motion: zero transitions, routes pre-drawn, all recommendations present without animation.

---

## 14 · Analytics — measure the journey

Events (buffered, sent via `sendBeacon` to `analyticsEndpoint`; anonymous, session-scoped):

| Event | Fired when | Answers |
|---|---|---|
| `relationship_hop` | any fix remembered (carries depth) | average relationship depth; most connected content |
| `journey_addition` | explicit add | most added experiences/destinations |
| `journey_start` | `/begin` followed (carries seed) | journey starts; which pages start journeys |
| `journey_memory_open` | drawer opened | resumption behaviour |
| `journey_forgotten` | memory cleared | trust signal |
| `collection_create` / `collection_addition` | collections used | inspiration patterns |

Journey completions and abandonment are measured server-side in the enquiry pipeline (Phase-Infrastructure `api/enquiry.ts` already persists source tracking). **No page-view optimisation.** The dashboard question is "how deep do journeys go and where do they begin", never "which page got traffic".

---

## 15 · Future modules — no structural redesign

| Future module | Lands as |
|---|---|
| Private client accounts | new `Store` adapter (session → account) behind the same interface |
| Saved itineraries | Collections synced through the account adapter |
| Partner portal | separate surface on the same graph; no visitor-side change |
| Travel documents | attachments on the existing `enquiry` pipeline |
| Interactive maps | a renderer over `place` fixes already in memory |
| Journey timelines | a view over `journey`+`journeyLeg`, already queried |
| Repeat travellers / invitations / membership | account adapter + `listingStatus`/audience gates already in v1.1 |
| Collaborative planning | shared Collections via the account adapter |

The rule that makes this true: **everything visitor-facing reads the graph through the same resolver, and everything remembered goes through the same store.** Two seams, both already built.

---

## 16 · Integration checklist (per existing page)

1. Add `<script src="/js/waypoint-ecosystem.js" defer></script>` before `</body>`.
2. Add one continuation mount before the footer with the page's `data-ref` (e.g. `vessel.alani`, `world.whitsundays`, `journey.island-passage`) and its server-rendered fallback inside.
3. Remove the page-local Add-to-journey pill (AIR, STAY) — Journey Memory replaces it.
4. Confirm the page root carries its context (`data-cms` + ref) — Phases 4–8 pages already do.
5. Configure once per page or in a shared layout:
   `WaypointJourney.configure({ continueEndpoint:'/api/continue', analyticsEndpoint:'/api/journey-analytics' })`
6. Journey Engine: read `WaypointJourney.seed()` on load; treat `ctx=session` parameters as pre-selection.

Server work: implement `/api/continue` (§2 query, ~30 lines beside the existing `api/enquiry.ts`) and optionally `/api/journey-analytics` (append-only log). CMS work: v1.2 seasonality migration (§6) + journal publish-gate (§4).

---

## 17 · Final test

Remove every navigation menu → the visitor still moves through Continue the Journey, Nearby Worlds and the Journal.
Remove every CTA → curiosity still flows: every page ends in the graph, and the Journey drawer always holds the way back and the way forward.
The ecosystem succeeds when no page ends — it continues.
