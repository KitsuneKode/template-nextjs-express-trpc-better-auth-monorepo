import { Button } from '@arche-template/ui/components/button'

export default function Mockup11() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] font-sans text-slate-300 selection:bg-indigo-500/30">
      {/*
        Aesthetic: Spatial Typography / Stealth Agent
        Focus: Deep blue-blacks, overlapping massive typography, focus on the "Agent-First" nature.
      */}

      {/* Abstract Background Elements */}
      <div className="pointer-events-none absolute top-0 left-0 h-[800px] w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.15),rgba(255,255,255,0))]" />

      <div className="mx-auto max-w-7xl px-6 pt-8 pb-32">
        {/* Minimal Stealth Nav */}
        <nav className="relative z-20 mb-32 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter text-white">Arche //</div>
          <Button
            variant="ghost"
            className="rounded-full text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            View on GitHub
          </Button>
        </nav>

        <div className="relative z-10">
          {/* Overlapping massive typography */}
          <div className="absolute -top-20 -left-10 -z-10 text-[12rem] leading-none font-black tracking-tighter text-slate-900/30 mix-blend-color-dodge select-none">
            AGENT
            <br />
            READY
          </div>

          <h1 className="mb-8 max-w-4xl text-6xl leading-[1.05] font-bold tracking-tight text-white drop-shadow-2xl md:text-[5.5rem]">
            The monorepo built <br />
            for{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              AI Engineers.
            </span>
          </h1>

          <p className="mb-12 max-w-2xl text-xl leading-relaxed text-slate-400">
            Stop explaining your stack to Claude. Arche ships with native{' '}
            <code className="rounded bg-indigo-950/50 px-2 py-1 text-indigo-300">AGENTS.md</code>{' '}
            and project memory files. The foundation is wired, the rules are set.
          </p>

          <div className="mb-32 flex flex-col gap-4 sm:flex-row">
            <Button className="h-14 rounded-full bg-indigo-600 px-8 text-base font-semibold text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:bg-indigo-500 active:scale-95">
              Copy Install Command
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-full border-slate-800 bg-slate-900/50 px-8 text-base font-semibold text-white backdrop-blur-md hover:bg-slate-800"
            >
              Read the Rules
            </Button>
          </div>
        </div>

        {/* Feature Sections with connecting lines */}
        <div className="relative ml-8 space-y-24 border-l border-slate-800 pl-8 md:pl-16">
          <div className="relative">
            <div className="absolute top-2 -left-[33px] size-4 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 md:-left-[65px]" />
            <h3 className="mb-4 text-3xl font-bold text-white">Strict Architectural Boundaries</h3>
            <p className="mb-6 max-w-xl text-lg leading-relaxed text-slate-400">
              Apps stay in <code className="text-slate-300">apps/</code>, logic stays in{' '}
              <code className="text-slate-300">packages/</code>. Turborepo handles the build graph
              perfectly.
            </p>
            <div className="max-w-xl rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
              <pre className="font-mono text-sm text-slate-300">
                ├── apps/
                <br />│ ├── web/ <span className="text-slate-600">{`// Next.js`}</span>
                <br />│ └── server/ <span className="text-slate-600">{`// Express`}</span>
                <br />
                └── packages/
                <br />
                ├── store/ <span className="text-slate-600">{`// Prisma DB`}</span>
                <br />
                └── trpc/ <span className="text-slate-600">{`// Shared types`}</span>
              </pre>
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-2 -left-[33px] size-4 rounded-full bg-cyan-500 ring-4 ring-cyan-500/20 md:-left-[65px]" />
            <h3 className="mb-4 text-3xl font-bold text-white">Repo Hygiene Built-In</h3>
            <p className="max-w-xl text-lg leading-relaxed text-slate-400">
              Run <code className="text-cyan-300">bun run repo:doctor</code> to audit stale
              scaffolding, check exports, and ensure your monorepo stays pristine as it scales.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
