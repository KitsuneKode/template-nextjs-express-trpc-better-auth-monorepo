import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'

import { blog } from '../.source/server'

export const blogSource = loader({
  baseUrl: '/blog',
  source: toFumadocsSource(blog, []),
})

export type BlogCategory = 'changelog' | 'guide' | 'technical'

export function isBlogCategory(value: string | undefined): value is BlogCategory {
  return value === 'changelog' || value === 'guide' || value === 'technical'
}
