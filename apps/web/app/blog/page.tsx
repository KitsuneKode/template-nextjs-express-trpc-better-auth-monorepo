import Link from 'next/link'
import { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { cookies } from 'next/headers'
import { prisma } from '@template/store'
import { Footer } from '@/components/landing/Footer'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { ArrowRight, Calendar, Clock } from '@template/ui/components/icons'
import { resolveSiteDesign, SITE_DESIGN_COOKIE_NAME } from '@/lib/site-design'
import { SectionShell } from '@/components/landing-premium/primitives/section-shell'
import { PremiumBlogList } from '@/components/landing-premium/sections/premium-blog-list'
import { PremiumSiteShell } from '@/components/landing-premium/primitives/premium-site-shell'

export const metadata: Metadata = {
  title: 'Blog | Template',
  description: 'Insights, tutorials, and updates from the team.',
}

async function getPublishedPosts() {
  'use cache'
  cacheLife('days')

  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  })
}

export default async function BlogIndexPage() {
  const [cookieStore, posts] = await Promise.all([
    cookies(),
    getPublishedPosts(),
  ])
  const design = resolveSiteDesign(
    cookieStore.get(SITE_DESIGN_COOKIE_NAME)?.value,
  )

  if (design === 'design2') {
    return (
      <PremiumSiteShell>
        <SectionShell
          eyebrow="Premium Blog"
          title="Architecture notes, delivery patterns, and implementation deep dives."
          description="Curated writing from the same system language as the premium landing experience."
        >
          <PremiumBlogList posts={posts} basePath="/blog" />
        </SectionShell>
      </PremiumSiteShell>
    )
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] selection:bg-[#D9AB72]/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 flex justify-center">
        <div className="absolute top-[-20%] h-[600px] w-[600px] rounded-full bg-[#D9AB72]/[0.03] blur-[120px]" />
      </div>

      <SectionWrapper className="relative z-10 pt-32 pb-20">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold tracking-widest text-[#D9AB72] uppercase">
            Engineering Blog
          </p>
          <h1 className="font-serif text-5xl font-medium tracking-tight text-[#FAFAFA] sm:text-6xl">
            Thoughts & Updates
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#A1A1AA]">
            Deep dives into modern web development, monorepo architectures, and
            building scalable systems.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:bg-white/[0.04]"
            >
              <div className="relative z-10 flex h-full flex-col p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-4 text-xs font-medium tracking-wide text-[#71717A] uppercase">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={14} />
                    {Math.ceil(post.content.length / 1000)} min read
                  </span>
                </div>

                <h2 className="mb-3 font-serif text-2xl font-medium tracking-tight text-[#FAFAFA] transition-colors group-hover:text-[#D9AB72]">
                  {post.title}
                </h2>

                <p className="mb-8 line-clamp-3 flex-1 text-sm leading-relaxed text-[#A1A1AA]">
                  {post.content.substring(0, 150)}...
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs font-medium text-[#D9AB72] ring-1 ring-white/10">
                      {post.author.name?.[0] || 'A'}
                    </div>
                    <span className="text-sm font-medium text-[#D4D4D8]">
                      {post.author.name || 'Anonymous'}
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-[#D9AB72] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                    Read Article <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
            <h3 className="mb-2 font-serif text-xl font-medium text-[#FAFAFA]">
              No posts found
            </h3>
            <p className="text-sm text-[#A1A1AA]">
              Check back later for new content.
            </p>
          </div>
        )}
      </SectionWrapper>
      <Footer />
    </main>
  )
}
