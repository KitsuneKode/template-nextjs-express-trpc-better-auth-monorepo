import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Navbar } from '@/components/arche/navbar'
import { SiteFrame, SiteShell } from '@/components/arche/site-primitives'
import { BlogPostJsonLd } from '@/components/blog/blog-post-json-ld'
import {
  buildBlogPostMetadata,
  formatBlogDate,
  getBlogCategory,
  getBlogFrontmatter,
} from '@/lib/blog'
import { blogSource } from '@/lib/blog-source'
import { getMdxComponents } from '@/lib/mdx-components'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const page = blogSource.getPage([slug])
  if (!page) return { title: 'Post not found' }
  return buildBlogPostMetadata(page)
}

export function generateStaticParams() {
  return blogSource
    .getPages()
    .filter((page) => !getBlogFrontmatter(page).draft)
    .map((page) => ({
      slug: page.slugs[0],
    }))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const page = blogSource.getPage([slug])
  if (!page || getBlogFrontmatter(page).draft) notFound()

  const data = getBlogFrontmatter(page)
  const MDX = page.data.body
  const category = getBlogCategory(page)

  return (
    <SiteShell className="overflow-x-hidden">
      <BlogPostJsonLd page={page} />
      <Navbar />
      <SiteFrame>
        <header className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 md:p-20">
          <div className="relative z-10 flex max-w-4xl flex-col items-start">
            <div className="mb-8 flex flex-wrap items-center gap-4">
              {data.date ? (
                <time
                  dateTime={data.date}
                  className="font-mono text-xs tracking-widest text-zinc-500 uppercase tabular-nums"
                >
                  {formatBlogDate(data.date)}
                </time>
              ) : null}
              <span className="size-1 rounded-full bg-zinc-800" aria-hidden />
              <span className="font-mono text-xs tracking-widest text-amber-500 uppercase">
                {category}
              </span>
              {data.tags?.map((tag) => (
                <span
                  key={tag}
                  className="border border-zinc-800 px-2 py-0.5 font-mono text-[10px] tracking-widest text-zinc-500 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mb-8 max-w-5xl text-4xl leading-[0.9] font-black tracking-tighter text-balance text-white uppercase md:text-6xl">
              {data.title}
            </h1>
            {data.description ? (
              <p className="max-w-2xl text-lg leading-snug font-medium text-pretty text-zinc-400">
                {data.description}
              </p>
            ) : null}
            {data.author ? (
              <p className="mt-6 font-mono text-xs tracking-widest text-zinc-500 uppercase">
                {data.author}
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
