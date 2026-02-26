'use client'

import { Check, Copy } from '@template/ui/components/icons'
import { useState } from 'react'
import { toast } from 'sonner'
import { quickStartSteps } from './content'

export function QuickStartTimeline() {
  const [copiedLine, setCopiedLine] = useState<string | null>(null)
  const [bundleCopied, setBundleCopied] = useState(false)
  const bundleCommands = quickStartSteps.map((step) => `$ ${step.command}`).join('\n\n')

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    toast.success('Command copied to clipboard')
    setCopiedLine(key)
    setTimeout(() => setCopiedLine((prev) => (prev === key ? null : prev)), 1600)
  }

  const copyBundle = async () => {
    await navigator.clipboard.writeText(bundleCommands)
    toast.success('Command bundle copied')
    setBundleCopied(true)
    setTimeout(() => setBundleCopied(false), 1600)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="min-w-0 space-y-3">
        {quickStartSteps.map((step, index) => (
          <article
            key={step.command}
            className="rounded-2xl border border-white/10 bg-[#0e1319]/85 p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#d7ae7f] text-xs font-semibold text-[#1a130c]">
                {index + 1}
              </span>
              <h3 className="text-xs font-semibold tracking-[0.14em] text-[#dfccb4] uppercase">
                {step.title}
              </h3>
            </div>
            <div className="relative rounded-lg border border-white/8 bg-[#080c10] pl-3 pr-10 py-2">
              <code className="block whitespace-pre-wrap break-all font-mono text-xs text-[#d2c2ad]">
                <span className="mr-2 text-[#69cdbf]">$</span>
                {step.command}
              </code>
              <button
                type="button"
                onClick={() => copyText(step.command, step.command)}
                aria-label="Copy command"
                className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-[#0b1016] text-[#9faab8] transition-colors hover:text-[#f2e7d9]"
              >
                {copiedLine === step.command ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </article>
        ))}
      </div>

      <aside className="min-w-0 space-y-4">
        <article className="rounded-2xl border border-white/10 bg-[#0e1319]/85 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#d0b089] uppercase">Command bundle</p>
            <button
              type="button"
              onClick={copyBundle}
              aria-label="Copy command bundle"
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-white/10 bg-[#0b1016] px-2 text-xs text-[#9faab8] transition-colors hover:text-[#f2e7d9]"
            >
              {bundleCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {bundleCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="overflow-hidden rounded-xl border border-white/8 bg-[#080c10] p-3 text-xs text-[#9fb3c3]">
            <code className="whitespace-pre-wrap break-all">{bundleCommands}</code>
          </pre>
        </article>

        <article className="rounded-2xl border border-[#67c8ba]/25 bg-[#67c8ba]/10 p-4 text-sm leading-relaxed text-[#d8ebe7]">
          Add shared shadcn components directly into <code className="font-mono">packages/ui</code> so both current and future apps consume the same design primitives.
        </article>
      </aside>
    </div>
  )
}
