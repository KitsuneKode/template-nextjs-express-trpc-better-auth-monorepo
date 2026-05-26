import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { DocsPageBody, DocsPageHeader } from '@/components/docs/docs-page-header'
import { DocsProse, getMdxComponents } from '@/lib/mdx-components'
import { readingTimeFromText } from '@/lib/reading-time'
import { source } from '@/lib/source'

type Props = {
  params: Promise<{ slug?: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params
  const page = source.getPage(slug)
  if (!page) return { title: 'Not found' }
  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: page.slugs,
  }))
}

export default async function DocsMdxPage({ params }: Props) {
  const { slug = [] } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  const MDX = page.data.body
  const readingTime = readingTimeFromText(page.data.title, page.data.description)

  return (
    <div className="flex h-full flex-col">
      <DocsPageHeader
        title={page.data.title}
        description={page.data.description}
        readingTime={readingTime}
      />
      <DocsPageBody>
        <DocsProse>
          <MDX components={getMdxComponents()} />
        </DocsProse>
      </DocsPageBody>
    </div>
  )
}
