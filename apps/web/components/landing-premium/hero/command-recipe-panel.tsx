'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Check, Copy } from '@template/ui/components/icons'

const commands = [
  'bun create-turbo@latest --example https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo my-app',
  'cd my-app && bun install',
  'bun run rename-scope',
  'bunx --bun shadcn@latest add button card dialog dropdown-menu -c apps/web',
  'bun dev',
] as const

const tags = [
  'Next.js 16',
  'tRPC',
  'Prisma',
  'Better Auth',
  'Upstash Redis',
  'Turborepo',
] as const

export function CommandRecipePanel() {
  const [copiedLine, setCopiedLine] = useState<string | null>(null)

  const copyLine = async (line: string) => {
    await navigator.clipboard.writeText(line)
    toast.success('Command copied to clipboard')
    setCopiedLine(line)
    setTimeout(
      () => setCopiedLine((prev) => (prev === line ? null : prev)),
      1600,
    )
  }

  return (
    <aside className="relative overflow-hidden rounded-3xl border border-white/12 bg-[#10161e]/85 p-5 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.8)] md:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#d7ae7f]/12 to-transparent" />
      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#d1ab80] uppercase">
            Launch Panel
          </p>
          <span className="rounded-full border border-[#67c8ba]/30 bg-[#67c8ba]/10 px-3 py-1 text-[11px] font-medium text-[#7dd8cb]">
            Ready to run
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#090d12] p-3.5 md:p-4">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-[#8591a1] uppercase">
            Terminal recipe
          </p>
          <div className="space-y-2">
            {commands.map((line) => (
              <div
                key={line}
                className="relative w-full rounded-lg border border-white/5 bg-white/[0.02] py-2 pr-10 pl-3"
              >
                <code className="block font-mono text-xs break-all whitespace-pre-wrap text-[#d7c8b5] md:text-[13px]">
                  <span className="mr-2 text-[#6dd2c4]">$</span>
                  {line}
                </code>
                <button
                  type="button"
                  onClick={() => copyLine(line)}
                  aria-label="Copy command"
                  className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-[#0b1016] text-[#9faab8] transition-colors hover:text-[#f2e7d9]"
                >
                  {copiedLine === line ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-[#0c1118] p-4">
          <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-[#8e9cb0] uppercase">
            Stack highlights
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-[#dfd0bc]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
