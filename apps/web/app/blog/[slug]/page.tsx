import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Navbar } from '@/components/arche/navbar'
import { SiteFrame, SiteShell } from '@/components/arche/site-primitives'
import { blogSource, isBlogCategory } from '@/lib/blog-source'
import { getMdxComponents } from '@/lib/mdx-components'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = blogSource.getPage([slug])
  if (!page) return { title: 'Post not found' }
  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({
    slug: page.slugs[0],
  }))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const page = blogSource.getPage([slug])
  if (!page) notFound()

  const MDX = page.data.body
  const date = (page.data as { date?: string }).date
  const categoryRaw = (page.data as { category?: string }).category
  const category = isBlogCategory(categoryRaw) ? categoryRaw : 'technical'

  return (
    <SiteShell className="overflow-x-hidden">
      <Navbar />
      <SiteFrame>
        <header className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 md:p-20">
          <div className="relative z-10 flex max-w-4xl flex-col items-start">
            <div className="mb-8 flex items-center gap-4">
              {date ? (
                <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase tabular-nums">
                  {date}
                </span>
              ) : null}
              <span className="size-1 rounded-full bg-zinc-800" />
              <span className="font-mono text-xs tracking-widest text-amber-500 uppercase">
                {category}
              </span>
            </div>
            <h1 className="mb-8 max-w-5xl text-4xl leading-[0.9] font-black tracking-tighter text-balance text-white uppercase md:text-6xl">
              {page.data.title}
            </h1>
            {page.data.description ? (
              <p className="max-w-2xl text-lg leading-snug font-medium text-pretty text-zinc-400">
                {page.data.description}
              </p>
            ) : null}
            <div className="mt-10 h-px w-32 bg-white" />
          </div>
        </header>

        <div className="flex-1 bg-black p-6 md:p-20">
          <MDX components={getMdxComponents()} />

          <div className="mt-24 flex flex-col items-start justify-between gap-8 border-t border-zinc-800 pt-12 md:flex-row md:items-center">
            <div>
              <div className="text-sm font-bold tracking-tight text-white uppercase">
                KitsuneKode
              </div>
              <div className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                Arche maintainer
              </div>
            </div>
            <Link
              href="/blog"
              className="inline-flex min-h-10 items-center border border-white px-6 py-3 text-sm font-bold tracking-widest uppercase transition-[background-color,color,transform] duration-150 ease-out hover:bg-white hover:text-black active:scale-[0.96]"
            >
              Back to blog
            </Link>
          </div>
        </div>
      </SiteFrame>
    </SiteShell>
  )
}
