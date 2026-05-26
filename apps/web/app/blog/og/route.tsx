import { ImageResponse } from 'next/og'

import { getArcheMarkDataUri } from '@/lib/brand/mark-data-uri'

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')?.slice(0, 120) ?? 'Arche blog'

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
          Arche blog
        </span>
      </div>
      <h1
        style={{
          fontSize: title.length > 60 ? 48 : 64,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          maxWidth: '100%',
        }}
      >
        {title}
      </h1>
    </div>,
    { width: 1200, height: 630 },
  )
}
