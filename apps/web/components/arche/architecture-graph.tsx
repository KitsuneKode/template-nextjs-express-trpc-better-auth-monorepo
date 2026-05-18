'use client'

import { motion } from 'motion/react'

export function ArchitectureGraph() {
  return (
    <section className="overflow-hidden border-b border-zinc-800 bg-black py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div>
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              <span className="block size-2 border border-zinc-500" />
              Architecture
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-white uppercase md:text-5xl">
              How it connects.
            </h2>
          </div>
          <p className="max-w-sm text-sm font-medium text-zinc-400">
            Apps stay isolated. Logic stays in packages. Turborepo orchestrates the build graph.
            Everything is strictly typed.
          </p>
        </div>

        <div className="relative">
          {/* Connecting lines */}
          <div className="absolute top-[120px] left-0 hidden h-px w-full border-b border-dashed border-zinc-800 bg-zinc-800 lg:block" />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Node 1 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="border border-zinc-800 bg-black p-8 shadow-[8px_8px_0_0_rgba(39,39,42,1)] transition-transform"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center bg-white font-mono font-bold text-black">
                  01
                </div>
                <div className="border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono text-xs font-bold tracking-widest text-white uppercase">
                  apps/web
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">Next.js 15 UI</h3>
              <p className="mb-8 text-sm font-medium text-zinc-300">
                The frontend consumes the API via the fully typed tRPC client, getting autocomplete
                for every endpoint.
              </p>

              <div className="overflow-x-auto border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
                <span className="text-pink-500">const</span> {'{'} data: user {'}'} = trpc.user.get.
                <span className="text-blue-400">useQuery</span>()
              </div>
            </motion.div>

            {/* Node 2 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="border border-zinc-800 bg-zinc-950 p-8 shadow-[8px_8px_0_0_rgba(39,39,42,1)] transition-transform"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center bg-white font-mono font-bold text-black">
                  02
                </div>
                <div className="border border-zinc-800 bg-black px-3 py-1 font-mono text-xs font-bold tracking-widest text-white uppercase">
                  apps/server
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">Express API</h3>
              <p className="mb-8 text-sm font-medium text-zinc-300">
                Hosts the Better Auth endpoints and the main tRPC router. Scales independently from
                the UI.
              </p>

              <div className="overflow-x-auto border border-zinc-800 bg-black p-4 font-mono text-xs text-zinc-300">
                t.procedure.<span className="text-blue-400">query</span>(async () =&gt; {'{'} ...{' '}
                {'}'})
              </div>
            </motion.div>

            {/* Node 3 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="border border-zinc-800 bg-black p-8 text-white shadow-[8px_8px_0_0_rgba(255,255,255,0.1)] transition-transform"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center bg-white font-mono font-bold text-black">
                  03
                </div>
                <div className="border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono text-xs font-bold tracking-widest text-white uppercase">
                  packages/store
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">Prisma DB</h3>
              <p className="mb-8 text-sm font-medium text-zinc-400">
                Single source of truth for your database schema. Exported to the server to perform
                queries.
              </p>

              <div className="overflow-x-auto border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
                <span className="text-pink-400">await</span> prisma.user.
                <span className="text-blue-400">findMany</span>()
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
