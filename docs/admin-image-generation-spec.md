# Admin "Generate editorial image" — integration spec (designed, not activated) · v1.4
A Sanity Studio document action on `waypointImage` documents, admin-only.

Flow: (1) read approved `internalShotBrief`; (2) read required ratio + crop set;
(3) read related destination/category; (4) compose from the WAYPOINT prompt template
library (docs/waypoint-ai-image-prompts.md) — template + brief + exclusions;
(5) call the image API **server-side** (Sanity plugin backend / serverless function —
never from the browser, keys in server env only); (6) save 2–4 draft options as assets
with full provenance (model, prompt, date, template id); (7) mark `aiGenerated: true`,
`approvalStatus: UNAPPROVED`, `publicationStatus: NOT_PUBLISHED`; (8) publishing remains
blocked by schema validation until human approval; (9) editor selects/rejects drafts;
(10) `replacementDependency` retained from the register row.
Guardrails: draft-first, approval-gated, logged (who/when/prompt), rate-limited
(e.g. 20/day), REAL_ASSET rows refuse the action entirely.
Provider: any text-to-image API with server-side REST access; the site build stays
provider-neutral — no image-generation code ships in the public app.
