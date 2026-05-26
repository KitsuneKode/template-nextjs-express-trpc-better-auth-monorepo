import { ImageResponse } from 'next/og'

import { OgShell, ogImageContentType, ogImageSize } from '@/lib/og/shell'

export const alt = 'Arche architecture families and preset comparison'
export const size = ogImageSize
export const contentType = ogImageContentType

export default function Image() {
  return new ImageResponse(
    <OgShell
      eyebrow="Arche presets"
      title="Choose a route, not a vibe."
      subtitle="Compare TypeScript, Convex, Rust, and Solana presets with verification evidence before scaffolding."
      footer="kitsunekode · arche"
    />,
    size,
  )
}
