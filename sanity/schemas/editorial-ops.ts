import {defineType, defineField} from 'sanity'
import {listingFields} from './objects'

/* ============================================================
   JOURNEYS · EDITORIAL · OPERATIONS
   ============================================================ */

export const journeyLeg = defineType({
  name: 'journeyLeg', title: 'Journey leg', type: 'object',
  fields: [
    defineField({name:'stage', title:'Stage', type:'string', validation: r=>r.required(),
      options:{list:['arrive','stay','sail','experience','return']}}),
    defineField({name:'label', title:'Label on the course', type:'string', validation: r=>r.required(),
      description:'e.g. "ALANI", "Hamilton Island residence", "Departure".'}),
    defineField({name:'entity', title:'Linked entry (optional)', type:'reference',
      to:[{type:'vessel'},{type:'residence'},{type:'aircraft'},{type:'experience'},{type:'destination'},{type:'place'}]}),
    defineField({name:'note', title:'One-line note', type:'string',
      description:'e.g. "Night at anchor, generator off."'}),
    defineField({name:'passage', title:'Passage detail (optional)', type:'passage'}),
    defineField({name:'media', title:'Frame (optional)', type:'reference', to:[{type:'mediaAsset'}]}),
  ],
  preview: {select:{title:'label', subtitle:'stage'}},
})

export const journey = defineType({
  name: 'journey', title: 'Journey', type: 'document',
  fields: [
    defineField({name:'title', title:'Title', type:'string', validation: r=>r.required()}),
    defineField({name:'slug', title:'Web address', type:'slug', options:{source:'title'}, validation: r=>r.required()}),
    defineField({name:'routeLabel', title:'Route line', type:'string',
      description:'e.g. "Brisbane → Hamilton Island → The Whitsundays".'}),
    defineField({name:'essence', title:'Essence', type:'text', rows:3, validation: r=>r.required().max(320)}),
    defineField({name:'heroMedia', title:'Hero image or film', type:'reference', to:[{type:'mediaAsset'}]}),
    defineField({name:'legs', title:'Legs (drag to order — this is the plotted course)', type:'array',
      of:[{type:'journeyLeg'}], validation: r=>r.required().min(2)}),
    defineField({name:'featuredOn', title:'Featured on', type:'array', of:[{type:'string'}],
      options:{list:['home','sea','air','stay','engine']}}),
    ...listingFields,
    defineField({name:'related', title:'Related entries', type:'array', of:[{type:'relatedLink'}]}),
  ],
  preview: {select:{title:'title', subtitle:'routeLabel'}},
})

export const journalArticle = defineType({
  name: 'journalArticle', title: 'Journal article', type: 'document',
  fields: [
    defineField({name:'title', title:'Title', type:'string', validation: r=>r.required()}),
    defineField({name:'slug', title:'Web address', type:'slug', options:{source:'title'}, validation: r=>r.required()}),
    defineField({name:'kicker', title:'Kicker', type:'string', description:'e.g. "Air · Tasmania".'}),
    defineField({name:'standfirst', title:'Standfirst', type:'text', rows:2}),
    defineField({name:'heroMedia', title:'Hero image', type:'reference', to:[{type:'mediaAsset'}]}),
    defineField({name:'body', title:'Body', type:'array', of:[{type:'block'},
      {type:'reference', title:'Inline frame', to:[{type:'mediaAsset'}]}]}),
    defineField({name:'pillars', title:'Pillars', type:'array', of:[{type:'string'}], options:{list:['air','sea','stay']}}),
    defineField({name:'featured', title:'Featured story', type:'boolean', initialValue:false}),
    ...listingFields,
    defineField({name:'related', title:'Related entries', type:'array', of:[{type:'relatedLink'}]}),
  ],
})

export const event = defineType({
  name: 'event', title: 'Event', type: 'document',
  fields: [
    defineField({name:'title', title:'Title', type:'string', validation: r=>r.required()}),
    defineField({name:'slug', title:'Web address', type:'slug', options:{source:'title'}}),
    defineField({name:'essence', title:'Essence', type:'text', rows:2}),
    defineField({name:'dateFrom', title:'From', type:'date'}),
    defineField({name:'dateTo', title:'To', type:'date'}),
    defineField({name:'destination', title:'Destination', type:'reference', to:[{type:'destination'}]}),
    ...listingFields,
    defineField({name:'related', title:'Related entries', type:'array', of:[{type:'relatedLink'}]}),
  ],
})

export const partner = defineType({
  name: 'partner', title: 'Partner', type: 'document',
  description: 'Commercial counterparties. Most render only as an attribution line, never by name.',
  fields: [
    defineField({name:'name', title:'Name (internal)', type:'string', validation: r=>r.required()}),
    defineField({name:'publicAttribution', title:'Public wording override (rare)', type:'string',
      description:'Usually blank — the standard line renders from the relationship mode.'}),
    defineField({name:'showName', title:'May be named publicly', type:'boolean', initialValue:false,
      description:'Only where contractually agreed.'}),
    defineField({name:'notes', title:'Internal notes', type:'text', rows:3}),
  ],
})

export const mediaAsset = defineType({
  name: 'mediaAsset', title: 'Photography & film', type: 'document',
  fields: [
    defineField({name:'title', title:'Title', type:'string', validation: r=>r.required()}),
    defineField({name:'kind', title:'Kind', type:'string', options:{list:['still','motion']}, validation: r=>r.required()}),
    defineField({name:'image', title:'Image', type:'image', options:{hotspot:true},
      hidden: ({parent}) => (parent as any)?.kind === 'motion'}),
    defineField({name:'mobileImage', title:'Mobile crop (optional)', type:'image', options:{hotspot:true},
      description:'Only if the desktop crop does not survive a tall screen.'}),
    defineField({name:'video', title:'Film file', type:'file', options:{accept:'video/mp4'},
      hidden: ({parent}) => (parent as any)?.kind !== 'motion'}),
    defineField({name:'poster', title:'Poster frame (required for film)', type:'image',
      hidden: ({parent}) => (parent as any)?.kind !== 'motion',
      validation: r => r.custom((v, ctx) => (ctx.parent as any)?.kind === 'motion' && !v ? 'Every film needs a poster frame.' : true)}),
    defineField({name:'ratio', title:'Ratio', type:'string', options:{list:['21:9','16:9','4:5','3:2','1:1']}, validation: r=>r.required()}),
    defineField({name:'altText', title:'Alt text (what a screen reader hears)', type:'string',
      validation: r => r.custom((v, ctx) => !(ctx.parent as any)?.placeholder && !v ? 'Alt text is required before real media publishes.' : true)}),
    defineField({name:'credit', title:'Credit', type:'string'}),
    defineField({name:'placeholder', title:'Placeholder (awaiting commissioned media)', type:'boolean', initialValue:true,
      description:'On: the tonal frame + shot brief renders. The commission list is simply every asset with this on.'}),
    defineField({name:'shotSubject', title:'Shot brief — subject', type:'string'}),
    defineField({name:'shotLocation', title:'Shot brief — location', type:'string'}),
    defineField({name:'shotTimeOfDay', title:'Shot brief — time of day', type:'string'}),
    defineField({name:'humanPresence', title:'Human presence in frame', type:'boolean', initialValue:false}),
    defineField({name:'fix', title:'Chart fix (for the corner coordinate detail)', type:'fix'}),
  ],
  preview: {select:{title:'title', subtitle:'ratio', media:'image'}},
})

export const person = defineType({
  name: 'person', title: 'Team member (internal)', type: 'document',
  fields: [
    defineField({name:'name', title:'Name', type:'string', validation: r=>r.required()}),
    defineField({name:'role', title:'Role', type:'string'}),
    defineField({name:'email', title:'Email (server-side routing only — never rendered)', type:'string',
      validation: r=>r.required().email()}),
    defineField({name:'repliesToEnquiries', title:'Replies to enquiries', type:'boolean', initialValue:false}),
  ],
})

export const enquiry = defineType({
  name: 'enquiry', title: 'Enquiry (read-only record)', type: 'document',
  readOnly: true,
  description: 'Created automatically by the Journey Engine. Review here; reply from your inbox or CRM.',
  fields: [
    defineField({name:'receivedAt', title:'Received', type:'datetime'}),
    defineField({name:'clientName', title:'Name', type:'string'}),
    defineField({name:'clientEmail', title:'Email', type:'string'}),
    defineField({name:'clientPhone', title:'Phone', type:'string'}),
    defineField({name:'contactPref', title:'Preferred contact', type:'string'}),
    defineField({name:'timeframe', title:'Planning timeframe', type:'string'}),
    defineField({name:'destination', title:'Destination', type:'string'}),
    defineField({name:'modes', title:'Modes', type:'array', of:[{type:'string'}]}),
    defineField({name:'adults', title:'Adults', type:'number'}),
    defineField({name:'children', title:'Children', type:'number'}),
    defineField({name:'occasion', title:'Occasion', type:'string'}),
    defineField({name:'whenSummary', title:'Timing', type:'string'}),
    defineField({name:'shapes', title:'Experiences chosen', type:'array', of:[{type:'string'}]}),
    defineField({name:'story', title:'The journey they imagine', type:'text'}),
    defineField({name:'course', title:'Plotted course', type:'array', of:[{type:'journeyLeg'}]}),
    defineField({name:'sourcePage', title:'Source page', type:'string'}),
    defineField({name:'sourceCta', title:'Source CTA', type:'string'}),
    defineField({name:'consent', title:'Consent given', type:'boolean'}),
    defineField({name:'routedTo', title:'Routed to', type:'string'}),
    defineField({name:'status', title:'Status', type:'string', readOnly:false,
      options:{list:['new','in-conversation','itinerary-shaping','confirmed','closed']}, initialValue:'new'}),
  ],
  preview: {select:{title:'clientName', subtitle:'destination'}},
})

export const siteSettings = defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document',
  description: 'One document for the whole site. Changing the promise wording here changes it everywhere it renders.',
  fields: [
    defineField({name:'brandStatement', title:'Brand statement (footer)', type:'string',
      initialValue:'Precision-crafted journeys by air, sea and stay.'}),
    defineField({name:'homeFeaturedJourney', title:'Homepage — featured journey', type:'reference', to:[{type:'journey'}]}),
    defineField({name:'homeFeaturedStories', title:'Homepage — featured journal', type:'array',
      of:[{type:'reference', to:[{type:'journalArticle'}]}], validation: r=>r.max(3)}),
    defineField({name:'promiseReplyTime', title:'Reply promise', type:'string', initialValue:'within one business day',
      description:'Rendered verbatim in the Journey Engine confirmation and footer. Only promise what Operations honours.'}),
    defineField({name:'promiseHumanLine', title:'Human planning line', type:'string',
      initialValue:'No automated itinerary will ever replace thoughtful planning.'}),
    defineField({name:'enquiryPrimaryOwner', title:'Enquiries — primary owner', type:'reference', to:[{type:'person'}], validation: r=>r.required()}),
    defineField({name:'enquiryBackupOwner', title:'Enquiries — backup owner', type:'reference', to:[{type:'person'}], validation: r=>r.required()}),
    defineField({name:'crmDestination', title:'CRM / inbox destination label', type:'string',
      description:'Internal label only, e.g. "Shared journeys inbox". Actual addresses live in server settings, never here.'}),
    defineField({name:'escalationRules', title:'Escalation rules', type:'array', of:[{type:'object', fields:[
      defineField({name:'when', title:'When', type:'string',
        options:{list:['no-reply-within','keyword','timeframe-soon','destination']}}),
      defineField({name:'value', title:'Value', type:'string', description:'e.g. "1 business day" or "urgent".'}),
      defineField({name:'then', title:'Then', type:'string',
        options:{list:['notify-backup','notify-both','priority-flag']}}),
    ]}]}),
    defineField({name:'attributionLines', title:'Attribution wording per relationship mode', type:'array',
      of:[{type:'object', fields:[
        defineField({name:'mode', title:'Mode', type:'string'}),
        defineField({name:'line', title:'Rendered line', type:'string'}),
      ]}],
      description:'Operations-only. These are the ONLY editable ownership words on the platform.'}),
  ],
})

export const editorialOps = [journeyLeg, journey, journalArticle, event, partner, mediaAsset, person, enquiry, siteSettings]
