import { absoluteSiteUrl, defaultOgImageAbsoluteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo'

export function SiteJsonLd() {
  const siteUrl = absoluteSiteUrl('/')
  const logoUrl = absoluteSiteUrl('/brand/arche-mark.svg')
  const ogImage = defaultOgImageAbsoluteUrl()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}#organization`,
        name: SITE_NAME,
        url: siteUrl,
        logo: logoUrl,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}#website`,
        name: SITE_NAME,
        url: siteUrl,
        description: SITE_DESCRIPTION,
        publisher: { '@id': `${siteUrl}#organization` },
        image: ogImage,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
