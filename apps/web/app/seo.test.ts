import { describe, expect, it } from 'bun:test'

process.env.CI = 'true'
process.env.NEXT_PUBLIC_SITE_URL = 'https://arche.kitsunelabs.xyz'
process.env.NEXT_PUBLIC_APP_URL = 'https://arche.kitsunelabs.xyz'
process.env.NEXT_PUBLIC_API_URL = 'https://api.arche.kitsunelabs.xyz'

function ogImageUrl(
  metadata: Awaited<ReturnType<(typeof import('@/lib/seo'))['buildPageMetadata']>>,
) {
  const ogImage = metadata.openGraph?.images?.[0]
  return ogImage && typeof ogImage === 'object' && 'url' in ogImage ? ogImage.url : ogImage
}

describe('site SEO metadata', () => {
  it('emits absolute canonical and OG image URLs for blog and docs', async () => {
    const { buildBlogPostMetadata } = await import('@/lib/blog')
    const { blogSource } = await import('@/lib/blog-source')
    const { buildDocsPageMetadata, absoluteSiteUrl } = await import('@/lib/seo')
    const { source } = await import('@/lib/source')

    const blogPage = blogSource.getPage(['changelog-0-2-1'])
    const docsPage = source.getPage(['getting-started'])
    expect(blogPage).toBeDefined()
    expect(docsPage).toBeDefined()
    if (!blogPage || !docsPage) return

    const blog = buildBlogPostMetadata(blogPage)
    const docs = buildDocsPageMetadata(docsPage)

    expect(blog.alternates?.canonical).toBe(absoluteSiteUrl('/blog/changelog-0-2-1'))
    expect(ogImageUrl(blog)).toBe(absoluteSiteUrl('/blog/changelog-0-2-1/opengraph-image'))

    expect(docs.alternates?.canonical).toBe(absoluteSiteUrl('/docs/getting-started'))
    expect(ogImageUrl(docs)).toBe(absoluteSiteUrl('/docs/og/getting-started'))
  })

  it('maps docs breadcrumbs for guides and walkthroughs', async () => {
    const { buildDocsBreadcrumbs } = await import('@/lib/docs-breadcrumbs')

    expect(
      buildDocsBreadcrumbs(['guides', 'first-hour'], 'First hour').map((item) => item.name),
    ).toEqual(['Home', 'Documentation', 'Guides', 'First hour'])

    expect(
      buildDocsBreadcrumbs(['guides', 'walkthrough-rust'], 'Rust walkthrough').map(
        (item) => item.name,
      ),
    ).toEqual(['Home', 'Documentation', 'Walkthroughs', 'Rust walkthrough'])
  })
})
