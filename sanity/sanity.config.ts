import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {deskStructure} from './deskStructure'

export default defineConfig({
  name: 'waypoint',
  title: 'WAYPOINT & Co.',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({structure: deskStructure}), visionTool()],
  schema: {types: schemaTypes},
  document: {
    /* Draft preview URLs — drafts render behind PREVIEW_SECRET, never indexed */
    productionUrl: async (prev, {document}) => {
      const slug = (document as any)?.slug?.current
      if (!slug) return prev
      const base = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:5173'
      return `${base}/preview?secret=__SET_IN_ENV__&type=${document._type}&slug=${slug}`
    },
  },
})
