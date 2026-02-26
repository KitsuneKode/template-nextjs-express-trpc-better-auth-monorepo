import Link from 'next/link'
import { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { prisma } from '@template/store'
import { ArrowRight, Calendar, Clock, User } from '@template/ui/components/icons'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { AnimatedGradient } from '@/components/ui/animated-gradient'

export const metadata: Metadata = {
  title: 'Blog | Template',
  description: 'Insights, tutorials, and updates from the team.',
}

export default async function BlogIndexPage() {
  'use cache'
  cacheLife('days')

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  })

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-[var(--solar-purple)] selection:text-white">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
        <AnimatedGradient />
      </div>

      <SectionWrapper className="relative z-10 pt-32 pb-20">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h1 className="mb-6 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            Engineering Blog
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-neutral-400">
            Deep dives into modern web development, monorepo architectures, and
            building scalable systems.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors duration-300 hover:border-[var(--solar-purple)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--solar-purple)]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex h-full flex-col p-8">
                <div className="mb-4 flex items-center gap-4 text-sm text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {Math.ceil(post.content.length / 1000)} min read
                  </span>
                </div>

                <h2 className="mb-3 text-2xl font-bold transition-colors group-hover:text-[var(--solar-teal)]">
                  {post.title}
                </h2>

                <p className="mb-6 line-clamp-3 flex-1 text-neutral-400">
                  {post.content.substring(0, 150)}...
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--solar-orange)] to-[var(--solar-magenta)] text-xs font-bold">
                      {post.author.name?.[0] || 'A'}
                    </div>
                    <span className="text-sm font-medium text-neutral-300">
                      {post.author.name || 'Anonymous'}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-[var(--solar-teal)] transition-transform group-hover:translate-x-1">
                    Read Article <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/50 py-20 text-center">
            <h3 className="mb-2 text-xl font-semibold text-neutral-300">
              No posts found
            </h3>
            <p className="text-neutral-500">
              Check back later for new content.
            </p>
          </div>
        )}
      </SectionWrapper>
    </main>
  )
}
