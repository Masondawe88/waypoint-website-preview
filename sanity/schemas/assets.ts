import {defineType, defineField} from 'sanity'
import {listingFields} from './objects'

/* ============================================================
   ASSET TYPES — vessel, residence, aircraft, experience
   ============================================================ */

const specNote = 'Leave blank until confirmed. Blank numbers render as "—" on the website — never guessed.'

export const vessel = defineType({
  name: 'vessel', title: 'Yacht', type: 'document',
  groups: [{name:'story',title:'Story'},{name:'specs',title:'Specifications'},{name:'commercial',title:'Commercial'}],
  fields: [
    defineField({name:'name', title:'Name', type:'string', validation: r=>r.required(), group:'story'}),
    defineField({name:'slug', title:'Web address', type:'slug', options:{source:'name'}, validation: r=>r.required(), group:'story'}),
    defineField({name:'type', title:'Type line', type:'string', description:'e.g. "Luxury motor yacht".', group:'story'}),
    defineField({name:'homeDestination', title:'Home waters', type:'reference', to:[{type:'destination'}], validation: r=>r.required(), group:'story'}),
    defineField({name:'essence', title:'Design story (short)', type:'text', rows:4, validation: r=>r.required().max(420), group:'story'}),
    defineField({name:'idealCharter', title:'Ideal charter line', type:'string', group:'story',
      description:'e.g. "3 to 7 days, Whitsundays and outer reef."'}),
    defineField({name:'heroMedia', title:'Hero image or film', type:'reference', to:[{type:'mediaAsset'}], group:'story'}),
    defineField({name:'gallery', title:'Gallery', type:'array', of:[{type:'reference', to:[{type:'mediaAsset'}]}], group:'story'}),
    defineField({name:'loaMetres', title:'Length overall (m)', type:'number', description:specNote, group:'specs'}),
    defineField({name:'guestsDay', title:'Guests — day', type:'number', description:specNote, group:'specs'}),
    defineField({name:'guestsOvernight', title:'Guests — overnight', type:'number', description:specNote, group:'specs'}),
    defineField({name:'cabins', title:'Cabins', type:'number', description:specNote, group:'specs'}),
    defineField({name:'crew', title:'Crew', type:'number', description:specNote, group:'specs'}),
    defineField({name:'cruisingSpeedKts', title:'Cruising speed (kts)', type:'number', description:specNote, group:'specs'}),
    defineField({name:'specsVerified', title:'Specifications verified by Operations', type:'boolean', initialValue:false, group:'specs',
      description:'Only Operations switches this on. Off = every number renders "—".'}),
    defineField({name:'commercialRelationship', title:'Commercial relationship', type:'commercialRelationship',
      validation: r=>r.required(), group:'commercial'}),
    ...listingFields,
    defineField({name:'related', title:'Related entries', type:'array', of:[{type:'relatedLink'}], group:'commercial'}),
  ],
  preview: {select:{title:'name', subtitle:'homeDestination.title'}},
})

export const residence = defineType({
  name: 'residence', title: 'Residence', type: 'document',
  fields: [
    defineField({name:'name', title:'Name', type:'string', validation: r=>r.required()}),
    defineField({name:'slug', title:'Web address', type:'slug', options:{source:'name'}, validation: r=>r.required()}),
    defineField({name:'destination', title:'Destination', type:'reference', to:[{type:'destination'}], validation: r=>r.required()}),
    defineField({name:'place', title:'Place (optional)', type:'reference', to:[{type:'place'}]}),
    defineField({name:'essence', title:'Essence', type:'text', rows:4, validation: r=>r.required().max(420)}),
    defineField({name:'heroMedia', title:'Hero image', type:'reference', to:[{type:'mediaAsset'}]}),
    defineField({name:'gallery', title:'Gallery', type:'array', of:[{type:'reference', to:[{type:'mediaAsset'}]}]}),
    defineField({name:'bedrooms', title:'Bedrooms', type:'number', description:specNote}),
    defineField({name:'guests', title:'Guests', type:'number', description:specNote}),
    defineField({name:'setting', title:'Setting line', type:'string'}),
    defineField({name:'specsVerified', title:'Details verified by Operations', type:'boolean', initialValue:false}),
    defineField({name:'commercialRelationship', title:'Commercial relationship', type:'commercialRelationship', validation: r=>r.required()}),
    ...listingFields,
    defineField({name:'related', title:'Related entries', type:'array', of:[{type:'relatedLink'}]}),
  ],
  preview: {select:{title:'name', subtitle:'destination.title'}},
})

export const aircraft = defineType({
  name: 'aircraft', title: 'Aircraft category', type: 'document',
  description: 'A capability class (e.g. "Turboprop — twin"), never a specific tail number. Selection is mission-led.',
  fields: [
    defineField({name:'name', title:'Category name', type:'string', validation: r=>r.required(),
      description:'e.g. "Turboprop", "Light jet", "Helicopter — single". Categories, not aircraft models.'}),
    defineField({name:'slug', title:'Web address', type:'slug', options:{source:'name'}, validation: r=>r.required()}),
    defineField({name:'category', title:'Wing', type:'string', options:{list:['fixed-wing','rotary']}, validation: r=>r.required()}),
    defineField({name:'essence', title:'Cabin character / best suited to', type:'text', rows:3, validation: r=>r.required().max(420)}),
    defineField({name:'typicalJourney', title:'Typical journey line', type:'string',
      description:'e.g. "Island transfers and regional Queensland."'}),
    defineField({name:'exampleRoute', title:'Example route line', type:'string',
      description:'e.g. "Brisbane → Hamilton Island". Editorial, not a schedule.'}),
    defineField({name:'heroMedia', title:'Image', type:'reference', to:[{type:'mediaAsset'}]}),
    defineField({name:'missionSuitability', title:'Mission suitability', type:'missionSuitability'}),
    defineField({name:'suitabilityVerified', title:'Suitability verified by Operations', type:'boolean', initialValue:false,
      description:'Off = numbers render "—" and this category never surfaces in Journey Engine suggestions.'}),
    defineField({name:'commercialRelationship', title:'Commercial relationship', type:'commercialRelationship', validation: r=>r.required()}),
    ...listingFields,
    defineField({name:'related', title:'Related entries', type:'array', of:[{type:'relatedLink'}]}),
  ],
  preview: {select:{title:'name', subtitle:'category'}},
})

export const experience = defineType({
  name: 'experience', title: 'Experience', type: 'document',
  fields: [
    defineField({name:'name', title:'Name', type:'string', validation: r=>r.required()}),
    defineField({name:'slug', title:'Web address', type:'slug', options:{source:'name'}, validation: r=>r.required()}),
    defineField({name:'kind', title:'Kind', type:'string', options:{list:['place','activity','service']}, validation: r=>r.required()}),
    defineField({name:'destination', title:'Destination (blank if portable, e.g. Private chef)', type:'reference', to:[{type:'destination'}]}),
    defineField({name:'place', title:'Place (optional)', type:'reference', to:[{type:'place'}]}),
    defineField({name:'essence', title:'One editorial line', type:'string', validation: r=>r.max(260)}),
    defineField({name:'media', title:'Image', type:'reference', to:[{type:'mediaAsset'}]}),
    defineField({name:'shapeTerm', title:'Appears in Journey Engine "Shape the experience"', type:'boolean', initialValue:false}),
    defineField({name:'stage', title:'Stage on the course', type:'string',
      options:{list:['arrive','stay','sail','experience','return']}, initialValue:'experience'}),
    ...listingFields,
    defineField({name:'related', title:'Related entries', type:'array', of:[{type:'relatedLink'}]}),
  ],
  preview: {select:{title:'name', subtitle:'kind'}},
})
