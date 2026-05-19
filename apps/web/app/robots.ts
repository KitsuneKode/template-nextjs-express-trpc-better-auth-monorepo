import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_mockups/'],
    },
    sitemap: 'https://arche.kitsunelabs.xyz/sitemap.xml',
  }
}
