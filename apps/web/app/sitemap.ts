import type { MetadataRoute } from 'next'

import { getCachedSitemap } from '@/lib/content-cache'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getCachedSitemap()
}
