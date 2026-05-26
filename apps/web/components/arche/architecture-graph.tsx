'use client'

import { motion } from 'motion/react'

import { CodePanel, SectionHeading } from '@/components/arche/site-primitives'

const nodes = [
  {
    id: '01',
    path: 'apps/web',
    title: 'Next.js 16 UI',
    body: 'App Router pages, server components by default, typed tRPC calls, and shadcn-compatible UI primitives.',
    code: 'const user = await trpcCaller.user.me()',
  },
  {
    id: '02',
    path: 'apps/server',
    title: 'Module-first API',
    body: 'Procedures live in modules/*.trpc.ts. Express hosts Better Auth and tRPC while services, DTOs, policies, mappers, and repositories stay separated.',
    code: 'router.use("/api/trpc", trpcHandler)',
  },
  {
    id: '03',
    path: 'packages/trpc',
    title: 'Client contract',
    body: 'packages/trpc re-exports AppRouter and createCaller from the server so the web app shares types without duplicating router logic.',
    code: 'export type { AppRouter } from "@arche-template/server"',
  },
  {
    id: '04',
    path: 'rust/*',
    title: 'Rust workspace track',
    body: 'Rust services and workers are generated as explicit workspace units instead of being hidden inside the TypeScript stack.',
    code: 'cargo test --workspace',
  },
]

export function ArchitectureGraph() {
  return (
    <section className="overflow-hidden border-b border-zinc-800 bg-black py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeading eyebrow="Architecture" title="How it scales.">
          The default is module-first. Entry points stay small, business logic lives in services,
          persistence lives behind repositories, and responses are mapped before they leave a route.
        </SectionHeading>

        <div className="relative">
          <div className="absolute top-[104px] left-0 hidden h-px w-full border-b border-dashed border-zinc-800 lg:block" />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
            {nodes.map((node, index) => (
              <motion.article
                key={node.path}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.22, delay: index * 0.04, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -6 }}
                className="flex flex-col border border-zinc-800 bg-black p-6 shadow-[8px_8px_0_0_rgba(39,39,42,1)] transition-[background-color,box-shadow] duration-200 ease-out hover:bg-zinc-950 hover:shadow-[8px_8px_0_0_rgba(255,255,255,0.08)]"
              >
                <div className="mb-8 flex items-center justify-between gap-3">
                  <div className="flex size-10 items-center justify-center bg-white font-mono font-bold text-black tabular-nums">
                    {node.id}
                  </div>
                  <div className="border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-white uppercase">
                    {node.path}
                  </div>
                </div>
                <h3 className="mb-3 text-2xl leading-none font-bold text-balance text-white">
                  {node.title}
                </h3>
                <p className="mb-8 text-sm leading-relaxed font-medium text-pretty text-zinc-400">
                  {node.body}
                </p>
                <div className="mt-auto">
                  <CodePanel title="Boundary">
                    <code>{node.code}</code>
                  </CodePanel>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
