import type { MetadataRoute } from 'next'
import { env } from '@/env'

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
  '/examples',
  '/blog',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  return PUBLIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/docs') ? 0.7 : 0.8,
  }))
}
