import { ImageResponse } from 'next/og'

export const alt = 'Arche project origin system'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#050505',
        color: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        fontFamily: 'Oxanium, sans-serif',
        border: '1px solid #27272a',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          color: '#a1a1aa',
          fontSize: 28,
          letterSpacing: 6,
          textTransform: 'uppercase',
        }}
      >
        <div style={{ width: 18, height: 18, background: '#fafafa' }} />
        Arche
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 112, lineHeight: 0.9, fontWeight: 900, letterSpacing: -6 }}>
          Project origin system.
        </div>
        <div style={{ maxWidth: 860, color: '#a1a1aa', fontSize: 34, lineHeight: 1.25 }}>
          TypeScript, Rust, Solana, deployment paths, and agent-readable scaffolds.
        </div>
      </div>
    </div>,
    size,
  )
}
