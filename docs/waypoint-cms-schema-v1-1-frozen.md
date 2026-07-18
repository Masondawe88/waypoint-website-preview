# WAYPOINT & Co. — Content Architecture v1.1 · FROZEN
### CMS Schema & Relationship Model — permanent foundation

**Status:** FROZEN. This document supersedes v1.0 and is the permanent foundation for all future development, beginning with AIR. Changes from here are versioned schema migrations with sign-off — never in-place edits.

**Change log v1.0 → v1.1** (structure and philosophy unchanged):
1. `partnerOperated` (binary) → `commercialRelationship` (seven-state model, auto-attribution)
2. New `place` type beneath `destination` — replaces destination-fragments
3. `aircraft` extended with mission-suitability fields — capability, not fixed recommendation
4. `listingStatus` separated from `availabilityMode`
5. Enquiry routing extended with operational ownership and escalation
6. Public-facing philosophy restated and locked

**Principle (unchanged):** The website is a renderer. All meaning lives in the CMS. If a recommendation appears anywhere, it exists because two entries are linked here — never because a template hardcoded it.

---

## 1 · Design principles (unchanged from v1.0)

1. Relationships are first-class, human-authored content with an order and a reason.
2. One entity, many surfaces.
3. Emotion first, evidence second — encoded in the schema (voice fields + nullable, gated evidence fields).
4. Nothing fabricated: `verified` flags gate all operational data.
5. Commercial honesty is structural: attribution renders automatically from the relationship model.
6. The chart is data: fixes, legs and waypoints are structured content shared by every surface.

---

## 2 · Content types (v1.1 overview)

| # | Type | Purpose | Notes |
|---|------|---------|-------|
| 1 | `destination` | A served region | Whitsundays, Noosa, Sydney, Tasmania |
| 2 | **`place`** ★new | A specific location within a destination | Hamilton Island, Whitehaven Beach, Hook Island, HTI airport |
| 3 | `vessel` | A yacht | ALANI, ANASA |
| 4 | `residence` | A private stay | — |
| 5 | `aircraft` | Aviation capability | ★mission-suitability model |
| 6 | `experience` | A curatable moment | — |
| 7 | `journey` | Composed itinerary | — |
| 8 | `journeyLeg` | Ordered step in a journey | may reference any entity incl. `place` |
| 9 | `waypoint` | A charted fix | now references `place` |
| 10 | `journalArticle` | Editorial | — |
| 11 | `event` | Dated occasion | — |
| 12 | `partner` | Commercial counterparty | attribution source |
| 13 | `mediaAsset` | Photography/film + shot metadata | — |
| 14 | `person` | Internal: concierge/ops | routing targets |
| 15 | `relatedLink` | Universal relationship object | unchanged |
| — | `siteSettings` | Singleton incl. ★enquiryRouting | — |

Slug convention unchanged: stable lowercase-kebab, matching in-page `data-cms` keys.

---

## 3 · Refinement 1 — the commercial relationship model

`commercialRelationship` replaces `partnerOperated` on `vessel`, `residence`, and `aircraft` (and is available to `experience` where relevant).

```
commercialRelationship {
  mode    : enum (req)
            owned                    — house asset
            operated                 — operated by the house, owned elsewhere
            managed                  — managed on behalf of an owner
            exclusive-representation — sole charter/booking representation
            represented              — non-exclusive representation
            partner-access           — accessed via trusted partner network
            referral                 — introduced to a third party
  partner : ref partner              — required for all modes except `owned`
  notes   : string (internal only)   — commercial context, never rendered
}
```

**Automatic public attribution** — templates render the attribution line from `mode`; editors never hand-write ownership claims:

| mode | Rendered adjacent to any enquire action |
|------|------------------------------------------|
| owned | *(no line — the house speaks as itself)* |
| operated | "Operated by WAYPOINT & Co." |
| managed | "Managed by WAYPOINT & Co. on behalf of her owners." |
| exclusive-representation | "Represented exclusively by WAYPOINT & Co." |
| represented | "Available through WAYPOINT & Co." |
| partner-access | "Accessed through our trusted partner network." |
| referral | "Arranged through a trusted specialist." |

Rules: the line is not editable per-entity (only per-mode, in `siteSettings.attributionLines`); `partner.showName` may append a named partner where contractually appropriate; changing `mode` is an ops-role action.

---

## 4 · Refinement 2 — the `place` type

`place` sits beneath `destination` and gives islands, beaches, anchorages, airports, marinas and towns a real, reusable existence. Waypoints, journey legs, experiences and media may all reference the same `place`. Destination-fragments are removed.

```
place {
  name         : string (req)          — "Hook Island"
  kind         : enum (req)
                 island | beach | anchorage | reef |
                 airport | helipad | marina | town | landmark
  destination  : ref destination (req)
  fix          : geo {lat, lng, displayFix} (req where charted)
  essence      : string                — one editorial line, ≤ 30 words
  media        : ref mediaAsset[]
  access       : enum[] (sea | air | road)      — how the house reaches it
  operationalNotes : richText (internal)        — tides, strips, moorings;
                                                  never rendered publicly
  codes        : { iata?, icao?, marinaId? }    — airports/marinas only
  related      : relatedLink[]
}
```

**Consequences across the model:**
- `waypoint.belongsTo` → now `waypoint.place : ref place (req)`; the waypoint adds `sequence` + `legToNext` on top of the place's own fix and essence.
- `journeyLeg.entity` may reference `place` (e.g. "Sail · Hook Island").
- `destination.related[]` may target places directly — the Journey Engine chart can plot "Whitehaven Beach" as a first-class node.
- Airports and helipads as `place(kind: airport|helipad)` give AIR real anchors from day one (`hamilton-island-airport`, codes `{iata:"HTI"}`).

**V1 seed places:** hamilton-island (island), hamilton-island-airport (airport), whitehaven-beach (beach), hill-inlet (landmark), hook-island (island), nara-inlet (anchorage), hayman-island (island), outer-reef (reef), noosa-river (landmark), sydney-harbour (landmark), plus Tasmanian entries as scoped.

---

## 5 · Refinement 3 — aircraft as mission capability

Aircraft are no longer fixed recommendations; they are capabilities matched to a mission profile. `byMode.air` on a destination now points to an aircraft *category default* for storytelling surfaces, while selection for an actual journey is a suitability query answered by ops.

```
aircraft {
  name            : string (req)       — "Turboprop — twin", "Light jet",
                                          "Helicopter — single"
  category        : enum (fixed-wing | rotary)
  class           : string             — editorial class label
  essence         : richText
  heroMedia       : ref mediaAsset
  commercialRelationship : {...}       (req; typically partner-access)

  missionSuitability : {
    paxComfortable   : int | null      — verified-gated
    paxMaximum       : int | null      — verified-gated
    luggageClass     : enum (light | soft-shell | standard | generous)
    rangeNm          : int | null      — verified-gated
    runway           : { minLengthM: int | null,
                         surfaces: enum[] (sealed|gravel|grass|water) }
    remoteAccess     : bool            — strips, stations, islands
    internationalCapable : bool
    missionTags      : enum[] (island-transfer | regional | remote |
                       international | scenic | medevac-capable |
                       group | coastal)
  }
  suitabilityVerified : bool (default false)
                       — unverified numbers render "—"; unverified aircraft
                         never surface in engine suggestions
  related         : relatedLink[]
}
```

**Selection contract:** the Journey Engine and quoting surfaces query
`aircraft where missionSuitability matches {pax, luggage, placeAccess, range, international}` and present *capability language* publicly ("a twin-engine turboprop suited to island strips") — final aircraft selection always remains an ops decision, consistent with availability policy below.

---

## 6 · Refinement 4 — listing vs availability

Two independent fields on `vessel`, `residence`, `aircraft`, `experience`, and `journey`. Being visible and being bookable are different facts.

```
listingStatus   : enum (req)
                  featured    — hero placement eligible
                  listed      — rendered on collection/world pages
                  unlisted    — reachable by direct link / engine only
                  hidden      — CMS-only (draft commerce, embargoed)
                  retired     — kept for history, never rendered

availabilityMode : enum (req, default: subject-to-confirmation)
                  subject-to-confirmation — DEFAULT; all enquiries confirmed
                                            personally by the house
                  live-inventory          — only when connected to a live
                                            system (none in V1)
                  seasonal                — renders season window from entity
                  future                  — "arriving — future season" (ANASA)
                  suspended               — listed but not currently offered;
                                            renders "currently unavailable"
```

Rendering rules: no template may imply real-time availability unless `availabilityMode = live-inventory`; `subject-to-confirmation` renders no availability UI at all — the enquiry *is* the availability check, which is the concierge posture. ANASA = `listingStatus: listed, availabilityMode: future`.

---

## 7 · Refinement 5 — operational enquiry routing

`siteSettings.enquiryRouting` replaces the simple `enquiryDestination`:

```
enquiryRouting {
  primaryOwner   : ref person (req)     — owns the reply commitment
  backupOwner    : ref person (req)
  crmDestination : { system: string,    — e.g. "CRM", "shared inbox"
                     endpointOrAddress: string,
                     pipelineOrLabel: string }
  escalationRules : rule[] {
      when   : enum (no-reply-within | keyword | timeframe-soon |
                     high-value-signal | destination)
      value  : string        — "1 business day", "medevac", "corporate retreat"
      then   : enum (notify-backup | notify-both | priority-flag | route-to)
      target : ref person | null
  }
  sourceTracking : {
      capture: (page, cta, journeySeed, referrer, utm) — attached to every
               POST /enquiry payload automatically
  }
  promises : { replyTime: string, humanPlanningLine: string }
             — rendered verbatim in exactly two places (engine confirmation,
               footer); the reply commitment and its owner live side-by-side
               so the promise is never edited apart from its accountability
}
```

Example V1 rules: `no-reply-within: 1 business day → notify-backup`; `keyword: "urgent" | "this week" → priority-flag`; `timeframe-soon → notify-both`.

The `POST /enquiry` payload from v1.0 gains `routing: {primaryOwner, crmDestination}` resolved at submit time, and `source` is now populated from `sourceTracking.capture` rather than ad hoc.

---

## 8 · Unchanged core (restated and locked)

- **`relatedLink`** — unchanged: `{target, role(canonical|suggested|editorial), stage, order, reason, seasonal}`. Ordered `related[]` on a destination *is* the Journey Engine suggestion chain; `byMode` gives one canonical answer per pillar.
- **Journey Engine contract** — unchanged three reads + one write; deep-link seeding (`/begin?dest=…`, `/begin?journey=…`, `/begin?mode=…`).
- **Rendering gates** — verified gate ("—" / "≈"), attribution gate (now driven by `commercialRelationship.mode`), placeholder gate, horizon gate.
- **Public-facing philosophy — FROZEN:**
  1. **No public pricing.** No pricing fields exist; adding any is a versioned migration with sign-off.
  2. **Verified operational data only.** Unverified specifications render "—"; unverified passage data renders "≈" or not at all.
  3. **CMS-driven relationships.** No template may render a recommendation that is not a `relatedLink`.
  4. **The Journey Engine is powered entirely by the relationship graph.** No bespoke recommendation logic may enter the engine codebase.

---

## 9 · Worked examples (v1.1)

### ALANI
```json
{
  "slug": "alani",
  "name": "ALANI",
  "homeDestination": "whitsundays",
  "commercialRelationship": { "mode": "owned" },
  "listingStatus": "featured",
  "availabilityMode": "subject-to-confirmation",
  "specifications": { "loaMetres": null, "guestsOvernight": null },
  "specsVerified": false
}
```
*(Attribution renders nothing — the house speaks as itself. If ALANI's actual arrangement is `managed` or `operated`, one enum change corrects every surface at once.)*

### Hook Island (`place`)
```json
{
  "slug": "hook-island",
  "kind": "island",
  "destination": "whitsundays",
  "fix": { "displayFix": "20°06′ S · 148°55′ E" },
  "essence": "Fjord-quiet anchorages; the generator goes off, the stars come up.",
  "access": ["sea", "air"]
}
```

### Aircraft capability answering a mission
```
mission: 8 pax, soft-shell luggage, island strip (sealed 1,300 m), regional
query  : aircraft where paxComfortable ≥ 8 AND luggageClass ≥ soft-shell
         AND runway.minLengthM ≤ 1300 AND 'island-transfer' in missionTags
         AND suitabilityVerified = true
public : "A twin turboprop suited to island runways."
final  : selected by operations at confirmation — availabilityMode governs.
```

---

## 10 · Migration & freeze

Migration order (updated): (1) mediaAssets, (2) destinations + **places**, (3) waypoints re-pointed to places, (4) vessels/residences/aircraft with `commercialRelationship` + `listingStatus`/`availabilityMode`, (5) relatedLinks + byMode, (6) journeys/legs, (7) `enquiryRouting` with named owners, (8) engine reads, (9) enquiry POST.

**Freeze declaration:** v1.1 is the permanent foundation. AIR, STAY, Destinations, Journal and all future surfaces are built as renderers of this schema. Any future change requires: a version number, a written migration, and sign-off from both editorial and operations roles.

*End of Content Architecture v1.1 — frozen.*
