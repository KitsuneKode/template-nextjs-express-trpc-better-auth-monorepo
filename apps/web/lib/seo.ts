import type { Metadata } from 'next'
import { env } from '@/env'

const SITE_NAME = env.NEXT_PUBLIC_SITE_NAME
const SITE_URL = env.NEXT_PUBLIC_SITE_URL
const SITE_DESCRIPTION = env.NEXT_PUBLIC_SITE_DESCRIPTION

type BuildMetadataParams = {
  title: string
  description?: string
  path: string
  ogImage?: string
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex,
}: BuildMetadataParams): Metadata {
  const url = `${SITE_URL}${path}`
  const resolvedDescription = description || SITE_DESCRIPTION
  const resolvedTitle = `${title} | ${SITE_NAME}`

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: SITE_NAME,
      type: 'website',
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}

export function buildJsonLd<T>(schema: T): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    ...schema,
  })
}
