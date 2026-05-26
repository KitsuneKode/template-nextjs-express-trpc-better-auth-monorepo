import { env } from '@/env'
import { blogPostAbsoluteUrl, getPublishedBlogSummaries } from '@/lib/blog'

function escapeXml(value: string | undefined | null): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export async function GET() {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  const posts = await getPublishedBlogSummaries()

  const items = posts
    .map((post) => {
      const link = blogPostAbsoluteUrl(post.slug)
      const pubDate = post.date
        ? new Date(post.date.includes('T') ? post.date : `${post.date}T00:00:00`).toUTCString()
        : new Date().toUTCString()

      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${escapeXml(link)}</link>
  <guid isPermaLink="true">${escapeXml(link)}</guid>
  <description>${escapeXml(post.description ?? '')}</description>
  <pubDate>${pubDate}</pubDate>
</item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(env.NEXT_PUBLIC_SITE_NAME)} blog</title>
    <link>${escapeXml(base)}/blog</link>
    <description>${escapeXml(env.NEXT_PUBLIC_SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <atom:link href="${escapeXml(base)}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
