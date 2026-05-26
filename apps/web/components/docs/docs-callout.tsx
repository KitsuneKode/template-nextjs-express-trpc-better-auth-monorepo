import type { ReactNode } from 'react'

import { cn } from '@arche-template/ui/lib/utils'

type Tone = 'info' | 'tip' | 'warning'

const toneStyles: Record<Tone, string> = {
  info: 'border-zinc-600 bg-zinc-950 text-zinc-300',
  tip: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-100',
  warning: 'border-amber-500/40 bg-amber-500/5 text-amber-100',
}

export function DocsCallout({
  title,
  tone = 'info',
  children,
}: {
  title?: string
  tone?: Tone
  children: ReactNode
}) {
  return (
    <aside className={cn('not-prose my-8 border-l-[3px] px-5 py-4', toneStyles[tone])}>
      {title ? (
        <p className="mb-2 font-mono text-[10px] font-bold tracking-[0.18em] text-white uppercase">
          {title}
        </p>
      ) : null}
      <div className="text-sm leading-relaxed text-pretty">{children}</div>
    </aside>
  )
}
