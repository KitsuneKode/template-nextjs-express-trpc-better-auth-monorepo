import { getArcheMarkDataUri } from '@/lib/brand/mark-data-uri'

export const ogImageSize = {
  width: 1200,
  height: 630,
} as const

export const ogImageContentType = 'image/png'

export function OgMark({ size }: { size: number }) {
  return (
    <img
      src={getArcheMarkDataUri()}
      alt=""
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  )
}

type OgShellProps = {
  eyebrow: string
  title: string
  subtitle?: string
  footer?: string
  markSize?: number
}

export function OgShell({ eyebrow, title, subtitle, footer, markSize = 140 }: OgShellProps) {
  const displayTitle = title.slice(0, 120)
  const titleSize = displayTitle.length > 72 ? 46 : displayTitle.length > 48 ? 56 : 68

  return (
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 20,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#a1a1aa',
              fontWeight: 700,
            }}
          >
            <OgMark size={52} />
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: titleSize,
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              maxWidth: 760,
            }}
          >
            {displayTitle}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.35,
                color: '#a1a1aa',
                maxWidth: 680,
                fontWeight: 500,
              }}
            >
              {subtitle.slice(0, 160)}
            </div>
          ) : null}
        </div>
        <OgMark size={markSize} />
      </div>
      {footer ? (
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
          {footer}
        </div>
      ) : null}
    </div>
  )
}
