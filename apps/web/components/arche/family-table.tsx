'use client'

import { motion } from 'motion/react'

import { formatSupportStatus, PUBLIC_PRESET_ROWS } from '@/lib/presets-public'

function statusTone(status: (typeof PUBLIC_PRESET_ROWS)[number]['status']) {
  if (status === 'experimental') return 'border-amber-500/40 text-amber-200'
  if (status === 'stable') return 'border-emerald-500/40 text-emerald-200'
  return 'border-zinc-700 text-zinc-300'
}

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
          {PUBLIC_PRESET_ROWS.map((family, index) => (
            <motion.tr
              key={family.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.2, delay: index * 0.02, ease: [0.23, 1, 0.32, 1] }}
              className="border-b border-zinc-800 transition-[background-color] duration-150 ease-out last:border-b-0 hover:bg-zinc-900/30"
            >
              <td className="border-r border-zinc-800 px-6 py-4">
                <div className="font-mono font-bold text-white">{family.id}</div>
                <div className="mt-1 text-xs text-zinc-500">{family.label}</div>
              </td>
              <td className="border-r border-zinc-800 px-6 py-4">
                <span
                  className={`inline-flex border bg-zinc-950 px-2 py-1 font-mono text-[10px] tracking-widest uppercase ${statusTone(family.status)}`}
                >
                  {formatSupportStatus(family.status)}
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
