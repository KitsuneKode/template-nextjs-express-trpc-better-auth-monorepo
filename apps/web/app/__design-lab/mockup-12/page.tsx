import { Button } from '@arche-template/ui/components/button'

export default function Mockup12() {
  return (
    <main className="min-h-screen bg-[#111111] font-sans text-[#A1A1AA] selection:bg-white selection:text-black">
      {/*
        Aesthetic: Interactive Architecture / Dark Elegance
        Focus: Diagrammatic layouts, elegant cards, emphasis on the flow of data.
      */}

      {/* Subtle Grain */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Clean Header */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2" />
              <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-white">Arche</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Github
            </Button>
            <Button className="rounded-lg bg-white px-6 font-medium text-black shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:bg-zinc-200">
              Docs
            </Button>
          </div>
        </header>

        {/* Centerpiece Hero */}
        <section className="flex flex-col items-center py-24 text-center">
          <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm font-medium text-zinc-300 shadow-sm">
            <span className="flex size-2 rounded-full bg-green-500" />
            Template v3 is ready for production
          </div>

          <h1 className="mb-8 max-w-4xl text-5xl leading-[1.1] font-bold tracking-tight text-white drop-shadow-sm md:text-[5rem]">
            The architecture you <br />
            were going to build anyway.
          </h1>

          <p className="mb-12 max-w-2xl text-xl leading-relaxed font-medium text-zinc-400">
            Next.js for the UI. Express for the heavy lifting. tRPC for the glue. Prisma for the
            data. Don't spend a week setting it up.
          </p>

          <div className="relative flex w-full max-w-xl items-center gap-2 overflow-hidden rounded-2xl border border-zinc-800 bg-[#18181B] p-2 shadow-xl">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="px-6 py-3 font-mono text-zinc-300">bunx --bun arche create</div>
            <div className="ml-auto">
              <Button className="h-10 rounded-xl border border-zinc-700 bg-zinc-800 px-6 text-white hover:bg-zinc-700">
                Copy
              </Button>
            </div>
          </div>
        </section>

        {/* Architecture Visualizer Concept */}
        <section className="py-24">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">How it fits together</h2>
            <p className="text-zinc-500">A modular, type-safe graph.</p>
          </div>

          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Connection Lines (Desktop only) */}
            <div className="absolute top-1/2 left-0 -z-10 hidden h-px w-full bg-zinc-800 lg:block" />

            {/* Node 1 */}
            <div className="relative rounded-3xl border border-zinc-800 bg-[#18181B] p-8 shadow-lg transition-colors hover:border-zinc-600">
              <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-white text-xl font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                1
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-white">apps/web</h3>
              <p className="mb-6 text-zinc-400">
                Next.js 15. The modern frontend. Calls the backend using the fully typed tRPC
                client.
              </p>
              <div className="rounded-xl border border-zinc-800 bg-black/50 p-4 font-mono text-xs text-blue-400">
                trpc.users.list.useQuery()
              </div>
            </div>

            {/* Node 2 */}
            <div className="relative rounded-3xl border border-zinc-800 bg-[#18181B] p-8 shadow-lg transition-colors hover:border-zinc-600">
              <div className="mb-6 flex size-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-white">apps/server</h3>
              <p className="mb-6 text-zinc-400">
                Express API. Hosts the Better Auth endpoints and the main tRPC router. Scales
                independently.
              </p>
              <div className="rounded-xl border border-zinc-800 bg-black/50 p-4 font-mono text-xs text-purple-400">
                t.procedure.query(...)
              </div>
            </div>

            {/* Node 3 */}
            <div className="relative rounded-3xl border border-zinc-800 bg-[#18181B] p-8 shadow-lg transition-colors hover:border-zinc-600">
              <div className="mb-6 flex size-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-white">packages/store</h3>
              <p className="mb-6 text-zinc-400">
                Prisma schema and client. Single source of truth for your database. Exported to the
                server.
              </p>
              <div className="rounded-xl border border-zinc-800 bg-black/50 p-4 font-mono text-xs text-green-400">
                prisma.user.findMany()
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
