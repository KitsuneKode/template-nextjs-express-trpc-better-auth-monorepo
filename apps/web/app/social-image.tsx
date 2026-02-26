import { ImageResponse } from 'next/og'

interface SocialImageOptions {
  eyebrow: string
  title: string
  subtitle: string
}

const STACK = [
  'Next.js 16',
  'Express',
  'tRPC',
  'Better Auth',
  'Prisma',
  'Turborepo',
]

export function createSocialImage({
  eyebrow,
  title,
  subtitle,
}: SocialImageOptions) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#080c11',
        backgroundImage:
          'radial-gradient(circle at 15% 12%, rgba(215,174,127,0.22), transparent 36%), radial-gradient(circle at 86% 86%, rgba(103,200,186,0.22), transparent 34%), linear-gradient(135deg, #0f151d 0%, #080c11 72%)',
        color: '#f5ebde',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div
        style={{
          display: 'flex',
          width: '100%',
          padding: '56px 64px',
          gap: 48,
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'rgba(255,255,255,0.04)',
              color: '#e7d5bf',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '10px 18px',
              width: 'fit-content',
            }}
          >
            {eyebrow}
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 66,
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              maxWidth: 740,
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: 31,
              lineHeight: 1.32,
              fontWeight: 500,
              color: '#c6b39a',
              maxWidth: 790,
            }}
          >
            {subtitle}
          </div>

          <div
            style={{
              marginTop: 34,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              maxWidth: 760,
            }}
          >
            {STACK.map((item) => (
              <div
                key={item}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: 999,
                  padding: '8px 14px',
                  fontSize: 22,
                  fontWeight: 600,
                  color: '#dbc8af',
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(255,255,255,0.035)',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            width: 244,
          }}
        >
          <div
            style={{
              width: 188,
              height: 188,
              borderRadius: 44,
              border: '1px solid rgba(255,255,255,0.16)',
              background:
                'radial-gradient(circle at 25% 20%, rgba(215,174,127,0.32), transparent 44%), radial-gradient(circle at 80% 86%, rgba(103,200,186,0.3), transparent 44%), linear-gradient(140deg, #101722 0%, #080c11 80%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f4e7d8',
              fontSize: 86,
              fontWeight: 700,
              boxShadow: '0 18px 48px rgba(0,0,0,0.35)',
            }}
          >
            &lt;/&gt;
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              color: '#a89174',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: 17,
            }}
          >
            template.kitsunekode.com
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
