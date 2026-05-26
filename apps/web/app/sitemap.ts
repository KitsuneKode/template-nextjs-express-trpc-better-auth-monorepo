import type { MetadataRoute } from 'next'

import { env } from '@/env'
import { getBlogFrontmatter } from '@/lib/blog'
import { blogSource } from '@/lib/blog-source'
import { source } from '@/lib/source'

const PUBLIC_ROUTES = ['', '/families', '/examples', '/blog', '/rss.xml'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')

  const staticEntries: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }))

  const docsEntries: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${base}${page.url}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: page.url === '/docs/getting-started' ? 0.85 : 0.7,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogSource
    .getPages()
    .filter((page) => !getBlogFrontmatter(page).draft)
    .map((page) => {
      const data = getBlogFrontmatter(page)
      const slug = page.slugs[0]
      const lastModified = data.date
        ? new Date(data.date.includes('T') ? data.date : `${data.date}T00:00:00`)
        : new Date()

      return {
        url: `${base}/blog/${slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      }
    })

  return [...staticEntries, ...docsEntries, ...blogEntries]
}
