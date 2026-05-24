import { Badge } from '@arche-template/ui/components/badge'
import { Button } from '@arche-template/ui/components/button'

export default function Mockup3() {
  return (
    <main className="min-h-screen bg-amber-500 font-sans text-black selection:bg-black selection:text-amber-500">
      {/* Navigation */}
      <nav className="p-6">
        <div className="flex items-center justify-between border-b-4 border-black pb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-tighter uppercase">ARCHE.</span>
          </div>
          <div className="flex items-center gap-8 text-lg font-bold tracking-tight uppercase">
            <a href="/docs" className="underline-offset-4 hover:underline">
              Families
            </a>
            <a href="/docs" className="underline-offset-4 hover:underline">
              Docs
            </a>
            <a href="/docs" className="underline-offset-4 hover:underline">
              Examples
            </a>
            <Button className="rounded-none border-2 border-transparent bg-black px-8 py-6 text-lg font-bold tracking-tight text-amber-500 uppercase hover:bg-black/80">
              GitHub ↗
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-start border-b-4 border-black px-6 pt-20 pb-24">
        <h1 className="mb-8 text-[12vw] leading-[0.8] font-black tracking-tighter uppercase">
          The beginning <br /> of every project.
        </h1>
        <p className="mb-12 max-w-4xl text-3xl leading-snug font-medium text-balance">
          One command. Full-stack TypeScript monorepo. Auth, database, API, frontend — wired and
          ready.
        </p>

        {/* Terminal Block */}
        <div className="mb-16 flex w-full max-w-3xl flex-col gap-6 rounded-none bg-black p-6 text-white shadow-[16px_16px_0px_0px_rgba(0,0,0,0.2)] md:flex-row md:items-center">
          <div className="flex-1 font-mono text-xl">
            <span className="mr-4 text-amber-500">❯</span>
            npx arche create my-app
          </div>
          <Button className="rounded-none bg-amber-500 px-8 py-6 text-lg font-bold text-black uppercase hover:bg-amber-400">
            Copy
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          {['Fullstack Monorepo', 'Better Auth', 'tRPC', 'Prisma', 'Express', 'Next.js'].map(
            (tech) => (
              <Badge
                key={tech}
                className="rounded-none bg-black px-4 py-2 text-lg font-bold tracking-tight text-amber-500 uppercase hover:bg-black/90"
              >
                {tech}
              </Badge>
            ),
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-black px-6 py-24 text-amber-500">
        <div className="grid grid-cols-1 gap-px border-4 border-amber-500 bg-amber-500 md:grid-cols-2">
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
            <div key={i} className="bg-black p-12 transition-colors hover:bg-zinc-950">
              <h3 className="mb-6 flex items-center gap-4 text-5xl font-black tracking-tighter uppercase">
                <span className="text-6xl text-zinc-700">0{i + 1}</span> {feat.title}
              </h3>
              <p className="text-2xl leading-snug text-zinc-300">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
