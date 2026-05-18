import { AnimatedTerminal } from '@/components/arche/animated-terminal'
import { ArchitectureGraph } from '@/components/arche/architecture-graph'
import { FeatureGrid } from '@/components/arche/feature-grid'
import { Navbar } from '@/components/arche/navbar'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black font-sans text-white selection:bg-white selection:text-black">
      <Navbar />

      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1200px] flex-col border-r border-l border-zinc-800">
        {/* Hero Area */}
        <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 md:p-16">
          {/* Subtle Grid Background */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 flex flex-col items-start">
            <div className="mb-8 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-[4px_4px_0_0_rgba(39,39,42,1)]">
              <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
              Status: Production Ready
            </div>

            <h1 className="mb-8 flex flex-col items-start gap-2 text-6xl leading-[0.9] font-black tracking-tighter uppercase md:text-[90px]">
              <span className="bg-white px-4 py-2 text-black shadow-[8px_8px_0_0_rgba(255,255,255,0.1)]">
                Engineer
              </span>
              <span className="text-white">Without Setup.</span>
            </h1>

            <p className="mb-16 max-w-2xl text-xl leading-snug font-medium text-zinc-400 md:text-2xl">
              A high-performance TypeScript monorepo. Database, authentication, API, and frontend
              structurally unified.
            </p>

            {/* Simulated CLI Terminal */}
            <AnimatedTerminal />
          </div>
        </section>

        {/* Feature Grid */}
        <FeatureGrid />

        {/* Interactive Architecture Graph */}
        <ArchitectureGraph />

        {/* Bottom Banner */}
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900 p-4 font-mono text-xs font-bold tracking-widest text-zinc-400 uppercase">
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
