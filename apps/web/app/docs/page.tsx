import { Metadata } from 'next'

import {
  ArcheCliCommandTable,
  GeneratedProjectCommandTable,
} from '@/components/arche/command-tables'
import {
  CodePanel,
  HeroBlock,
  SectionHeading,
  StatusPill,
} from '@/components/arche/site-primitives'
import { StackDiagram } from '@/components/arche/stack-diagram'

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Quick start guide, architecture map, and local commands for Arche.',
}

const quickStart = [
  {
    step: '1. Generate',
    cmd: 'bun run dev:cli -- my-app --yes --preset=typescript-fullstack',
  },
  { step: '2. Enter', cmd: 'cd my-app' },
  { step: '3. Verify', cmd: 'bun install && bun run ci' },
]

export default function DocsPage() {
  return (
    <div className="flex h-full flex-col">
      <HeroBlock
        eyebrow={<StatusPill tone="watch">Source workflow</StatusPill>}
        title="Start with"
        outline="evidence."
        className="md:p-12"
      >
        Use the local CLI while the package release track is guarded. The published command can land
        later; the source command below is the truth today.
      </HeroBlock>

      <div className="flex flex-1 flex-col lg:flex-row">
        <section className="flex flex-1 flex-col gap-16 border-b border-zinc-800 p-6 md:p-12 lg:border-r lg:border-b-0">
          <div>
            <SectionHeading eyebrow="Quick start" title="Generate, enter, verify." />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              {quickStart.map((item) => (
                <div
                  key={item.step}
                  className="flex flex-col border border-zinc-800 bg-zinc-900/30 p-6"
                >
                  <div className="mb-4 font-mono text-xs tracking-widest text-zinc-500 uppercase">
                    {item.step}
                  </div>
                  <CodePanel title="Command">
                    <code>{item.cmd}</code>
                  </CodePanel>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Architecture" title="Thin entrypoints, clear layers.">
              Services stay framework-agnostic. DTOs own validation, repositories own persistence,
              policies own permission decisions, and mappers shape responses.
            </SectionHeading>
            <StackDiagram />
          </div>
        </section>

        <aside className="flex w-full flex-col gap-8 bg-zinc-950/30 p-6 md:p-12 lg:w-[22rem]">
          <div>
            <h2 className="mb-4 text-lg font-bold tracking-tight uppercase">Arche CLI</h2>
            <ArcheCliCommandTable />
          </div>
          <div>
            <h2 className="mb-4 text-lg font-bold tracking-tight uppercase">After scaffold</h2>
            <GeneratedProjectCommandTable />
          </div>
        </aside>
      </div>
    </div>
  )
}
