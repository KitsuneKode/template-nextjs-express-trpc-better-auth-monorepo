import type { BlogPostSummary } from '@/lib/blog'
import { absoluteSiteUrl, defaultOgImageAbsoluteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo'

type Props = {
  posts: BlogPostSummary[]
}

export function BlogJsonLd({ posts }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} blog`,
    description: SITE_DESCRIPTION,
    url: absoluteSiteUrl('/blog'),
    image: defaultOgImageAbsoluteUrl(),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    blogPost: posts.slice(0, 12).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: absoluteSiteUrl(post.url),
      datePublished: post.date,
    })),
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
