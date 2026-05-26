import { breadcrumbListJsonLd, buildDocsBreadcrumbs } from '@/lib/docs-breadcrumbs'
import { absoluteSiteUrl, docsOgImageAbsoluteUrl } from '@/lib/seo'

type Props = {
  title: string
  description?: string
  path: string
  slug: string[]
}

export function DocsPageJsonLd({ title, description, path, slug }: Props) {
  const url = absoluteSiteUrl(path)
  const image = docsOgImageAbsoluteUrl(path)
  const breadcrumbs = breadcrumbListJsonLd(buildDocsBreadcrumbs(slug, title))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: title,
        description,
        url,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        image,
        author: {
          '@type': 'Organization',
          name: 'Arche',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Arche',
        },
      },
      breadcrumbs,
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
