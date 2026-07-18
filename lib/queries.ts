/* ============================================================
   GROQ — the platform's entire read surface.
   Every page renders from these; nothing is hardcoded.
   Listing gates are enforced IN the queries so unlisted or
   retired content can never leak into a template by accident.
   ============================================================ */

const LISTED = `listingStatus in ["featured","listed"]`
const media = `heroMedia->{title, kind, ratio, altText, credit, placeholder,
  "url": image.asset->url, "posterUrl": poster.asset->url, "videoUrl": video.asset->url,
  shotSubject, shotLocation, shotTimeOfDay, fix}`

/* ---- Journey Engine: read 1 — destination + relationship chain ---- */
export const qDestinationForEngine = /* groq */ `
*[_type=="destination" && slug.current==$slug && ${LISTED}][0]{
  title, "slug": slug.current, essence, sceneKey, origin, horizon, fix,
  "byMode": {
    "air": byModeAir->{name, "slug": slug.current, "stage": "arrive"},
    "sea": byModeSea->{name, "slug": slug.current, "stage": "sail"},
    "stay": byModeStay->{name, "slug": slug.current, "stage": "stay"}
  },
  "related": related[]{
    role, stage, reason,
    "target": target->{_type, "name": coalesce(name, title), "slug": slug.current,
      "verified": coalesce(suitabilityVerified, specsVerified, true)}
  }[target.verified == true]
}`

/* ---- Journey Engine: read 2 — shape terms ---- */
export const qShapeTerms = /* groq */ `
*[_type=="experience" && shapeTerm==true && ${LISTED}] | order(name asc){
  name, "slug": slug.current, stage
}`

/* ---- Journey Engine: read 3 — pre-seeded journey ---- */
export const qJourneyForEngine = /* groq */ `
*[_type=="journey" && slug.current==$slug && ${LISTED}][0]{
  title, routeLabel, essence,
  legs[]{stage, label, note,
    passage{headingDeg, distanceNm, durationApprox, verified},
    "entity": entity->{_type, "name": coalesce(name, title), "slug": slug.current}}
}`

/* ---- SEA world page ---- */
export const qSeaPage = /* groq */ `{
  "destinations": *[_type=="destination" && "sea" in services && ${LISTED}]
    | order(title asc){title, "slug": slug.current, essence, fix, seasonBest,
      charterLength, sunTimes, sunTimesVerified, horizon, ${media},
      "related": related[role=="editorial"]{"target": target->{_type, "name": coalesce(name,title), "slug": slug.current}}},
  "vessels": *[_type=="vessel" && ${LISTED}] | order(listingStatus asc){
    name, "slug": slug.current, type, essence, idealCharter, availabilityMode,
    loaMetres, guestsDay, guestsOvernight, cabins, crew, cruisingSpeedKts, specsVerified,
    "attributionMode": commercialRelationship.mode,
    "home": homeDestination->title, ${media}},
  "passage": *[_type=="waypoint"] | order(sequence asc){
    sequence, essence, legToNext,
    "place": place->{name, kind, fix, "destination": destination->slug.current},
    "media": media->{"url": image.asset->url, placeholder, shotSubject, ratio}},
  "journeys": *[_type=="journey" && "sea" in featuredOn && ${LISTED}]{
    title, "slug": slug.current, routeLabel, essence, legs, ${media}}
}`

/* ---- Homepage featured content ---- */
export const qHome = /* groq */ `
*[_type=="siteSettings"][0]{
  brandStatement, promiseReplyTime, promiseHumanLine,
  "featuredJourney": homeFeaturedJourney->{title, "slug": slug.current, routeLabel, essence, legs, ${media}},
  "stories": homeFeaturedStories[]->{title, "slug": slug.current, kicker, standfirst, ${media}}
}`

/* ---- Attribution line resolver ---- */
export const qAttribution = /* groq */ `
*[_type=="siteSettings"][0].attributionLines[mode==$mode][0].line`

/* ---- Photography commission list (internal tooling) ---- */
export const qCommissionList = /* groq */ `
*[_type=="mediaAsset" && placeholder==true]{
  title, ratio, shotSubject, shotLocation, shotTimeOfDay, humanPresence}`
