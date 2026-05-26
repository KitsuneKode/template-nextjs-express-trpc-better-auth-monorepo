import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Navbar } from '@/components/arche/navbar'
import { SiteFrame, SiteShell } from '@/components/arche/site-primitives'
import { ArticleShell } from '@/components/blog/article-shell'
import { BlogPostJsonLd } from '@/components/blog/blog-post-json-ld'
import {
  buildBlogPostMetadata,
  formatBlogDate,
  getBlogCategory,
  getBlogFrontmatter,
} from '@/lib/blog'
import { readingTimeForBlogSlug } from '@/lib/blog-reading-time'
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
    .filter((page) => {
      const slug = page.slugs[0]
      return Boolean(slug) && !getBlogFrontmatter(page).draft
    })
    .map((page) => ({
      slug: page.slugs[0] as string,
    }))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const page = blogSource.getPage([slug])
  if (!page || getBlogFrontmatter(page).draft) notFound()

  const data = getBlogFrontmatter(page)
  const MDX = page.data.body
  const category = getBlogCategory(page)
  const readingTime = await readingTimeForBlogSlug(slug)

  const meta = (
    <>
      {data.date ? (
        <time
          dateTime={data.date}
          className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase tabular-nums"
        >
          {formatBlogDate(data.date)}
        </time>
      ) : null}
      <span className="size-1 rounded-full bg-zinc-700" aria-hidden />
      <span className="font-mono text-[10px] tracking-[0.2em] text-amber-500/90 uppercase">
        {category}
      </span>
      <span className="size-1 rounded-full bg-zinc-700" aria-hidden />
      <span className="font-mono text-[10px] tracking-[0.18em] text-zinc-600 uppercase tabular-nums">
        {readingTime}
      </span>
      {data.tags?.map((tag) => (
        <span
          key={tag}
          className="border border-zinc-800 px-2 py-0.5 font-mono text-[10px] tracking-widest text-zinc-500 uppercase"
        >
          {tag}
        </span>
      ))}
    </>
  )

  const footer = (
    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
      <div>
        <p className="text-sm font-semibold text-white">KitsuneKode</p>
        <p className="font-mono text-[10px] tracking-[0.18em] text-zinc-500 uppercase">
          Maintains Arche
        </p>
      </div>
      <Link
        href="/blog"
        className="inline-flex min-h-10 items-center border border-zinc-700 px-5 py-2 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:border-white"
      >
        All posts
      </Link>
    </div>
  )

  return (
    <SiteShell className="overflow-x-hidden">
      <BlogPostJsonLd page={page} />
      <Navbar />
      <SiteFrame>
        <ArticleShell meta={meta} title={data.title} description={data.description} footer={footer}>
          <MDX components={getMdxComponents()} />
        </ArticleShell>
      </SiteFrame>
    </SiteShell>
  )
}
