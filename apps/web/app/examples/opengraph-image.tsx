import { ImageResponse } from 'next/og'

import { OgShell, ogImageContentType, ogImageSize } from '@/lib/og/shell'

export const alt = 'Arche generated code examples'
export const size = ogImageSize
export const contentType = ogImageContentType

export default function Image() {
  return new ImageResponse(
    <OgShell
      eyebrow="Arche examples"
      title="Code the CLI actually writes."
      subtitle="Illustrative snippets for TypeScript, Convex, Rust, Solana, and CLI automation."
      footer="kitsunekode · arche"
    />,
    size,
  )
}
