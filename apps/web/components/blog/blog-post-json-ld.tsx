import { env } from '@/env'
import { blogOgImagePath, blogPostAbsoluteUrl, getBlogFrontmatter, type BlogPage } from '@/lib/blog'

type Props = {
  page: BlogPage
}

export function BlogPostJsonLd({ page }: Props) {
  const data = getBlogFrontmatter(page)
  const slug = page.slugs[0] ?? ''
  const url = blogPostAbsoluteUrl(slug)
  const imagePath = blogOgImagePath(data.title, data.image)
  const image =
    imagePath.startsWith('http://') || imagePath.startsWith('https://')
      ? imagePath
      : `${env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description,
    datePublished: data.date,
    dateModified: data.date,
    url,
    image,
    author: {
      '@type': 'Person',
      name: data.author ?? 'KitsuneKode',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Arche',
    },
    keywords: data.tags?.join(', '),
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
