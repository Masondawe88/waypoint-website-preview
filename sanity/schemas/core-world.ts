import {defineType, defineField} from 'sanity'
import {listingFields} from './objects'

/* ============================================================
   WORLD TYPES — destination, place, waypoint
   ============================================================ */

export const destination = defineType({
  name: 'destination', title: 'Destination', type: 'document',
  groups: [{name:'story',title:'Story'},{name:'facts',title:'Facts'},{name:'connections',title:'Connections'}],
  fields: [
    defineField({name:'title', title:'Name', type:'string', validation: r=>r.required(), group:'story'}),
    defineField({name:'slug', title:'Web address', type:'slug', options:{source:'title'}, validation: r=>r.required(), group:'story',
      description:'Set once and never change — links across the site depend on it.'}),
    defineField({name:'essence', title:'Essence (the italic line)', type:'text', rows:3, validation: r=>r.required().max(320), group:'story',
      description:'The short editorial voice of the place, under 45 words.'}),
    defineField({name:'introduction', title:'Introduction', type:'array', of:[{type:'block'}], group:'story'}),
    defineField({name:'heroMedia', title:'Hero image or film', type:'reference', to:[{type:'mediaAsset'}], group:'story'}),
    defineField({name:'gallery', title:'Gallery', type:'array', of:[{type:'reference', to:[{type:'mediaAsset'}]}], group:'story'}),
    defineField({name:'sceneKey', title:'Scene key', type:'string', group:'story',
      description:'Matches the front-end colour-grade / placeholder scene, e.g. "whitsundays".'}),
    defineField({name:'fix', title:'Chart fix', type:'fix', group:'facts'}),
    defineField({name:'region', title:'Region', type:'string', options:{list:['qld','nsw','tas','international']}, group:'facts'}),
    defineField({name:'seasonBest', title:'Best season (displayed)', type:'string', group:'facts',
      description:'e.g. "May — November" or "Year round".'}),
    defineField({name:'charterLength', title:'Suggested charter (displayed)', type:'string', group:'facts',
      description:'e.g. "3 — 7 days".'}),
    defineField({name:'sunTimes', title:'Sunrise · sunset (displayed)', type:'string', group:'facts'}),
    defineField({name:'sunTimesVerified', title:'Sun times verified by Operations', type:'boolean', initialValue:false, group:'facts'}),
    defineField({name:'services', title:'Services available here', type:'array', of:[{type:'string'}],
      options:{list:['air','sea','stay','experience']}, group:'facts'}),
    defineField({name:'origin', title:'Default departure label', type:'string', initialValue:'Brisbane', group:'facts',
      description:'The first node on a plotted course, e.g. "Brisbane" or "Your city".'}),
    defineField({name:'horizon', title:'Horizon destination ("by arrangement")', type:'boolean', initialValue:false, group:'facts',
      description:'On: facts tables are hidden and "by arrangement" language renders.'}),
    defineField({name:'byModeAir', title:'Canonical AIR answer', type:'reference', to:[{type:'aircraft'}], group:'connections'}),
    defineField({name:'byModeSea', title:'Canonical SEA answer', type:'reference', to:[{type:'vessel'}], group:'connections'}),
    defineField({name:'byModeStay', title:'Canonical STAY answer', type:'reference', to:[{type:'residence'}], group:'connections'}),
    defineField({name:'related', title:'Related entries (ordered — this IS the recommendation chain)', type:'array',
      of:[{type:'relatedLink'}], group:'connections'}),
    ...listingFields,
  ],
  preview: {select:{title:'title', subtitle:'region'}},
})

export const place = defineType({
  name: 'place', title: 'Place', type: 'document',
  description: 'A specific location inside a destination — island, beach, anchorage, airport, marina, town.',
  fields: [
    defineField({name:'name', title:'Name', type:'string', validation: r=>r.required()}),
    defineField({name:'slug', title:'Web address', type:'slug', options:{source:'name'}, validation: r=>r.required()}),
    defineField({name:'kind', title:'Kind', type:'string', validation: r=>r.required(),
      options:{list:['island','beach','anchorage','reef','airport','helipad','marina','town','landmark']}}),
    defineField({name:'destination', title:'Belongs to destination', type:'reference', to:[{type:'destination'}], validation: r=>r.required()}),
    defineField({name:'fix', title:'Chart fix', type:'fix'}),
    defineField({name:'essence', title:'One editorial line', type:'string', validation: r=>r.max(220)}),
    defineField({name:'media', title:'Imagery', type:'array', of:[{type:'reference', to:[{type:'mediaAsset'}]}]}),
    defineField({name:'access', title:'Reached by', type:'array', of:[{type:'string'}], options:{list:['sea','air','road']}}),
    defineField({name:'iata', title:'IATA code (airports)', type:'string',
      hidden: ({parent}) => !['airport','helipad'].includes((parent as any)?.kind)}),
    defineField({name:'icao', title:'ICAO code (airports)', type:'string',
      hidden: ({parent}) => !['airport','helipad'].includes((parent as any)?.kind)}),
    defineField({name:'operationalNotes', title:'Operational notes (internal — never published)', type:'text', rows:4,
      description:'Tides, strips, moorings, handling. For the team only.'}),
    defineField({name:'related', title:'Related entries', type:'array', of:[{type:'relatedLink'}]}),
  ],
  preview: {select:{title:'name', subtitle:'kind'}},
})

export const waypoint = defineType({
  name: 'waypoint', title: 'Waypoint (plotted course fix)', type: 'document',
  description: 'One numbered fix on a destination\u2019s plotted passage — powers the Waypoint Navigation System.',
  fields: [
    defineField({name:'place', title:'Place', type:'reference', to:[{type:'place'}], validation: r=>r.required(),
      description:'The waypoint borrows the place\u2019s name, fix and imagery.'}),
    defineField({name:'sequence', title:'Sequence (WPT number)', type:'number', validation: r=>r.required().min(1)}),
    defineField({name:'essence', title:'One line for this fix', type:'string', validation: r=>r.required().max(220)}),
    defineField({name:'media', title:'Frame for this fix', type:'reference', to:[{type:'mediaAsset'}]}),
    defineField({name:'legToNext', title:'Leg to the next fix', type:'passage'}),
  ],
  orderings: [{title:'Sequence', name:'seq', by:[{field:'sequence', direction:'asc'}]}],
  preview: {select:{title:'place.name', subtitle:'sequence'},
    prepare:(s:any)=>({title:s.title||'Waypoint', subtitle:'WPT '+String(s.subtitle||'').padStart(2,'0')})},
})
