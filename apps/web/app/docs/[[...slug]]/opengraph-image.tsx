import { ImageResponse } from 'next/og'

import { OgShell, ogImageContentType, ogImageSize } from '@/lib/og/shell'
import { source } from '@/lib/source'

export const alt = 'Arche documentation'
export const size = ogImageSize
export const contentType = ogImageContentType

type Props = {
  params: Promise<{ slug?: string[] }>
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: page.slugs,
  }))
}

export default async function Image({ params }: Props) {
  const { slug = [] } = await params
  const page = source.getPage(slug)
  const title = page?.data.title ?? 'Arche docs'
  const description = page?.data.description

  return new ImageResponse(
    <OgShell
      eyebrow="Arche docs"
      title={title}
      subtitle={description}
      footer="kitsunekode · arche"
    />,
    size,
  )
}
