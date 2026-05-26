'use client'

import { useState } from 'react'

import { cn } from '@arche-template/ui/lib/utils'
import { DocsCodeBlock } from '@/components/docs/docs-code-block'

type PackageManager = 'bun' | 'pnpm' | 'npm'

const LABELS: Record<PackageManager, string> = {
  bun: 'Bun',
  pnpm: 'pnpm',
  npm: 'npm',
}

export function PackageManagerTabs({
  bun,
  pnpm,
  npm,
  defaultPm = 'bun',
}: {
  bun: string
  pnpm: string
  npm?: string
  defaultPm?: PackageManager
}) {
  const tabs: PackageManager[] = npm ? ['bun', 'pnpm', 'npm'] : ['bun', 'pnpm']
  const [active, setActive] = useState<PackageManager>(defaultPm)

  const code = active === 'bun' ? bun : active === 'pnpm' ? pnpm : (npm ?? bun)

  return (
    <div className="not-prose my-8">
      <div className="flex flex-wrap gap-1 border border-zinc-800 bg-zinc-950 p-1">
        {tabs.map((pm) => (
          <button
            key={pm}
            type="button"
            onClick={() => setActive(pm)}
            className={cn(
              'px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors',
              active === pm ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            {LABELS[pm]}
            {pm === 'npm' ? (
              <span className="ml-1.5 text-[9px] tracking-normal text-zinc-500 normal-case">
                experimental
              </span>
            ) : null}
          </button>
        ))}
      </div>
      <DocsCodeBlock title="terminal">{code}</DocsCodeBlock>
    </div>
  )
}
