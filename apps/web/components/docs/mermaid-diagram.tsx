'use client'

import { useEffect, useId, useState } from 'react'

import { cn } from '@arche-template/ui/lib/utils'

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '')
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'strict',
          fontFamily: 'ui-monospace, monospace',
        })
        const { svg: rendered } = await mermaid.render(`mermaid-${id}`, chart.trim())
        if (!cancelled) {
          setSvg(rendered)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram')
          setSvg(null)
        }
      }
    }

    void render()
    return () => {
      cancelled = true
    }
  }, [chart, id])

  if (error) {
    return (
      <figure className="not-prose my-8 border border-amber-900/50 bg-amber-950/20 p-4">
        <p className="mb-2 font-mono text-[10px] tracking-widest text-amber-500 uppercase">
          Diagram could not render
        </p>
        <pre className="overflow-x-auto font-mono text-xs whitespace-pre text-zinc-400">
          {chart}
        </pre>
      </figure>
    )
  }

  if (!svg) {
    return (
      <div
        className={cn(
          'not-prose my-8 flex min-h-[120px] items-center justify-center border border-zinc-800 bg-zinc-950 font-mono text-[10px] tracking-widest text-zinc-600 uppercase',
        )}
        aria-busy
      >
        Loading diagram…
      </div>
    )
  }

  return (
    <figure
      className="not-prose docs-mermaid my-8 overflow-x-auto border border-zinc-800 bg-zinc-950 p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
