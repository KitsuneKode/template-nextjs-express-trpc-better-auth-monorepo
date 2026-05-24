import { Button } from '@template/ui/components/button'

export default function Mockup14() {
  return (
    <main className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
      {/*
        Aesthetic: Linear / Geist Stark Brutalism
        Focus: 1px solid borders everywhere, pure black/white, sharp corners, highly technical, grid systems.
      */}

      <div className="border-b border-black">
        <nav className="mx-auto flex h-12 max-w-[1200px] items-center justify-between border-r border-l border-black bg-white px-6">
          <div className="flex items-center gap-4 text-sm font-semibold tracking-tight uppercase">
            <div className="size-3 bg-black" />
            ARCHE
          </div>
          <div className="flex items-center gap-6 text-[13px] font-medium">
            <a href="/docs" className="underline-offset-4 hover:underline">
              Families
            </a>
            <a href="/docs" className="underline-offset-4 hover:underline">
              Documentation
            </a>
            <a href="/docs" className="underline-offset-4 hover:underline">
              Changelog
            </a>
          </div>
        </nav>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[1200px] flex-col border-r border-l border-black">
        {/* Hero Area */}
        <section className="relative overflow-hidden border-b border-black bg-white p-6 md:p-16">
          {/* Subtle Grid Background */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 border border-black bg-white px-3 py-1 text-xs font-bold tracking-wider uppercase">
              <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
              Status: Production Ready
            </div>

            <h1 className="mb-8 text-6xl leading-[0.9] font-bold tracking-tighter md:text-[90px]">
              Engineer <br />
              <span className="text-zinc-400">Without Setup.</span>
            </h1>

            <p className="mb-12 max-w-2xl text-xl leading-snug font-medium text-zinc-600 md:text-2xl">
              A high-performance TypeScript monorepo. Database, authentication, API, and frontend
              structurally unified.
            </p>

            <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 border border-black bg-zinc-50 px-4 py-3 font-mono text-sm">
                <span className="text-zinc-400">~</span>
                <code className="text-black">bunx --bun arche create my-app</code>
              </div>
              <Button className="h-[46px] rounded-none border border-black bg-black px-8 font-bold text-white hover:bg-zinc-800">
                Initialize
              </Button>
            </div>
          </div>
        </section>

        {/* Technical Features (Strict Grid) */}
        <section className="grid flex-1 grid-cols-1 divide-y divide-black bg-white md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
          <div className="group p-8 transition-colors hover:bg-zinc-50">
            <div className="mb-4 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              Module / 01
            </div>
            <h3 className="mb-3 text-lg font-bold tracking-tight">End-to-End Types</h3>
            <p className="text-sm leading-relaxed text-zinc-600">
              Prisma schema types flow seamlessly through tRPC routers directly into your Next.js
              components.
            </p>
          </div>

          <div className="group p-8 transition-colors hover:bg-zinc-50">
            <div className="mb-4 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              Module / 02
            </div>
            <h3 className="mb-3 text-lg font-bold tracking-tight">Turbo Powered</h3>
            <p className="text-sm leading-relaxed text-zinc-600">
              Zero-config build caching and task execution. Only rebuild what changed.
            </p>
          </div>

          <div className="group p-8 transition-colors hover:bg-zinc-50">
            <div className="mb-4 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              Module / 03
            </div>
            <h3 className="mb-3 text-lg font-bold tracking-tight">Better Auth</h3>
            <p className="text-sm leading-relaxed text-zinc-600">
              Sessions, OAuth providers, and protected routes pre-wired into the Express backend.
            </p>
          </div>

          <div className="group p-8 transition-colors hover:bg-zinc-50">
            <div className="mb-4 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              Module / 04
            </div>
            <h3 className="mb-3 text-lg font-bold tracking-tight">Agent First</h3>
            <p className="text-sm leading-relaxed text-zinc-600">
              Ships with AGENTS.md, rules for Cursor, and structural memory files. Built to be
              maintained by AI.
            </p>
          </div>
        </section>

        {/* Bottom Banner */}
        <div className="flex items-center justify-between border-t border-black bg-white p-4 font-mono text-xs tracking-widest text-zinc-500 uppercase">
          <div>Next.js 15</div>
          <div>Express</div>
          <div className="hidden sm:block">tRPC</div>
          <div className="hidden md:block">Prisma</div>
          <div className="hidden md:block">Bun</div>
        </div>
      </div>
    </main>
  )
}
