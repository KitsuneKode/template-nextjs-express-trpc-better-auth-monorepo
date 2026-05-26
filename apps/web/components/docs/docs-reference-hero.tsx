import type { ReactNode } from 'react'

import { GridBackdrop } from '@/components/arche/site-primitives'

export function DocsReferenceHero({
  eyebrow,
  title,
  accent,
  children,
}: {
  eyebrow: ReactNode
  title: string
  accent?: string
  children: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 md:p-12">
      <GridBackdrop />
      <div className="relative z-10 max-w-3xl">
        <div className="mb-5">{eyebrow}</div>
        <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.08] font-bold tracking-tight text-white">
          {title}
          {accent ? (
            <>
              {' '}
              <span className="text-stroke-white text-transparent">{accent}</span>
            </>
          ) : null}
        </h1>
        <p className="mt-4 text-base leading-relaxed font-medium text-pretty text-zinc-400 md:text-lg">
          {children}
        </p>
      </div>
    </section>
  )
}
