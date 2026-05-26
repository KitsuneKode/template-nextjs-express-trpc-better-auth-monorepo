import type { Metadata } from 'next'
import { cacheLife, cacheTag } from 'next/cache'

import { getBlogCategory, getBlogFrontmatter } from '@/lib/blog'
import { blogSource } from '@/lib/blog-source'
import { buildDocsPageMetadata } from '@/lib/seo'
import { buildSitemapEntries } from '@/lib/sitemap-data'
import { source } from '@/lib/source'

const CONTENT_CACHE_TAG = 'site-content'

function tagContent(kind: 'docs' | 'blog' | 'sitemap', key?: string) {
  cacheTag(CONTENT_CACHE_TAG, kind, ...(key ? [key] : []))
}

export async function getCachedDocsMetadata(slug: string[]): Promise<Metadata> {
  'use cache'
  cacheLife('max')
  tagContent('docs', slug.join('/') || 'index')

  const page = source.getPage(slug)
  if (!page) return { title: 'Not found' }
  return buildDocsPageMetadata(page)
}

export type DocsOgFields = {
  title: string
  description?: string
}

export async function getCachedDocsOgFields(slug: string[]): Promise<DocsOgFields> {
  'use cache'
  cacheLife('max')
  tagContent('docs', slug.join('/') || 'index')

  const page = source.getPage(slug)
  return {
    title: page?.data.title ?? 'Arche docs',
    description: page?.data.description,
  }
}

export type BlogOgFields = {
  title: string
  description?: string
  category: string
}

export async function getCachedBlogOgFields(slug: string): Promise<BlogOgFields> {
  'use cache'
  cacheLife('max')
  tagContent('blog', slug)

  const page = blogSource.getPage([slug])
  return {
    title: page ? getBlogFrontmatter(page).title : 'Arche blog',
    description: page ? getBlogFrontmatter(page).description : undefined,
    category: page ? getBlogCategory(page) : 'technical',
  }
}

export async function getCachedSitemap() {
  'use cache'
  cacheLife('max')
  tagContent('sitemap')

  const { env } = await import('@/env')
  return buildSitemapEntries(env.NEXT_PUBLIC_SITE_URL)
}
