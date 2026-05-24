import { Badge } from '@arche-template/ui/components/badge'
import { Button } from '@arche-template/ui/components/button'

export default function Mockup1() {
  return (
    <main className="min-h-screen bg-neutral-950 font-sans text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-sm bg-amber-500"></div>
            <span className="text-lg font-bold tracking-tight">Arche</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-sm text-neutral-400">
            <a href="/docs" className="transition-colors hover:text-amber-500">
              Families
            </a>
            <a href="/docs" className="transition-colors hover:text-amber-500">
              Docs
            </a>
            <a href="/docs" className="transition-colors hover:text-amber-500">
              Examples
            </a>
            <a href="/docs" className="text-neutral-100 transition-colors hover:text-amber-500">
              GitHub ↗
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto flex max-w-7xl flex-col items-start border-r border-l border-neutral-800/30 px-6 pt-32 pb-24">
        <h1 className="mb-6 text-6xl font-black tracking-tighter text-balance md:text-8xl">
          The beginning of <br />
          <span className="text-amber-500">every project.</span>
        </h1>
        <p className="mb-12 max-w-3xl text-xl leading-relaxed text-balance text-neutral-400 md:text-2xl">
          One command. Full-stack TypeScript monorepo. Auth, database, API, frontend — wired and
          ready.
        </p>

        {/* Terminal Block */}
        <div className="mb-8 flex w-full max-w-2xl items-center gap-4 rounded-none border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm shadow-[8px_8px_0_0_rgba(245,158,11,0.2)] sm:text-base">
          <span className="shrink-0 text-amber-500">$</span>
          <code className="flex-1 overflow-x-auto whitespace-nowrap text-sky-300">
            npx arche create my-app
          </code>
          <Button
            variant="outline"
            size="sm"
            className="rounded-none border-neutral-700 transition-all hover:border-amber-500 hover:bg-amber-500 hover:text-neutral-950"
          >
            Copy
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          {['Fullstack Monorepo', 'Better Auth', 'tRPC', 'Prisma', 'Express', 'Next.js'].map(
            (tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="rounded-none border border-neutral-800 bg-neutral-900 font-mono text-neutral-400 hover:bg-neutral-800"
              >
                {tech}
              </Badge>
            ),
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mx-auto max-w-7xl border-t border-neutral-800/50 px-6 py-24">
        <div className="grid grid-cols-1 gap-px bg-neutral-800/50 md:grid-cols-3">
          {[
            {
              title: 'Create',
              desc: 'Pick a family. Answer 5 prompts. Get a working monorepo in seconds.',
            },
            {
              title: 'Extend',
              desc: 'Add realtime WebSocket, AI bundles, analytics, or S3 storage post-scaffold.',
            },
            {
              title: 'Type-Safe',
              desc: 'End-to-end types from database schema through tRPC to your frontend.',
            },
            {
              title: 'Auth Ready',
              desc: 'Better Auth with social providers, sessions, and protected routes.',
            },
            {
              title: 'Scale Aware',
              desc: 'Docker Compose, nginx config, GitHub Actions CI — all generated.',
            },
            {
              title: 'Agent-First',
              desc: 'Every project ships with AGENTS.md, CLAUDE.md, and IDE rules files.',
            },
          ].map((feat, i) => (
            <div
              key={i}
              className="group flex flex-col justify-between bg-neutral-950 p-8 transition-colors hover:bg-neutral-900/50"
            >
              <div>
                <h3 className="mb-3 inline-block border-b border-amber-500/30 pb-2 font-mono text-xl font-bold text-neutral-100">
                  0{i + 1} {'//'} {feat.title}
                </h3>
                <p className="leading-relaxed text-neutral-400">{feat.desc}</p>
              </div>
              <div className="mt-8 flex size-8 items-center justify-center border border-neutral-800 transition-colors group-hover:border-amber-500 group-hover:text-amber-500">
                +
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
