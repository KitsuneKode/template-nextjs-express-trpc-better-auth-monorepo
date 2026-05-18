import { Badge } from '@template/ui/components/badge'
import { Button } from '@template/ui/components/button'
import { Card } from '@template/ui/components/card'

export default function Mockup4() {
  return (
    <main className="min-h-screen bg-[#FBFBFB] font-sans text-zinc-900 selection:bg-amber-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/50 bg-[#FBFBFB]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="size-5 rounded-[6px] bg-amber-500 shadow-sm"></div>
            <span className="text-[17px] font-semibold tracking-tight text-zinc-900">Arche</span>
          </div>
          <div className="flex items-center gap-8 text-[15px] font-medium text-zinc-500">
            <a href="/docs" className="transition-colors hover:text-zinc-900">
              Families
            </a>
            <a href="/docs" className="transition-colors hover:text-zinc-900">
              Docs
            </a>
            <a href="/docs" className="transition-colors hover:text-zinc-900">
              Examples
            </a>
            <a href="/docs" className="text-zinc-900 transition-colors hover:text-zinc-600">
              GitHub ↗
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-32 pb-24 text-center">
        <h1 className="mb-6 text-6xl leading-[1.1] font-bold tracking-tight text-balance text-zinc-900 md:text-[80px]">
          The beginning of <br /> every project.
        </h1>
        <p className="mb-12 max-w-2xl text-xl leading-relaxed font-medium text-balance text-zinc-500 md:text-[22px]">
          One command. Full-stack TypeScript monorepo. Auth, database, API, frontend — wired and
          ready.
        </p>

        {/* Terminal Block */}
        <div className="mb-12 flex w-full max-w-xl items-center gap-3 rounded-[20px] border border-zinc-200/80 bg-white p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex flex-1 items-center gap-3 rounded-[14px] bg-zinc-50/50 px-4 py-3 font-mono text-[15px]">
            <span className="text-zinc-400">❯</span>
            <code className="text-zinc-800">npx arche create my-app</code>
          </div>
          <Button className="h-full rounded-[14px] bg-zinc-900 px-6 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.97]">
            Copy
          </Button>
        </div>

        <div className="flex max-w-3xl flex-wrap justify-center gap-2">
          {['Fullstack Monorepo', 'Better Auth', 'tRPC', 'Prisma', 'Express', 'Next.js'].map(
            (tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="rounded-full border border-zinc-200/80 bg-white px-4 py-1.5 text-[13px] font-medium text-zinc-600 shadow-sm"
              >
                {tech}
              </Badge>
            ),
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="border-t border-zinc-100 bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <Card
                key={i}
                className="rounded-[24px] border-zinc-200/60 bg-[#FBFBFB] p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-6 flex size-10 items-center justify-center rounded-full bg-amber-100">
                  <div className="size-4 rounded-full bg-amber-500"></div>
                </div>
                <h3 className="mb-2 text-[19px] font-semibold tracking-tight text-zinc-900">
                  {feat.title}
                </h3>
                <p className="text-[15px] leading-relaxed font-medium text-zinc-500">{feat.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
