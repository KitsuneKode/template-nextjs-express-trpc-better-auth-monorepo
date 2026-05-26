import { Metadata } from 'next'
import { Suspense } from 'react'

import { Navbar } from '@/components/arche/navbar'
import { HeroBlock, SiteFrame, SiteShell, StatusPill } from '@/components/arche/site-primitives'
import { BlogCategoryNav } from '@/components/blog/blog-category-nav'
import { BlogPostFeed, BlogPostFeedSkeleton } from '@/components/blog/blog-post-feed'
import { isBlogCategory } from '@/lib/blog-source'

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
    title: 'Arche journal',
    description: 'Changelog, guides, and technical notes from the Arche project.',
    url: '/blog',
  },
}

type Props = {
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ searchParams }: Props) {
  const { category: categoryParam } = await searchParams
  const activeCategory = isBlogCategory(categoryParam) ? categoryParam : 'all'

  return (
    <SiteShell className="overflow-x-hidden">
      <Navbar />
      <SiteFrame>
        <HeroBlock
          eyebrow={<StatusPill tone="muted">Writing</StatusPill>}
          title="Arche"
          outline="journal."
          className="md:p-12"
        >
          Changelog entries, functional guides, and technical deep dives—one feed, filtered by
          intent.
        </HeroBlock>

        <section className="border-b border-zinc-800 bg-black px-6 py-6 md:px-12">
          <BlogCategoryNav activeCategory={activeCategory} />
        </section>

        <section className="flex-1 bg-black">
          <Suspense fallback={<BlogPostFeedSkeleton />}>
            <BlogPostFeed category={categoryParam} />
          </Suspense>
        </section>
      </SiteFrame>
    </SiteShell>
  )
}
