'use client'

import { motion } from 'motion/react'

const families = [
  {
    id: 'typescript-fullstack',
    status: 'Primary',
    shape: 'Next.js web + Express API + tRPC + Better Auth + Prisma',
    goodFor: 'Default production app foundation',
  },
  {
    id: 'rust-workspace',
    status: 'Foundation',
    shape: 'Cargo workspace with service and worker slots',
    goodFor: 'Engine services, background work, and future polyglot scale',
  },
  {
    id: 'solana',
    status: 'Foundation',
    shape: 'Program/client foldering, IDL route, wallet adapter direction',
    goodFor: 'Web3 apps where frontend, contracts, and mobile hooks must stay explicit',
  },
  {
    id: 'worker',
    status: 'Composable',
    shape: 'Queue-ready service workspace with deployment hooks',
    goodFor: 'Async jobs, scheduled tasks, and isolated runtime concerns',
  },
  {
    id: 'library',
    status: 'Composable',
    shape: 'Publishable package surface with tests and package checks',
    goodFor: 'Shared internal packages or standalone npm modules',
  },
]

export function FamilyTable() {
  return (
    <div className="w-full overflow-x-auto border border-zinc-800 bg-black">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="border-b border-zinc-800 bg-zinc-900/50 font-mono text-xs tracking-widest text-zinc-400 uppercase">
          <tr>
            <th className="border-r border-zinc-800 px-6 py-4 font-medium">Preset</th>
            <th className="border-r border-zinc-800 px-6 py-4 font-medium">Status</th>
            <th className="border-r border-zinc-800 px-6 py-4 font-medium">Shape</th>
            <th className="px-6 py-4 font-medium">Best for</th>
          </tr>
        </thead>
        <motion.tbody
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
        >
          {families.map((family, index) => (
            <motion.tr
              key={family.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.2, delay: index * 0.02, ease: [0.23, 1, 0.32, 1] }}
              className="border-b border-zinc-800 transition-[background-color] duration-150 ease-out last:border-b-0 hover:bg-zinc-900/30"
            >
              <td className="border-r border-zinc-800 px-6 py-4 font-mono font-bold text-white">
                {family.id}
              </td>
              <td className="border-r border-zinc-800 px-6 py-4">
                <span className="inline-flex border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[10px] tracking-widest text-zinc-300 uppercase">
                  {family.status}
                </span>
              </td>
              <td className="border-r border-zinc-800 px-6 py-4 text-zinc-200">{family.shape}</td>
              <td className="px-6 py-4 text-zinc-400">{family.goodFor}</td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  )
}
