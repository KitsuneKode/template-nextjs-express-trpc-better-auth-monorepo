import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

process.env.CI = 'true'
process.env.NEXT_PUBLIC_SITE_URL = 'https://arche.kitsunelabs.xyz'
process.env.NEXT_PUBLIC_APP_URL = 'https://arche.kitsunelabs.xyz'
process.env.NEXT_PUBLIC_API_URL = 'https://api.arche.kitsunelabs.xyz'

function normalizeSvg(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function ogImageUrl(
  metadata: Awaited<ReturnType<(typeof import('@/lib/seo'))['buildPageMetadata']>>,
) {
  const ogImage = metadata.openGraph?.images?.[0]
  return ogImage && typeof ogImage === 'object' && 'url' in ogImage ? ogImage.url : ogImage
}

describe('site SEO metadata and brand icons', () => {
  it('buildBlogPostMetadata uses absolute canonical and OG image URLs', async () => {
    const { buildBlogPostMetadata } = await import('@/lib/blog')
    const { blogSource } = await import('@/lib/blog-source')

    const page = blogSource.getPage(['changelog-0-2-1'])
    expect(page).toBeDefined()
    if (!page) return

    const metadata = buildBlogPostMetadata(page)

    expect(metadata.alternates?.canonical).toBe(
      'https://arche.kitsunelabs.xyz/blog/changelog-0-2-1',
    )
    expect(ogImageUrl(metadata)).toBe(
      'https://arche.kitsunelabs.xyz/blog/changelog-0-2-1/opengraph-image',
    )
    expect(metadata.openGraph?.url).toBe('https://arche.kitsunelabs.xyz/blog/changelog-0-2-1')
    expect(metadata.twitter?.images?.[0]).toBe(
      'https://arche.kitsunelabs.xyz/blog/changelog-0-2-1/opengraph-image',
    )
  })

  it('buildDocsPageMetadata includes OG and Twitter images for docs pages', async () => {
    const { buildDocsPageMetadata } = await import('@/lib/seo')
    const { source } = await import('@/lib/source')

    const page = source.getPage(['getting-started'])
    expect(page).toBeDefined()
    if (!page) return

    const metadata = buildDocsPageMetadata(page)

    expect(metadata.alternates?.canonical).toBe(
      'https://arche.kitsunelabs.xyz/docs/getting-started',
    )
    expect(ogImageUrl(metadata)).toBe(
      'https://arche.kitsunelabs.xyz/docs/getting-started/opengraph-image',
    )
    expect(metadata.openGraph?.siteName).toBe('Arche')
    expect(metadata.twitter?.images?.[0]).toBe(
      'https://arche.kitsunelabs.xyz/docs/getting-started/opengraph-image',
    )
  })

  it('buildRootLayoutMetadata includes default OG image on site root', async () => {
    const { buildRootLayoutMetadata } = await import('@/lib/seo')
    const metadata = buildRootLayoutMetadata()

    expect(metadata.openGraph?.url).toBe('https://arche.kitsunelabs.xyz/')
    expect(ogImageUrl(metadata)).toBe('https://arche.kitsunelabs.xyz/opengraph-image')
    expect(metadata.twitter?.images?.[0]).toBe('https://arche.kitsunelabs.xyz/opengraph-image')
  })

  it('sitemap includes blog posts, docs, and category index routes', async () => {
    const { default: sitemap } = await import('./sitemap')
    const urls = sitemap().map((entry) => entry.url)

    expect(urls).toContain('https://arche.kitsunelabs.xyz/blog/changelog-0-2-1')
    expect(urls).toContain('https://arche.kitsunelabs.xyz/docs/getting-started')
    expect(urls).toContain('https://arche.kitsunelabs.xyz/blog/category/changelog')
    expect(urls).toContain('https://arche.kitsunelabs.xyz/blog/category/guide')
    expect(urls).toContain('https://arche.kitsunelabs.xyz/blog/category/technical')
  })

  it('generateStaticParams includes changelog-0-2-1', async () => {
    const { generateStaticParams } = await import('./blog/[slug]/page')
    const params = generateStaticParams()
    expect(params).toContainEqual({ slug: 'changelog-0-2-1' })
  })

  it('app/icon.svg matches public/brand/arche-mark.svg', () => {
    const appDir = join(import.meta.dir, '..')
    const iconSvg = readFileSync(join(appDir, 'app/icon.svg'), 'utf8')
    const brandMark = readFileSync(join(appDir, 'public/brand/arche-mark.svg'), 'utf8')
    expect(normalizeSvg(iconSvg)).toBe(normalizeSvg(brandMark))
  })

  it('buildDocsBreadcrumbs includes section and page trail', async () => {
    const { buildDocsBreadcrumbs } = await import('@/lib/docs-breadcrumbs')

    const crumbs = buildDocsBreadcrumbs(['guides', 'first-hour'], 'First hour')
    expect(crumbs.map((item) => item.name)).toEqual([
      'Home',
      'Documentation',
      'Guides',
      'First hour',
    ])
    expect(crumbs.at(-1)?.path).toBe('/docs/guides/first-hour')
  })

  it('buildDocsBreadcrumbs labels walkthrough pages under Walkthroughs', async () => {
    const { buildDocsBreadcrumbs } = await import('@/lib/docs-breadcrumbs')

    const crumbs = buildDocsBreadcrumbs(['guides', 'walkthrough-rust'], 'Rust walkthrough')
    expect(crumbs.map((item) => item.name)).toEqual([
      'Home',
      'Documentation',
      'Walkthroughs',
      'Rust walkthrough',
    ])
  })
})
