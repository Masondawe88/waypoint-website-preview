import type {StructureResolver} from 'sanity/structure'

/* The dashboard, arranged the way the house thinks — not the way the
   database thinks. Plain names, no technical language. */
export const deskStructure: StructureResolver = (S) =>
  S.list().title('WAYPOINT & Co.').items([
    S.listItem().title('The World').child(S.list().title('The World').items([
      S.documentTypeListItem('destination').title('Destinations'),
      S.documentTypeListItem('place').title('Places'),
      S.documentTypeListItem('waypoint').title('Plotted courses (waypoints)'),
    ])),
    S.listItem().title('Sea').child(S.documentTypeList('vessel').title('Yachts')),
    S.listItem().title('Stay').child(S.documentTypeList('residence').title('Residences')),
    S.listItem().title('Air').child(S.documentTypeList('aircraft').title('Aircraft categories')),
    S.listItem().title('Experiences').child(S.documentTypeList('experience').title('Experiences')),
    S.listItem().title('Journeys').child(S.documentTypeList('journey').title('Journeys')),
    S.listItem().title('Journal').child(S.list().title('Journal').items([
      S.documentTypeListItem('journalArticle').title('Articles'),
      S.documentTypeListItem('event').title('Events'),
    ])),
    S.listItem().title('Photography & film').child(S.documentTypeList('mediaAsset').title('All media')),
    S.divider(),
    S.listItem().title('Enquiries').child(
      S.documentTypeList('enquiry').title('Enquiries')
        .defaultOrdering([{field: 'receivedAt', direction: 'desc'}])),
    S.listItem().title('Operations').child(S.list().title('Operations').items([
      S.documentTypeListItem('partner').title('Partners'),
      S.documentTypeListItem('person').title('Team'),
    ])),
    S.listItem().title('Site settings').child(
      S.document().schemaType('siteSettings').documentId('siteSettings')),
  ])
