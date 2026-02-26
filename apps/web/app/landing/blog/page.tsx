import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { prisma } from '@template/store'
import { SectionShell } from '@/components/landing-premium/primitives/section-shell'
import { PremiumBlogList } from '@/components/landing-premium/sections/premium-blog-list'

export const metadata: Metadata = {
  title: 'Premium Blog | Kitsune Stack',
  description: 'Editorial articles styled for the premium landing experience.',
}

export default async function LandingBlogPage() {
  'use cache'
  cacheLife('days')

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  })

  return (
    <SectionShell
      eyebrow="Premium Blog"
      title="Architecture notes, delivery patterns, and implementation deep dives."
      description="Curated writing from the same system language as the premium landing experience."
    >
      <PremiumBlogList posts={posts} />
    </SectionShell>
  )
}
