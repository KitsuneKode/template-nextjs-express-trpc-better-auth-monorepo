import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { DocsPageBody, DocsPageHeader } from '@/components/docs/docs-page-header'
import { DocsPageJsonLd } from '@/components/seo/docs-page-json-ld'
import { DocsProse, getMdxComponents } from '@/lib/mdx-components'
import { readingTimeFromText } from '@/lib/reading-time'
import { buildDocsPageMetadata } from '@/lib/seo'
import { source } from '@/lib/source'

type Props = {
  params: Promise<{ slug?: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params
  const page = source.getPage(slug)
  if (!page) return { title: 'Not found' }
  return buildDocsPageMetadata(page)
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
      <DocsPageJsonLd
        title={page.data.title}
        description={page.data.description}
        path={page.url}
        slug={slug}
      />
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
