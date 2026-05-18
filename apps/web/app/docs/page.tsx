import { Metadata } from 'next'
import { CommandTable } from '@/components/arche/command-table'
import { StackDiagram } from '@/components/arche/stack-diagram'

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Quick start guide and architecture overview for the Arche monorepo.',
}

export default function DocsPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header Area */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10 flex max-w-3xl flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-[4px_4px_0_0_rgba(39,39,42,1)]">
            Quick Start
          </div>

          <h1 className="mb-6 text-5xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-6xl">
            Zero to <br />
            <span className="text-stroke-white text-transparent">Production.</span>
          </h1>

          <p className="text-lg leading-snug font-medium text-zinc-400">
            Understand the core mechanics, spin up your environment, and execute the essential
            commands.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Main Content */}
        <section className="flex flex-1 flex-col gap-16 border-b border-zinc-800 p-6 md:p-12 lg:border-r lg:border-b-0">
          {/* 3-Step Flow */}
          <div>
            <h2 className="mb-6 text-2xl font-bold tracking-tight uppercase">Installation</h2>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              {[
                { step: '1. Install', cmd: 'npx arche create my-app' },
                { step: '2. Start', cmd: 'cd my-app && bun dev' },
                { step: '3. Build', cmd: 'Open localhost:3000' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col border border-zinc-800 bg-zinc-900/30 p-6">
                  <div className="mb-4 font-mono text-xs tracking-widest text-zinc-500 uppercase">
                    {s.step}
                  </div>
                  <div className="mt-auto border border-zinc-800 bg-black p-3 font-mono text-sm text-white">
                    {s.cmd}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stack Diagram */}
          <div>
            <h2 className="mb-6 text-2xl font-bold tracking-tight uppercase">Architecture</h2>
            <p className="mb-8 font-medium text-zinc-400">
              Arche enforces strict boundaries. Next.js handles the UI, Express handles the API, and
              tRPC ensures the types flow between them.
            </p>
            <StackDiagram />
          </div>
        </section>

        {/* Right Sidebar (Commands) */}
        <aside className="w-full bg-zinc-950/30 p-6 md:p-12 lg:w-80">
          <h2 className="mb-6 text-lg font-bold tracking-tight uppercase">CLI Reference</h2>
          <CommandTable />
        </aside>
      </div>
    </div>
  )
}
