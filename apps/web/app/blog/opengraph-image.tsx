import { ImageResponse } from 'next/og'

import { OgShell, ogImageContentType, ogImageSize } from '@/lib/og/shell'

export const alt = 'Arche blog — changelog, guides, and technical notes'
export const size = ogImageSize
export const contentType = ogImageContentType

export default function Image() {
  return new ImageResponse(
    <OgShell
      eyebrow="Arche blog"
      title="Changelog, guides, and technical notes."
      subtitle="Release notes, preset walkthroughs, and implementation notes from the Arche monorepo."
      footer="kitsunekode · arche"
    />,
    size,
  )
}
