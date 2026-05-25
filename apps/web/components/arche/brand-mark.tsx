import { cn } from '@arche-template/ui/lib/utils'

type BrandMarkProps = {
  size?: number
  className?: string
  showFrame?: boolean
}

/** Arche origin-frame mark — scaffold A with emerald origin, amber/blue corner signals. */
export function BrandMark({ size = 32, className, showFrame = true }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      className={cn('shrink-0', className)}
    >
      {showFrame ? (
        <rect x="2" y="2" width="60" height="60" fill="#09090b" stroke="#27272a" strokeWidth="2" />
      ) : null}
      <path
        d="M18 46 L32 14 L46 46"
        fill="none"
        stroke="#fafafa"
        strokeWidth="3.2"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      <path d="M23 36 H41" fill="none" stroke="#a1a1aa" strokeWidth="2.4" strokeLinecap="square" />
      <circle cx="32" cy="46" r="3.2" fill="#10b981" />
      {showFrame ? (
        <>
          <path
            d="M2 2 H14 M2 2 V14"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.2"
            strokeLinecap="square"
          />
          <path
            d="M52 50 H62 M54 50 V60"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1.8"
            strokeLinecap="square"
            opacity="0.85"
          />
        </>
      ) : null}
    </svg>
  )
}
