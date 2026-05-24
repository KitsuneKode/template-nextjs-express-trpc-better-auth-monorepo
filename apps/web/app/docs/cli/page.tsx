import { Metadata } from 'next'

import { CommandTable } from '@/components/arche/command-table'
import {
  CodePanel,
  HeroBlock,
  SectionHeading,
  StatusPill,
} from '@/components/arche/site-primitives'

export const metadata: Metadata = {
  title: 'CLI Tooling',
  description: 'Use the Arche CLI for local project scaffolding and generated workspace hygiene.',
}

const capabilities = [
  {
    title: 'Workspace scoping',
    desc: 'Renames package scopes, package names, and workspace metadata from @arche-template/* to the selected project identity.',
  },
  {
    title: 'Preset selection',
    desc: 'Interactive and flag-driven scaffolds for TypeScript fullstack, Rust workspace foundations, workers, Solana foundations, and libraries.',
  },
  {
    title: 'Agent context',
    desc: 'Writes AGENTS.md plus .docs and .plans references so generated projects are navigable by coding agents without context stuffing.',
  },
  {
    title: 'Verification harness',
    desc: 'Generated projects are designed to run install, typecheck, lint, test, build, and package checks before release work starts.',
  },
]

export default function CliDocsPage() {
  return (
    <div className="flex h-full flex-col">
      <HeroBlock
        eyebrow={<StatusPill tone="muted">CLI Tooling</StatusPill>}
        title="Arche"
        outline="CLI."
        className="md:p-12"
      >
        The CLI is the entry point for your scaffolded workspaces. It should be useful in a source
        checkout today and publishable once the release workflow is explicitly trusted.
      </HeroBlock>

      <section className="max-w-4xl space-y-12 p-6 md:p-12">
        <div>
          <SectionHeading eyebrow="Local execution" title="Run from source." />
          <CodePanel title="Current command">
            <code>bun run dev:cli -- my-app --yes --preset=typescript-fullstack</code>
          </CodePanel>
        </div>

        <div>
          <SectionHeading eyebrow="Capabilities" title="What the scaffold owns." />
          <ul className="grid gap-4 md:grid-cols-2">
            {capabilities.map((capability, index) => (
              <li key={capability.title} className="border border-zinc-800 bg-zinc-950/60 p-5">
                <span className="mb-4 block font-mono text-xs text-zinc-600 tabular-nums">
                  0{index + 1}
                </span>
                <div className="mb-2 font-bold text-white">{capability.title}</div>
                <div className="text-sm leading-relaxed text-pretty text-zinc-500">
                  {capability.desc}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHeading eyebrow="Repo hygiene" title="Commands agents should know." />
          <CommandTable />
        </div>
      </section>
    </div>
  )
}
