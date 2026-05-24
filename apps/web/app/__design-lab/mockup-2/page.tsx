import { Badge } from '@arche-template/ui/components/badge'
import { Button } from '@arche-template/ui/components/button'
import { Card } from '@arche-template/ui/components/card'

export default function Mockup2() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 font-sans text-zinc-100 selection:bg-amber-500/30">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-sky-500/5 blur-[100px]" />

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
        <div className="flex h-14 items-center justify-between gap-12 rounded-full border border-zinc-800/50 bg-zinc-900/60 px-6 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 shadow-inner shadow-white/20"></div>
            <span className="font-semibold tracking-tight text-zinc-100">Arche</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="/docs" className="transition-colors hover:text-zinc-100">
              Families
            </a>
            <a href="/docs" className="transition-colors hover:text-zinc-100">
              Docs
            </a>
            <a href="/docs" className="transition-colors hover:text-zinc-100">
              Examples
            </a>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
          >
            GitHub
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pt-48 pb-32 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
          </span>
          v3.0 is now available
        </div>

        <h1 className="mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-6xl font-bold tracking-tight text-balance text-transparent md:text-8xl">
          The beginning of <br /> every project.
        </h1>
        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-balance text-zinc-400 md:text-xl">
          One command. Full-stack TypeScript monorepo. Auth, database, API, frontend — wired and
          ready.
        </p>

        {/* Terminal Block */}
        <div className="mb-10 flex w-full max-w-xl items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-2 shadow-2xl ring-1 shadow-black/40 ring-white/5 backdrop-blur-2xl">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-950/50 px-4 py-3 font-mono text-sm">
            <span className="text-zinc-500">~</span>
            <code className="text-zinc-200">npx arche create my-app</code>
          </div>
          <Button className="rounded-xl bg-amber-500 px-6 text-amber-950 transition-all hover:bg-amber-400 active:scale-[0.97]">
            Copy
          </Button>
        </div>

        <div className="flex max-w-3xl flex-wrap justify-center gap-2">
          {['Fullstack Monorepo', 'Better Auth', 'tRPC', 'Prisma', 'Express', 'Next.js'].map(
            (tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="rounded-full border border-zinc-800/50 bg-zinc-900/50 px-4 py-1.5 font-medium text-zinc-300 backdrop-blur-sm"
              >
                {tech}
              </Badge>
            ),
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Create',
              desc: 'Pick a family. Answer 5 prompts. Get a working monorepo in seconds.',
              icon: '⚡',
            },
            {
              title: 'Extend',
              desc: 'Add realtime WebSocket, AI bundles, analytics, or S3 storage post-scaffold.',
              icon: '🧩',
            },
            {
              title: 'Type-Safe',
              desc: 'End-to-end types from database schema through tRPC to your frontend.',
              icon: '🛡️',
            },
            {
              title: 'Auth Ready',
              desc: 'Better Auth with social providers, sessions, and protected routes.',
              icon: '🔐',
            },
            {
              title: 'Scale Aware',
              desc: 'Docker Compose, nginx config, GitHub Actions CI — all generated.',
              icon: '📈',
            },
            {
              title: 'Agent-First',
              desc: 'Every project ships with AGENTS.md, CLAUDE.md, and IDE rules files.',
              icon: '🤖',
            },
          ].map((feat, i) => (
            <Card
              key={i}
              className="rounded-3xl border-zinc-800/50 bg-zinc-900/40 p-6 shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-zinc-800/40"
            >
              <div className="mb-6 flex size-12 items-center justify-center rounded-2xl border border-zinc-700/50 bg-zinc-800/80 text-xl shadow-inner shadow-white/5">
                {feat.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-zinc-100">{feat.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
