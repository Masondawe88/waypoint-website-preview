import {defineType, defineField} from 'sanity'

/* ---------- shared value objects (Content Architecture v1.1) ---------- */

export const fix = defineType({
  name: 'fix', title: 'Chart fix (coordinates)', type: 'object',
  fields: [
    defineField({name: 'lat', title: 'Latitude', type: 'number'}),
    defineField({name: 'lng', title: 'Longitude', type: 'number'}),
    defineField({name: 'displayFix', title: 'Displayed fix', type: 'string',
      description: 'Exactly as it should appear on the chart, e.g. "20°17′ S · 149°02′ E".'}),
  ],
})

export const passage = defineType({
  name: 'passage', title: 'Passage detail (leg)', type: 'object',
  description: 'Heading, distance and time for a leg. Renders with "≈" unless verified by Operations.',
  fields: [
    defineField({name: 'headingDeg', title: 'Heading (°)', type: 'number',
      validation: r => r.min(0).max(360)}),
    defineField({name: 'distanceNm', title: 'Distance (NM)', type: 'number'}),
    defineField({name: 'durationApprox', title: 'Indicative time', type: 'string',
      description: 'e.g. "≈ 50 minutes". Keep the ≈ unless verified.'}),
    defineField({name: 'verified', title: 'Verified by Operations', type: 'boolean', initialValue: false,
      description: 'Only Operations should switch this on. Unverified passages always render as approximate.'}),
  ],
})

export const commercialRelationship = defineType({
  name: 'commercialRelationship', title: 'Commercial relationship', type: 'object',
  description: 'How the house is connected to this asset. The public attribution line renders automatically from the mode — it is never written by hand.',
  fields: [
    defineField({name: 'mode', title: 'Relationship', type: 'string',
      options: {list: [
        {title: 'Owned by the house', value: 'owned'},
        {title: 'Operated by the house', value: 'operated'},
        {title: 'Managed on behalf of owners', value: 'managed'},
        {title: 'Exclusive representation', value: 'exclusive-representation'},
        {title: 'Represented (non-exclusive)', value: 'represented'},
        {title: 'Partner network access', value: 'partner-access'},
        {title: 'Referral to specialist', value: 'referral'},
      ], layout: 'radio'},
      validation: r => r.required()}),
    defineField({name: 'partner', title: 'Partner', type: 'reference', to: [{type: 'partner'}],
      hidden: ({parent}) => (parent as any)?.mode === 'owned',
      validation: r => r.custom((v, ctx) => {
        const mode = (ctx.parent as any)?.mode
        return mode && mode !== 'owned' && !v ? 'A partner is required for every mode except "Owned".' : true
      })}),
    defineField({name: 'notes', title: 'Internal notes (never published)', type: 'text', rows: 2}),
  ],
})

export const missionSuitability = defineType({
  name: 'missionSuitability', title: 'Mission suitability', type: 'object',
  description: 'Capability, not marketing. Numbers render as "—" on the website until verified.',
  fields: [
    defineField({name: 'paxComfortable', title: 'Passengers — comfortable', type: 'number'}),
    defineField({name: 'paxMaximum', title: 'Passengers — maximum', type: 'number'}),
    defineField({name: 'luggageClass', title: 'Luggage', type: 'string',
      options: {list: ['light', 'soft-shell', 'standard', 'generous']}}),
    defineField({name: 'rangeNm', title: 'Range (NM)', type: 'number'}),
    defineField({name: 'runwayMinLengthM', title: 'Minimum runway (m)', type: 'number'}),
    defineField({name: 'runwaySurfaces', title: 'Runway surfaces', type: 'array',
      of: [{type: 'string'}], options: {list: ['sealed', 'gravel', 'grass', 'water']}}),
    defineField({name: 'remoteAccess', title: 'Remote access capable', type: 'boolean', initialValue: false}),
    defineField({name: 'internationalCapable', title: 'International capable', type: 'boolean', initialValue: false}),
    defineField({name: 'missionTags', title: 'Mission tags', type: 'array', of: [{type: 'string'}],
      options: {list: ['island-transfer','regional','remote','international','scenic','group','coastal']}}),
  ],
})

export const relatedLink = defineType({
  name: 'relatedLink', title: 'Related entry', type: 'object',
  description: 'A human-authored connection. The order of this list IS the recommendation order everywhere, including the Journey Engine.',
  fields: [
    defineField({name: 'target', title: 'Connects to', type: 'reference',
      to: [{type:'destination'},{type:'place'},{type:'vessel'},{type:'residence'},
           {type:'aircraft'},{type:'experience'},{type:'journey'},{type:'journalArticle'},{type:'event'}],
      validation: r => r.required()}),
    defineField({name: 'role', title: 'Role', type: 'string',
      options: {list: [
        {title: 'Canonical (the default answer)', value: 'canonical'},
        {title: 'Suggested (engine & cross-links)', value: 'suggested'},
        {title: 'Editorial (inspiration only)', value: 'editorial'},
      ]}, initialValue: 'suggested', validation: r => r.required()}),
    defineField({name: 'stage', title: 'Stage on the course', type: 'string',
      options: {list: ['arrive','stay','sail','experience','return']}}),
    defineField({name: 'reason', title: 'Why these connect (internal)', type: 'string',
      description: 'One line for future editors, e.g. "Whitehaven is the reason people charter here."'}),
    defineField({name: 'seasonalFrom', title: 'Only show from (month 1-12)', type: 'number'}),
    defineField({name: 'seasonalTo', title: 'Only show until (month 1-12)', type: 'number'}),
  ],
  preview: {select: {title: 'target.name', alt: 'target.title', subtitle: 'role'},
    prepare: (s: any) => ({title: s.title || s.alt || 'Related entry', subtitle: s.subtitle})},
})

/* listing + availability — spread into sellable/showable document types */
export const listingFields = [
  defineField({name: 'listingStatus', title: 'Listing status', type: 'string',
    description: 'Whether and where this appears on the website. "Retired" keeps the record without deleting history.',
    options: {list: [
      {title: 'Featured (hero placements)', value: 'featured'},
      {title: 'Listed', value: 'listed'},
      {title: 'Unlisted (direct link only)', value: 'unlisted'},
      {title: 'Hidden (CMS only)', value: 'hidden'},
      {title: 'Retired (kept for history)', value: 'retired'},
    ]}, initialValue: 'listed', validation: (r: any) => r.required()}),
  defineField({name: 'availabilityMode', title: 'Availability', type: 'string',
    description: 'Stays "Subject to confirmation" unless a live inventory system is connected. The enquiry is the availability check.',
    options: {list: [
      {title: 'Subject to confirmation (default)', value: 'subject-to-confirmation'},
      {title: 'Seasonal', value: 'seasonal'},
      {title: 'Future — arriving', value: 'future'},
      {title: 'Suspended', value: 'suspended'},
    ]}, initialValue: 'subject-to-confirmation', validation: (r: any) => r.required()}),
]

export const objects = [fix, passage, commercialRelationship, missionSuitability, relatedLink]
