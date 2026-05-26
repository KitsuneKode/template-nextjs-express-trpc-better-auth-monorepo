import type { MetadataRoute } from 'next'

import { env } from '@/env'
import { getBlogFrontmatter } from '@/lib/blog'
import { blogSource } from '@/lib/blog-source'

const PUBLIC_ROUTES = [
  '',
  '/families',
  '/docs',
  '/docs/deploy',
  '/docs/architecture',
  '/docs/auth',
  '/docs/cli',
  '/docs/security',
  '/docs/trpc',
  '/docs/store',
  '/docs/scaling',
  '/docs/guides/first-hour',
  '/docs/guides/agent-context',
  '/docs/guides/verification-and-presets',
  '/docs/guides/package-managers',
  '/examples',
  '/blog',
  '/rss.xml',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')

  const staticEntries: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/docs') ? 0.7 : 0.8,
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

  return [...staticEntries, ...blogEntries]
}
