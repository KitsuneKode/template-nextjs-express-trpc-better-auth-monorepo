import {
  blogPostAbsoluteUrl,
  blogPostOgAbsoluteUrl,
  getBlogCategory,
  getBlogFrontmatter,
  type BlogPage,
} from '@/lib/blog'

type Props = {
  page: BlogPage
}

export function BlogPostJsonLd({ page }: Props) {
  const data = getBlogFrontmatter(page)
  const slug = page.slugs[0] ?? ''
  const url = blogPostAbsoluteUrl(slug)
  const image = blogPostOgAbsoluteUrl(slug, data.image)
  const category = getBlogCategory(page)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description,
    datePublished: data.date,
    dateModified: data.date,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category,
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
