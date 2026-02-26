'use client'

import React from 'react'
import { toast } from 'sonner'
import { motion } from 'motion/react'
import { terminalSteps } from '@/lib/demo-data'
import { CodeBlock } from '@/components/ui/code-block'
import { Check, Copy } from '@template/ui/components/icons'
import { SectionWrapper } from '@/components/ui/section-wrapper'

const SHADCN_COMMAND =
  'bunx --bun shadcn@latest add button card dialog dropdown-menu -c apps/web'

const COMMAND_BUNDLE = `# 1) Scaffold the repo\nbun create-turbo@latest --example https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo my-app\n\n# 2) Install + rename package scope\ncd my-app && bun install\nbun run rename-scope\n\n# 3) Add new shadcn components into packages/ui\n${SHADCN_COMMAND}\n\n# 4) Start everything\nbun dev`

export const QuickStart = () => {
  return (
    <SectionWrapper id="quick-start" className="py-24 sm:py-32">
      <div className="grid min-w-0 items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="min-w-0">
          <p className="mb-4 text-xs font-semibold tracking-widest text-[#D9AB72] uppercase">
            Quick Start
          </p>
          <h2 className="font-serif text-4xl font-medium tracking-tight text-[#FAFAFA] sm:text-5xl">
            Copy, run, ship.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[#A1A1AA]">
            This flow mirrors how teams actually onboard the template: scaffold,
            personalize scope, add UI primitives, then start building features.
          </p>

          <div className="mt-10 space-y-4">
            {terminalSteps.map((step, index) => (
              <motion.div
                key={step.command}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-[#D4D4D8] uppercase">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white transition-colors group-hover:bg-[#D9AB72] group-hover:text-black">
                      {index + 1}
                    </span>
                    {step.description}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(step.command)
                      toast.success('Copied command to clipboard')
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-[#A1A1AA] opacity-0 transition-all group-hover:opacity-100 hover:bg-white/20 hover:text-white"
                    aria-label="Copy command"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="min-w-0 overflow-hidden rounded-lg bg-[#0A0A0A] p-3 ring-1 ring-white/5">
                  <code className="block font-mono text-xs break-all whitespace-pre-wrap text-[#A1A1AA]">
                    <span className="mr-2 text-[#5FD1C4] select-none">$</span>
                    {step.command}
                  </code>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex gap-3 rounded-2xl border border-[#5FD1C4]/20 bg-[#5FD1C4]/[0.05] p-5 text-sm text-[#A1A1AA]">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#5FD1C4]" />
            <div>
              <p className="font-medium text-[#FAFAFA]">
                shadcn workflow included
              </p>
              <p className="mt-1 leading-relaxed">
                Add new components directly into `packages/ui` and consume them
                in both the app and feature demos.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 min-w-0 space-y-6 lg:mt-0">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/50" />
              </div>
              <p className="font-mono text-xs text-[#71717A]">bootstrap.sh</p>
            </div>
            <div className="p-1">
              <CodeBlock code={COMMAND_BUNDLE} language="bash" />
            </div>
          </div>

          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="group relative min-w-0 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold tracking-widest text-[#A1A1AA] uppercase">
                  Add Components
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(SHADCN_COMMAND)
                    toast.success('Copied command to clipboard')
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-[#A1A1AA] opacity-0 transition-all group-hover:opacity-100 hover:bg-white/20 hover:text-white"
                  aria-label="Copy command"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="min-w-0 overflow-hidden rounded-lg bg-[#0A0A0A] p-3 ring-1 ring-white/5">
                <code className="block font-mono text-xs break-all whitespace-pre-wrap text-[#D4D4D8]">
                  <span className="mr-2 text-[#5FD1C4] select-none">$</span>
                  {SHADCN_COMMAND}
                </code>
              </div>
            </div>
            <div className="group relative min-w-0 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold tracking-widest text-[#A1A1AA] uppercase">
                  Generate New UI
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('bun run generate:component')
                    toast.success('Copied command to clipboard')
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-[#A1A1AA] opacity-0 transition-all group-hover:opacity-100 hover:bg-white/20 hover:text-white"
                  aria-label="Copy command"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="min-w-0 overflow-hidden rounded-lg bg-[#0A0A0A] p-3 ring-1 ring-white/5">
                <code className="block font-mono text-xs break-all whitespace-pre-wrap text-[#D4D4D8]">
                  <span className="mr-2 text-[#5FD1C4] select-none">$</span>
                  bun run generate:component
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
