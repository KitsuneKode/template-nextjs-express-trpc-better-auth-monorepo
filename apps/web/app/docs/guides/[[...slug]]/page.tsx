import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getMdxComponents } from '@/lib/mdx-components'
import { source } from '@/lib/source'

type Props = {
  params: Promise<{ slug?: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params
  const page = source.getPage(['guides', ...slug])
  if (!page) return { title: 'Guide not found' }
  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export function generateStaticParams() {
  return source
    .getPages()
    .filter((page) => page.slugs[0] === 'guides')
    .map((page) => ({
      slug: page.slugs.slice(1),
    }))
}

export default async function GuidePage({ params }: Props) {
  const { slug = [] } = await params
  const page = source.getPage(['guides', ...slug])
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-zinc-800 bg-black p-6 md:p-12">
        <Link
          href="/docs"
          className="mb-6 inline-block font-mono text-xs tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
        >
          ← Documentation
        </Link>
        <h1 className="text-4xl leading-[0.95] font-black tracking-tighter text-balance text-white uppercase md:text-5xl">
          {page.data.title}
        </h1>
        {page.data.description ? (
          <p className="mt-4 max-w-2xl text-lg leading-snug font-medium text-pretty text-zinc-400">
            {page.data.description}
          </p>
        ) : null}
      </header>
      <div className="flex-1 p-6 md:p-12">
        <MDX components={getMdxComponents()} />
      </div>
    </div>
  )
}
