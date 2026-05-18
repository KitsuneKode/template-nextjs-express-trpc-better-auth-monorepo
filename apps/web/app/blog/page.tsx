import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/arche/navbar'

export const metadata: Metadata = {
  title: 'Engineering Blog',
  description: 'Thoughts on architecture, AI engineering, and the future of development.',
}

export const posts = [
  {
    slug: 'agent-first-philosophy',
    title: 'The Agent-First Philosophy',
    date: 'May 18, 2026',
    excerpt: 'Why we built Arche with native support for AI agents like Claude and Cursor.',
    category: 'Architecture',
  },
  {
    slug: 'mastering-monorepos-2026',
    title: 'Monorepo vs Polyrepo in 2026',
    date: 'May 10, 2026',
    excerpt: 'Exploring the scaling benefits of Turborepo for mid-sized engineering teams.',
    category: 'Engineering',
  },
  {
    slug: 'typesafe-api-glue',
    title: 'The Typesafe API Glue',
    date: 'May 05, 2026',
    excerpt: 'How tRPC and Prisma create a seamless data flow from DB to UI.',
    category: 'Productivity',
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black font-sans text-white selection:bg-white selection:text-black">
      <Navbar />

      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1200px] flex-col border-r border-l border-zinc-800">
        {/* Header Area */}
        <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 text-left md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 flex max-w-3xl flex-col items-start">
            <div className="mb-8 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-[4px_4px_0_0_rgba(39,39,42,1)]">
              Engineering Blog
            </div>

            <h1 className="mb-8 text-5xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-7xl">
              The <br />
              <span className="text-stroke-white text-transparent">Changelog.</span>
            </h1>

            <p className="text-xl leading-snug font-medium text-zinc-300">
              Deep dives into the technical decisions that power Arche.
            </p>
          </div>
        </section>

        {/* Blog Feed */}
        <section className="flex-1 bg-black">
          <div className="divide-y divide-zinc-800 border-b border-zinc-800">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block p-6 transition-colors hover:bg-zinc-950 md:p-16"
              >
                <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                      {post.date}
                    </span>
                    <span className="size-1 rounded-full bg-zinc-800" />
                    <span className="font-mono text-[10px] tracking-widest text-amber-500 uppercase">
                      {post.category}
                    </span>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase transition-colors group-hover:text-white">
                    Read Article ↗
                  </span>
                </div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-white uppercase transition-colors group-hover:text-zinc-200 md:text-4xl">
                  {post.title}
                </h2>
                <p className="max-w-2xl text-lg leading-relaxed font-medium text-zinc-400">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
