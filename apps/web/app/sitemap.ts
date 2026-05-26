import type { MetadataRoute } from 'next'

import { env } from '@/env'
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
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  const blogRoutes = blogSource.getPages().map((page) => `/blog/${page.slugs[0]}`)
  const paths = [...PUBLIC_ROUTES, ...blogRoutes]

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/docs') ? 0.7 : 0.8,
  }))
}
