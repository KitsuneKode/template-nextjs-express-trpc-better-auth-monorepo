'use client'

import { motion } from 'motion/react'

const families = [
  {
    id: 'fullstack',
    ui: 'Next.js',
    api: 'Express/Hono',
    db: 'Postgres/SQLite',
    auth: 'Better Auth',
    trpc: true,
    docker: true,
    ci: true,
  },
  {
    id: 'next',
    ui: 'Next.js',
    api: '—',
    db: '—',
    auth: 'Optional',
    trpc: false,
    docker: false,
    ci: false,
  },
  {
    id: 'backend',
    ui: '—',
    api: 'Express/Hono',
    db: 'Postgres/SQLite',
    auth: '—',
    trpc: false,
    docker: true,
    ci: true,
  },
  {
    id: 'polyglot',
    ui: 'Next.js',
    api: 'Go/Rust/Python',
    db: '—',
    auth: '—',
    trpc: false,
    docker: false,
    ci: false,
  },
  {
    id: 'rust',
    ui: '—',
    api: 'Rust (Axum)',
    db: '—',
    auth: '—',
    trpc: false,
    docker: false,
    ci: false,
  },
  { id: 'solana', ui: '—', api: '—', db: '—', auth: '—', trpc: false, docker: false, ci: false },
  {
    id: 'mobile',
    ui: 'Expo/RN',
    api: '—',
    db: '—',
    auth: '—',
    trpc: false,
    docker: false,
    ci: false,
  },
  {
    id: 'convex',
    ui: 'Next.js',
    api: 'Convex',
    db: 'Convex',
    auth: 'Convex',
    trpc: false,
    docker: false,
    ci: false,
  },
  { id: 'worker', ui: '—', api: '—', db: '—', auth: '—', trpc: false, docker: false, ci: false },
  { id: 'lib', ui: '—', api: '—', db: '—', auth: '—', trpc: false, docker: false, ci: false },
  { id: 'cli', ui: '—', api: '—', db: '—', auth: '—', trpc: false, docker: false, ci: false },
]

export function FamilyTable() {
  return (
    <div className="w-full overflow-x-auto border border-zinc-800 bg-black">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="border-b border-zinc-800 bg-zinc-900/50 font-mono text-xs tracking-widest text-zinc-400 uppercase">
          <tr>
            <th className="border-r border-zinc-800 px-6 py-4 font-medium">Family</th>
            <th className="border-r border-zinc-800 px-6 py-4 font-medium">Frontend</th>
            <th className="border-r border-zinc-800 px-6 py-4 font-medium">Backend</th>
            <th className="border-r border-zinc-800 px-6 py-4 font-medium">Database</th>
            <th className="border-r border-zinc-800 px-6 py-4 font-medium">Auth</th>
            <th className="border-r border-zinc-800 px-6 py-4 text-center font-medium">tRPC</th>
            <th className="border-r border-zinc-800 px-6 py-4 text-center font-medium">Docker</th>
            <th className="px-6 py-4 text-center font-medium">CI/CD</th>
          </tr>
        </thead>
        <motion.tbody
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {families.map((fam, i) => (
            <motion.tr
              key={fam.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="border-b border-zinc-800 transition-colors last:border-b-0 hover:bg-zinc-900/30"
            >
              <td className="border-r border-zinc-800 px-6 py-4 font-mono font-bold text-white">
                {fam.id}
              </td>
              <td className="border-r border-zinc-800 px-6 py-4 text-zinc-200">{fam.ui}</td>
              <td className="border-r border-zinc-800 px-6 py-4 text-zinc-200">{fam.api}</td>
              <td className="border-r border-zinc-800 px-6 py-4 text-zinc-200">{fam.db}</td>
              <td className="border-r border-zinc-800 px-6 py-4 text-zinc-200">{fam.auth}</td>
              <td className="border-r border-zinc-800 px-6 py-4 text-center">
                {fam.trpc ? (
                  <span className="font-bold text-green-500">✓</span>
                ) : (
                  <span className="text-zinc-600">—</span>
                )}
              </td>
              <td className="border-r border-zinc-800 px-6 py-4 text-center">
                {fam.docker ? (
                  <span className="font-bold text-green-500">✓</span>
                ) : (
                  <span className="text-zinc-600">—</span>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                {fam.ci ? (
                  <span className="font-bold text-green-500">✓</span>
                ) : (
                  <span className="text-zinc-600">—</span>
                )}
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  )
}
