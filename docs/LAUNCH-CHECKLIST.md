# WAYPOINT & Co. — Launch Checklist

## Content
- [ ] All V1 destinations, places and waypoints entered; sequences correct
- [ ] ALANI entered with real, ops-verified specifications (specsVerified on)
- [ ] ANASA set: Listed / Future
- [ ] Aircraft categories entered; suitability verified before engine exposure
- [ ] Related-entry chains authored for every destination (order reviewed)
- [ ] Canonical byMode answers set per destination
- [ ] Island Passage journey legs finalised; passage details verified or "≈"
- [ ] All commercial relationships set; attribution lines reviewed by ops
- [ ] Placeholder media replaced or consciously accepted for launch
- [ ] Alt text on every non-placeholder asset

## Operations
- [ ] Site settings: primary + backup enquiry owners named
- [ ] Reply promise wording matches what ops actually honours
- [ ] Escalation rules configured and tested
- [ ] Test enquiry end-to-end: submit → Sanity record → email received → reply
- [ ] Spam test: honeypot + dwell-time + rate limit verified
- [ ] Failsafe address configured (ENQUIRY_FAILSAFE_ADDRESS)

## Technical
- [ ] GitHub: main protected, Lovable two-way sync confirmed
- [ ] All env vars set in hosting (none in code); secrets rotated from any dev values
- [ ] Sanity publish webhook → deploy/revalidate confirmed
- [ ] Draft preview works and is noindex; PREVIEW_SECRET set
- [ ] Nightly backup workflow green; restore drill performed once
- [ ] robots.txt + sitemap; /studio noindexed
- [ ] 404 page on-brand; redirects for any legacy URLs
- [ ] Performance pass: poster-first heroes, lazy media, no layout shift
- [ ] Accessibility pass: keyboard, focus, contrast, reduced motion
- [ ] Mobile pass on real devices

## Sign-off
- [ ] Editorial sign-off (voice, imagery)
- [ ] Operations sign-off (numbers, attribution, routing, promise)
- [ ] Final review against the standard: does it feel engineered, editorial, cinematic, timeless?
