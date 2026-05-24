import { Button } from '@arche-template/ui/components/button'

export default function Mockup10() {
  return (
    <main className="min-h-screen bg-[#000000] font-mono text-[#a1a1aa] selection:bg-[#f59e0b] selection:text-black">
      {/*
        Aesthetic: Terminal / Console
        Focus: For the hardcore developer. Pure code, typing animations, extreme minimal.
      */}

      <div className="mx-auto max-w-5xl px-6 py-12 md:py-24">
        <header className="mb-24 flex items-center justify-between border-b border-[#27272a] pb-8">
          <div className="flex items-center gap-3 text-2xl font-bold tracking-widest text-white uppercase">
            <div className="size-3 bg-[#f59e0b]" />
            Arche_CLI
          </div>
          <div className="flex gap-6 text-xs tracking-widest text-[#71717a] uppercase">
            <a href="/docs" className="transition-colors hover:text-white">
              Documentation
            </a>
            <a href="/docs" className="transition-colors hover:text-[#f59e0b]">
              Github
            </a>
          </div>
        </header>

        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <h1 className="mb-8 font-sans text-5xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-7xl">
              Deploy <br />
              <span className="text-[#f59e0b]">Faster.</span>
            </h1>
            <p className="mb-10 max-w-md font-sans text-lg leading-relaxed text-[#a1a1aa]">
              The full-stack TypeScript monorepo that wires together Next.js, Express, tRPC, and
              Prisma. Skip the boilerplate.
            </p>
            <div className="flex gap-4">
              <Button className="h-12 rounded-none bg-[#f59e0b] px-8 font-bold tracking-wider text-black uppercase hover:bg-[#d97706]">
                Initialize
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-none border-[#27272a] bg-transparent px-8 font-bold tracking-wider text-white uppercase hover:bg-[#27272a]"
              >
                Read Docs
              </Button>
            </div>
          </div>

          {/* Interactive Terminal Window */}
          <div className="overflow-hidden rounded-xl border border-[#27272a] bg-[#09090b] shadow-[0_0_40px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
            <div className="flex items-center gap-2 border-b border-[#27272a] bg-[#18181b] px-4 py-3">
              <div className="size-3 rounded-full bg-[#ef4444]" />
              <div className="size-3 rounded-full bg-[#eab308]" />
              <div className="size-3 rounded-full bg-[#22c55e]" />
              <div className="ml-4 text-xs text-[#71717a]">arche-cli — node</div>
            </div>
            <div className="p-6 text-sm leading-loose">
              <div className="mb-2 text-white">
                <span className="text-[#22c55e]">➜</span> <span className="text-[#3b82f6]">~</span>{' '}
                bunx --bun arche create my-app
              </div>
              <div className="mb-4 text-[#a1a1aa]">
                <span className="text-[#f59e0b]">?</span> Which family would you like to use?
                <br />
                <span className="text-[#22c55e]">❯</span> Fullstack (Next.js + Express + tRPC)
                <br />
                &nbsp;&nbsp;Backend Only (Express)
                <br />
                &nbsp;&nbsp;Frontend Only (Next.js)
              </div>
              <div className="mb-4 text-[#a1a1aa]">
                <span className="text-[#f59e0b]">?</span> Do you want to initialize a git
                repository? <span className="text-[#22c55e]">Yes</span>
              </div>
              <div className="animate-pulse text-[#3b82f6]">
                ⠋ Scaffolding project from KitsuneKode/template...
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 border-t border-[#27272a] pt-16">
          <h2 className="mb-12 flex items-center gap-4 text-2xl font-bold tracking-widest text-white uppercase">
            <span className="text-[#f59e0b]">—</span> Included Modules
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: 'Frontend', val: 'Next.js 15' },
              { label: 'Backend', val: 'Express.js' },
              { label: 'Database', val: 'Prisma ORM' },
              { label: 'API Layer', val: 'tRPC v10' },
              { label: 'Auth', val: 'Better Auth' },
              { label: 'Styling', val: 'Tailwind v4' },
              { label: 'Components', val: 'shadcn/ui' },
              { label: 'Package Manager', val: 'Bun' },
            ].map((mod, i) => (
              <div
                key={i}
                className="border-l border-[#27272a] pl-4 transition-colors hover:border-[#f59e0b]"
              >
                <div className="mb-1 text-xs text-[#71717a]">{mod.label}</div>
                <div className="text-white">{mod.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
