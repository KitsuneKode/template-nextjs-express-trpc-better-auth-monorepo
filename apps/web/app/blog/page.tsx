import { Metadata } from 'next'

import { BlogIndexShell } from '@/components/blog/blog-index-shell'
import { BlogPostFeed } from '@/components/blog/blog-post-feed'
import { getPublishedBlogSummaries } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Changelog, guides, and technical notes from the Arche project.',
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  openGraph: {
    title: 'Arche blog',
    description: 'Changelog, guides, and technical notes from the Arche project.',
    url: '/blog',
  },
}

export default async function BlogPage() {
  const posts = await getPublishedBlogSummaries()

  return (
    <BlogIndexShell activeCategory="all">
      <BlogPostFeed posts={posts} />
    </BlogIndexShell>
  )
}
