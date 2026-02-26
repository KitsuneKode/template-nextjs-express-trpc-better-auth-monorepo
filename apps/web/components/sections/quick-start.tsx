'use client'

import React from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Check } from '@template/ui/components/icons'
import { terminalSteps } from '@/lib/demo-data'
import { CodeBlock } from '@/components/ui/code-block'
import { SectionWrapper } from '@/components/ui/section-wrapper'

const SHADCN_COMMAND = 'bunx shadcn@latest add button card dialog dropdown-menu'

const COMMAND_BUNDLE = `# 1) Scaffold the repo\nbun create-turbo@latest --example https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo my-app\n\n# 2) Install + rename package scope\ncd my-app && bun install\nbun run rename-scope\n\n# 3) Add new shadcn components into packages/ui\n${SHADCN_COMMAND}\n\n# 4) Start everything\nbun dev`

export const QuickStart = () => {
  return (
    <SectionWrapper id="quick-start" className="pb-18">
      <div className="grid items-start gap-10 xl:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="mb-3 text-xs tracking-[0.2em] text-[#ccb392] uppercase">
            Quick Start
          </p>
          <h2 className="font-serif text-3xl leading-tight text-[#f8f0e5] md:text-5xl">
            Copy, run, ship.
          </h2>
          <p className="mt-4 max-w-xl text-base text-[#d2c2ae] md:text-lg">
            This flow mirrors how teams actually onboard the template: scaffold,
            personalize scope, add UI primitives, then start building features.
          </p>

          <div className="mt-8 space-y-4">
            {terminalSteps.map((step, index) => (
              <motion.div
                key={step.command}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="rounded-2xl border border-white/12 bg-[#10161e]/85 p-4"
              >
                <div className="mb-2 flex items-center gap-2 text-xs tracking-[0.13em] text-[#dfceba] uppercase">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#d9ab72] text-[11px] font-semibold text-[#1f1711]">
                    {index + 1}
                  </span>
                  {step.description}
                </div>
                <code className="block overflow-x-auto whitespace-nowrap rounded-lg border border-white/8 bg-[#0b0f14] px-3 py-2 font-mono text-xs text-[#d7cab8]">
                  <span className="mr-2 text-[#5fd1c4]">$</span>
                  {step.command}
                </code>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-[#5fd1c4]/25 bg-[#5fd1c4]/10 p-4 text-sm text-[#d6e9e5]">
            <div className="mb-2 flex items-center gap-2 font-medium text-[#e5f6f3]">
              <Check className="h-4 w-4" /> shadcn workflow included
            </div>
            Add new components directly into `packages/ui` and consume them in
            both the app and feature demos.
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-white/12 bg-[#10161d]/85 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs tracking-[0.17em] text-[#ccb392] uppercase">
                Command Recipe
              </p>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-[11px] text-[#e8dbc9]">
                CLI + shadcn <ArrowRight className="h-3 w-3" /> ready
              </span>
            </div>
            <CodeBlock filename="bootstrap.sh" language="bash" code={COMMAND_BUNDLE} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/12 bg-[#0f151c]/84 p-4">
              <p className="mb-2 text-xs tracking-[0.15em] text-[#ceb89a] uppercase">
                Add Components
              </p>
              <code className="block overflow-x-auto whitespace-nowrap rounded-lg bg-black/25 px-3 py-2 font-mono text-xs text-[#e8dccd]">
                $ {SHADCN_COMMAND}
              </code>
            </div>
            <div className="rounded-2xl border border-white/12 bg-[#0f151c]/84 p-4">
              <p className="mb-2 text-xs tracking-[0.15em] text-[#ceb89a] uppercase">
                Generate New UI
              </p>
              <code className="block overflow-x-auto whitespace-nowrap rounded-lg bg-black/25 px-3 py-2 font-mono text-xs text-[#e8dccd]">
                $ bun run generate:component
              </code>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
