import { ImageResponse } from 'next/og'

import { BLOG_CATEGORIES } from '@/lib/blog'
import { isBlogCategory } from '@/lib/blog-source'
import { OgShell, ogImageContentType, ogImageSize } from '@/lib/og/shell'

export const alt = 'Arche blog category'
export const size = ogImageSize
export const contentType = ogImageContentType

const CATEGORY_COPY: Record<string, { title: string; subtitle: string }> = {
  changelog: {
    title: 'Changelog',
    subtitle: 'Release notes and what shipped in each Arche CLI version.',
  },
  guide: {
    title: 'Guides',
    subtitle: 'How-to posts for scaffolding, presets, and your first hour with Arche.',
  },
  technical: {
    title: 'Technical',
    subtitle: 'Architecture, tooling, and implementation notes from the Arche monorepo.',
  },
}

type Props = {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return BLOG_CATEGORIES.filter((cat) => cat.id !== 'all').map((cat) => ({
    category: cat.id,
  }))
}

export default async function Image({ params }: Props) {
  const { category } = await params
  const copy = isBlogCategory(category)
    ? CATEGORY_COPY[category]
    : { title: 'Arche blog', subtitle: 'Changelog, guides, and technical notes.' }

  return new ImageResponse(
    <OgShell
      eyebrow="Arche blog"
      title={copy?.title ?? 'Arche blog'}
      subtitle={copy?.subtitle}
      footer="kitsunekode · arche"
    />,
    size,
  )
}
