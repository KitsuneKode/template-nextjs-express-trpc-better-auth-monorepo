import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@arche-template/ui/lib/utils'

type Tone = 'default' | 'muted' | 'ready' | 'watch'

const toneClasses: Record<Tone, string> = {
  default: 'border-white bg-white text-black shadow-[4px_4px_0_0_rgba(255,255,255,0.12)]',
  muted: 'border-zinc-800 bg-black text-zinc-300 shadow-[4px_4px_0_0_rgba(39,39,42,1)]',
  ready:
    'border-emerald-500/40 bg-emerald-500/10 text-emerald-200 shadow-[4px_4px_0_0_rgba(16,185,129,0.14)]',
  watch:
    'border-amber-500/40 bg-amber-500/10 text-amber-200 shadow-[4px_4px_0_0_rgba(245,158,11,0.14)]',
}

export function SiteShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main
      className={cn(
        'min-h-screen w-full max-w-full overflow-x-hidden bg-black font-sans text-white selection:bg-white selection:text-black',
        className,
      )}
    >
      {children}
    </main>
  )
}

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1200px] flex-col border-r border-l border-zinc-800 bg-black">
      {children}
    </div>
  )
}

export function GridBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"
    />
  )
}

export function StatusPill({
  children,
  tone = 'muted',
  pulse,
}: {
  children: ReactNode
  tone?: Tone
  pulse?: boolean
}) {
  return (
    <div
      className={cn(
        'inline-flex min-h-8 items-center gap-2 border px-3 py-1 font-mono text-[10px] font-bold tracking-[0.18em] uppercase',
        toneClasses[tone],
      )}
    >
      <span
        className={cn('size-1.5 bg-current', pulse ? 'animate-pulse' : 'opacity-60')}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}

export function HeroBlock({
  eyebrow,
  title,
  accent,
  /** @deprecated Use `accent` — kept for gradual migration */
  outline,
  children,
  className,
  size = 'lg',
}: {
  eyebrow: ReactNode
  title: string
  accent?: string
  outline?: string
  children: ReactNode
  className?: string
  size?: 'lg' | 'md'
}) {
  const stroke = accent ?? outline

  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-zinc-800 bg-black p-6 md:p-12',
        size === 'lg' && 'md:p-16',
        className,
      )}
    >
      <GridBackdrop />
      <div className="relative z-10 flex max-w-3xl flex-col items-start">
        <div className="mb-6">{eyebrow}</div>
        <h1
          className={cn(
            'mb-6 font-bold tracking-tight text-balance text-white',
            size === 'lg'
              ? 'text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.05]'
              : 'text-[clamp(1.75rem,4vw,3rem)] leading-[1.1]',
          )}
        >
          {title}
          {stroke ? (
            <>
              {' '}
              <span className="text-stroke-white text-transparent">{stroke}</span>
            </>
          ) : null}
        </h1>
        <div className="max-w-2xl text-base leading-relaxed font-medium text-pretty text-zinc-400 md:text-lg">
          {children}
        </div>
      </div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div>
        <div className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-zinc-500 uppercase">
          <span className="block size-2 border border-zinc-500" />
          {eyebrow}
        </div>
        <h2 className="text-2xl leading-tight font-bold tracking-tight text-balance text-white md:text-3xl">
          {title}
        </h2>
      </div>
      {children ? (
        <div className="max-w-sm text-sm font-medium text-pretty text-zinc-400">{children}</div>
      ) : null}
    </div>
  )
}

export function PrimaryLink({
  href,
  children,
  variant = 'solid',
}: {
  href: string
  children: ReactNode
  variant?: 'solid' | 'outline'
}) {
  return (
    <Link
      href={href}
      transitionTypes={['route-soft']}
      className={cn(
        'inline-flex min-h-10 items-center justify-center border px-5 py-2 text-xs font-bold tracking-[0.12em] uppercase shadow-[4px_4px_0_0_rgba(39,39,42,1)] transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.96]',
        variant === 'solid'
          ? 'border-white bg-white text-black hover:bg-zinc-200'
          : 'border-zinc-800 bg-black text-white hover:bg-zinc-900',
      )}
    >
      {children}
    </Link>
  )
}

export function CodePanel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="overflow-hidden border border-zinc-800 bg-black shadow-[4px_4px_0_0_rgba(39,39,42,1)]">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-zinc-400 uppercase">
        <span>{title}</span>
        <span aria-hidden="true">•••</span>
      </div>
      <div className="overflow-x-auto p-4 font-mono text-sm leading-relaxed break-all whitespace-pre-wrap text-zinc-200 sm:break-normal sm:whitespace-pre">
        {children}
      </div>
    </div>
  )
}
