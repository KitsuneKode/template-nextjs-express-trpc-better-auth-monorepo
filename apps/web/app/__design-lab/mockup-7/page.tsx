import { Badge } from '@template/ui/components/badge'
import { Button } from '@template/ui/components/button'

export default function Mockup7() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black font-sans text-white selection:bg-amber-500/30">
      {/* High-Tech / Glow / Developer Aesthetic */}

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute top-[-20%] left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-32 pb-24 text-center">
        <Badge
          variant="outline"
          className="mb-8 rounded-full border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-md"
        >
          <span className="mr-2 inline-block size-2 animate-pulse rounded-full bg-amber-500" />
          Arche v3.0 Engine
        </Badge>

        <h1 className="mb-8 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-6xl leading-[0.95] font-bold tracking-tighter text-transparent md:text-[88px]">
          The beginning of <br /> every project.
        </h1>

        <p className="mb-14 max-w-2xl text-lg leading-relaxed text-balance text-zinc-400 md:text-xl">
          One command. Full-stack TypeScript monorepo. Auth, database, API, frontend — wired and
          ready.
        </p>

        {/* Glow Terminal */}
        <div className="group relative mb-20 w-full max-w-2xl">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-500/30 to-amber-500/0 opacity-30 blur transition duration-500 group-hover:opacity-60" />
          <div className="relative flex items-center rounded-2xl border border-white/10 bg-zinc-950/80 p-2 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-1 items-center gap-3 px-4 py-3 text-left font-mono text-sm">
              <span className="text-zinc-600">~</span>
              <code className="text-zinc-200">bunx --bun arche create my-app</code>
            </div>
            <Button className="rounded-xl bg-white px-6 font-medium text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:bg-zinc-200 active:scale-95">
              Copy
            </Button>
          </div>
        </div>

        {/* Minimal Feature List */}
        <div className="grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Create', desc: 'Answer 5 prompts. Get a working monorepo.' },
            { title: 'Extend', desc: 'Realtime WebSocket, AI bundles, analytics.' },
            { title: 'Type-Safe', desc: 'End-to-end types from DB to frontend.' },
            { title: 'Auth Ready', desc: 'Better Auth with social providers & sessions.' },
            { title: 'Scale Aware', desc: 'Docker Compose, nginx config, CI generated.' },
            { title: 'Agent-First', desc: 'Ships with AGENTS.md and IDE rules files.' },
          ].map((feat, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]"
            >
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-500/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
              <h3 className="relative z-10 mb-2 text-base font-semibold text-zinc-200">
                {feat.title}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed text-zinc-500">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
