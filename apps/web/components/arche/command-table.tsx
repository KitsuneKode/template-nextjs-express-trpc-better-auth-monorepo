'use client'

import { motion } from 'motion/react'

const commands = [
  { cmd: 'bun dev', desc: 'Start all workspaces' },
  { cmd: 'bun run build', desc: 'Production build' },
  { cmd: 'bun run lint', desc: 'Lint all packages' },
  { cmd: 'bun run check-types', desc: 'Type check across the monorepo' },
  { cmd: 'bun run db:generate', desc: 'Generate Prisma client' },
  { cmd: 'bun run db:migrate', desc: 'Run database migrations' },
  { cmd: 'bun run db:seed', desc: 'Seed database with test data' },
  { cmd: 'bun run repo:doctor', desc: 'Audit project health & stale scaffolding' },
]

export function CommandTable() {
  return (
    <div className="w-full overflow-hidden border border-zinc-800 bg-black">
      <div className="border-b border-zinc-800 bg-zinc-900 px-6 py-3 font-mono text-xs tracking-widest text-zinc-400 uppercase">
        Command Reference
      </div>
      <div className="divide-y divide-zinc-800">
        {commands.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col gap-4 px-6 py-4 transition-colors hover:bg-zinc-900/30 sm:flex-row sm:items-center"
          >
            <div className="w-fit border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-sm text-white">
              <span className="mr-2 text-zinc-500">$</span>
              {c.cmd}
            </div>
            <div className="text-sm font-medium text-zinc-400">{c.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
