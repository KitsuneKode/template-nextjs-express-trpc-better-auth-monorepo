'use client'

import React from 'react'
import { terminalSteps } from '@/lib/demo-data'
import { CodeBlock } from '@/components/ui/code-block'
import { SectionWrapper } from '@/components/ui/section-wrapper'

export const QuickStart = () => {
  return (
    <SectionWrapper id="quick-start">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            Start Building in Minutes
          </h2>
          <p className="mb-8 text-lg text-neutral-400">
            Get up and running with a single command. The template comes
            pre-configured with everything you need.
          </p>

          <div className="space-y-6">
            {terminalSteps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-shrink-0 flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[var(--solar-dark)] text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  {index < terminalSteps.length - 1 && (
                    <div className="my-2 w-px flex-1 bg-white/10" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="mb-1 font-medium text-white">
                    {step.description}
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-white/5 bg-neutral-900 p-3 font-mono text-xs text-neutral-300 md:text-sm">
                    <span className="text-[var(--solar-teal)]">$</span>{' '}
                    {step.command}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--solar-orange)] to-[var(--solar-purple)] opacity-20 blur-2xl" />
          <CodeBlock
            filename="terminal"
            language="bash"
            code={`$bun create-turbo@latest --example https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo my-app
Cloning into 'my-app'...
Done.

$ cd my-app && bun install
Installing dependencies...
+ 847 packages installed [12.43s]

$ bun run rename-scope:dry
Preview: Renaming @template → @myapp
Found 23 files to update

$ bun run rename-scope
✓ Renamed @template to @myapp across all packages
✓ Updated 23 files

$ bun dev
> turbo run dev
@myapp/web:dev: ready on http://localhost:3000
@myapp/server:dev: Server listening on :8080
@myapp/worker:dev: Worker started
`}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}
