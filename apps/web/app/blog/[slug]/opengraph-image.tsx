import { ImageResponse } from 'next/og'

import { getBlogCategory, getBlogFrontmatter } from '@/lib/blog'
import { blogSource } from '@/lib/blog-source'
import { getArcheMarkDataUri } from '@/lib/brand/mark-data-uri'

export const alt = 'Arche blog post'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

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
  const displayTitle = title.slice(0, 120)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#050505',
        color: '#fafafa',
        padding: 64,
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={getArcheMarkDataUri()} alt="" width={48} height={48} />
        <span style={{ fontSize: 20, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Arche blog · {category}
        </span>
      </div>
      <h1
        style={{
          fontSize: displayTitle.length > 60 ? 48 : 64,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          maxWidth: '100%',
        }}
      >
        {displayTitle}
      </h1>
    </div>,
    size,
  )
}
