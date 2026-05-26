import { ImageResponse } from 'next/og'

import { getBlogCategory, getBlogFrontmatter } from '@/lib/blog'
import { blogSource } from '@/lib/blog-source'
import { OgShell, ogImageContentType, ogImageSize } from '@/lib/og/shell'

export const alt = 'Arche blog post'
export const size = ogImageSize
export const contentType = ogImageContentType

type Props = {
  params: Promise<{ slug: string }>
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

export default async function Image({ params }: Props) {
  const { slug } = await params
  const page = blogSource.getPage([slug])
  const title = page ? getBlogFrontmatter(page).title : 'Arche blog'
  const category = page ? getBlogCategory(page) : 'technical'
  const description = page ? getBlogFrontmatter(page).description : undefined

  return new ImageResponse(
    <OgShell
      eyebrow={`Arche blog · ${category}`}
      title={title}
      subtitle={description}
      footer="kitsunekode · arche"
    />,
    size,
  )
}
