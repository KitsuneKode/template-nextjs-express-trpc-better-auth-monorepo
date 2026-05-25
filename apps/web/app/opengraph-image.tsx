import { ImageResponse } from 'next/og'

import { getArcheMarkDataUri } from '@/lib/brand/mark-data-uri'

export const alt = 'Arche — project origin system for TypeScript, Rust, and Solana scaffolds'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

function OgMark({ markSize }: { markSize: number }) {
  return (
    <img
      src={getArcheMarkDataUri()}
      alt=""
      width={markSize}
      height={markSize}
      style={{ display: 'block' }}
    />
  )
}

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#050505',
        color: '#fafafa',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -40,
          width: 360,
          height: 360,
          background: 'rgba(245, 158, 11, 0.12)',
          filter: 'blur(80px)',
        }}
      />
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: '64px 72px',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 48,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 22,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#a1a1aa',
              fontWeight: 700,
            }}
          >
            <OgMark markSize={66} />
            Arche
          </div>
          <div
            style={{
              fontSize: 88,
              lineHeight: 0.92,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              maxWidth: 720,
            }}
          >
            Project origin system.
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.3,
              color: '#a1a1aa',
              maxWidth: 680,
              fontWeight: 500,
            }}
          >
            TypeScript, Rust, Solana, deployment paths, and agent-readable scaffolds.
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                border: '1px solid rgba(245, 158, 11, 0.45)',
                background: 'rgba(245, 158, 11, 0.1)',
                color: '#fcd34d',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              <div style={{ width: 8, height: 8, background: '#f59e0b' }} />
              Release guarded
            </div>
            <div
              style={{
                padding: '10px 16px',
                border: '1px solid #27272a',
                background: '#09090b',
                color: '#a1a1aa',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Bun first
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#6ee7b7',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              <div style={{ width: 8, height: 8, background: '#10b981' }} />
              Foundation
            </div>
          </div>
        </div>
        <OgMark markSize={162} />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          right: 40,
          fontSize: 13,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#52525b',
          fontWeight: 700,
        }}
      >
        kitsunekode · arche
      </div>
    </div>,
    size,
  )
}
