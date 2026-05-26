import { pageSchema } from 'fumadocs-core/source/schema'
import { defineCollections, defineConfig, defineDocs } from 'fumadocs-mdx/config'
import { z } from 'zod'

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: pageSchema.extend({
    date: z.string(),
    category: z.enum(['changelog', 'guide', 'technical']),
    draft: z.boolean().optional(),
    image: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
})

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
})

export default defineConfig()
