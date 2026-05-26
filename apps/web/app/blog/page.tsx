import { Metadata } from 'next'
import Link from 'next/link'

import { cn } from '@arche-template/ui/lib/utils'
import { Navbar } from '@/components/arche/navbar'
import { HeroBlock, SiteFrame, SiteShell, StatusPill } from '@/components/arche/site-primitives'
import { blogSource, isBlogCategory, type BlogCategory } from '@/lib/blog-source'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Changelog, guides, and technical notes from the Arche project.',
}

const categories: { id: BlogCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'changelog', label: 'Changelog' },
  { id: 'guide', label: 'Guides' },
  { id: 'technical', label: 'Technical' },
]

type Props = {
  searchParams: Promise<{ category?: string }>
}

function getCategory(page: ReturnType<typeof blogSource.getPages>[number]): BlogCategory {
  const value = (page.data as { category?: string }).category
  return isBlogCategory(value) ? value : 'technical'
}

export default async function BlogPage({ searchParams }: Props) {
  const { category: categoryParam } = await searchParams
  const activeCategory = isBlogCategory(categoryParam) ? categoryParam : 'all'

  const posts = blogSource
    .getPages()
    .filter((page) => !(page.data as { draft?: boolean }).draft)
    .filter((page) => activeCategory === 'all' || getCategory(page) === activeCategory)
    .sort((a, b) => {
      const dateA = (a.data as { date?: string }).date ?? ''
      const dateB = (b.data as { date?: string }).date ?? ''
      return dateB.localeCompare(dateA)
    })

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
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === 'all' ? '/blog' : `/blog?category=${cat.id}`}
                className={cn(
                  'inline-flex min-h-10 items-center border px-4 py-2 font-mono text-[10px] tracking-widest uppercase transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96]',
                  activeCategory === cat.id
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 bg-black text-zinc-400 hover:text-white',
                )}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="flex-1 bg-black">
          <div className="divide-y divide-zinc-800 border-b border-zinc-800">
            {posts.map((post) => {
              const slug = post.slugs[0]
              const date = (post.data as { date?: string }).date
              const category = getCategory(post)
              return (
                <Link
                  key={post.url}
                  href={`/blog/${slug}`}
                  className="group block p-6 transition-colors hover:bg-zinc-950 md:p-12"
                >
                  <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                      {date ? (
                        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase tabular-nums">
                          {date}
                        </span>
                      ) : null}
                      <span className="size-1 rounded-full bg-zinc-800" />
                      <span className="font-mono text-[10px] tracking-widest text-amber-500 uppercase">
                        {category}
                      </span>
                    </div>
                    <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase transition-colors group-hover:text-white">
                      Read article
                    </span>
                  </div>
                  <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance text-white uppercase transition-colors group-hover:text-zinc-200 md:text-4xl">
                    {post.data.title}
                  </h2>
                  <p className="max-w-2xl text-lg leading-relaxed font-medium text-pretty text-zinc-400">
                    {post.data.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      </SiteFrame>
    </SiteShell>
  )
}
