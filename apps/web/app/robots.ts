import type { MetadataRoute } from 'next'
import { env } from '@/env'

export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/__design-lab/'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
