import { Metadata } from 'next'

import { BlogIndexShell } from '@/components/blog/blog-index-shell'
import { BlogPostFeed } from '@/components/blog/blog-post-feed'
import { BlogJsonLd } from '@/components/seo/blog-json-ld'
import { getPublishedBlogSummaries } from '@/lib/blog'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Blog',
  description: 'Changelog, guides, and technical notes from the Arche project.',
  path: '/blog',
  alternateTypes: {
    'application/rss+xml': '/rss.xml',
  },
})

export default async function BlogPage() {
  const posts = await getPublishedBlogSummaries()

  return (
    <BlogIndexShell activeCategory="all">
      <BlogJsonLd />
      <BlogPostFeed posts={posts} />
    </BlogIndexShell>
  )
}
