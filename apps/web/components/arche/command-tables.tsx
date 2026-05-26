'use client'

import { motion } from 'motion/react'

type CommandRow = { cmd: string; desc: string }

function CommandTableSection({
  title,
  subtitle,
  commands,
}: {
  title: string
  subtitle: string
  commands: CommandRow[]
}) {
  return (
    <div className="w-full overflow-hidden border border-zinc-800 bg-black">
      <div className="border-b border-zinc-800 bg-zinc-900 px-6 py-3">
        <div className="font-mono text-xs tracking-widest text-zinc-400 uppercase">{title}</div>
        <p className="mt-1 text-xs leading-relaxed text-pretty text-zinc-500">{subtitle}</p>
      </div>
      <div className="divide-y divide-zinc-800">
        {commands.map((c, i) => (
          <motion.div
            key={c.cmd}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03, duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-4 px-6 py-4 transition-colors hover:bg-zinc-900/30 sm:flex-row sm:items-center"
          >
            <div className="w-fit border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-sm text-white">
              <span className="mr-2 text-zinc-500">$</span>
              {c.cmd}
            </div>
            <div className="text-sm font-medium text-pretty text-zinc-400">{c.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const archeCliCommands: CommandRow[] = [
  {
    cmd: 'bun run dev:cli -- my-app --yes --preset=typescript-fullstack',
    desc: 'Scaffold from this repo (source CLI today).',
  },
  {
    cmd: 'bun run dev:cli -- my-app --preset=rust-api',
    desc: 'Generate a Rust API workspace foundation.',
  },
  {
    cmd: 'bun run dev:cli -- my-app --preset=solana-web',
    desc: 'Generate a Solana web dApp shape.',
  },
]

const generatedProjectCommands: CommandRow[] = [
  { cmd: 'bun install', desc: 'Install dependencies in the generated workspace.' },
  { cmd: 'bun run ci', desc: 'Run the verification harness advertised by the preset.' },
  { cmd: 'bun run build', desc: 'Production build across workspaces.' },
  { cmd: 'bun run db:migrate', desc: 'When the preset includes a database package.' },
]

const sourceTemplateCommands: CommandRow[] = [
  { cmd: 'bun dev', desc: 'Start all workspaces in this template monorepo.' },
  { cmd: 'bun run build', desc: 'Production build for this template monorepo.' },
  { cmd: 'bun run lint', desc: 'Lint all packages in this template monorepo.' },
  { cmd: 'bun run check-types', desc: 'Typecheck across this template monorepo.' },
  { cmd: 'bun run db:generate', desc: 'Generate Prisma client in packages/store.' },
  { cmd: 'bun run db:migrate', desc: 'Run migrations for the template database.' },
  { cmd: 'bun run repo:doctor', desc: 'Audit this source repo health and stale scaffolding.' },
]

export function ArcheCliCommandTable() {
  return (
    <CommandTableSection
      title="Arche CLI"
      subtitle="Run from the Arche source checkout until the published CLI is explicitly trusted."
      commands={archeCliCommands}
    />
  )
}

export function GeneratedProjectCommandTable() {
  return (
    <CommandTableSection
      title="Generated project"
      subtitle="Typical commands inside a scaffolded workspace after you cd into it."
      commands={generatedProjectCommands}
    />
  )
}

export function SourceTemplateCommandTable() {
  return (
    <CommandTableSection
      title="This source template"
      subtitle="Commands for developing the Arche template monorepo itself—not every generated app."
      commands={sourceTemplateCommands}
    />
  )
}

/** @deprecated Use the named tables above for clearer context labels. */
export function CommandTable() {
  return <SourceTemplateCommandTable />
}
