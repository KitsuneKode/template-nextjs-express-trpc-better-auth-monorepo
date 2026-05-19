import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deployment Guide',
  description:
    'Deploy Arche with three production paths: Vercel (web + API), Render Docker, or Railway Docker — Neon + Upstash for data.',
}

export default function DeployDocsPage() {
  return (
    <div className="flex h-full flex-col">
      <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 text-left md:p-12">
        <div className="relative z-10 flex max-w-3xl flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase">
            Operations
          </div>
          <h1 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-5xl">
            Ready for <br />
            <span className="text-stroke-white text-transparent">Shipping.</span>
          </h1>
          <p className="text-lg leading-snug font-medium text-zinc-300">
            Arche ships with three documented paths: all-in on Vercel, or Vercel web plus Docker API
            on Render or Railway. Postgres and Redis stay external (Neon + Upstash).
          </p>
        </div>
      </section>

      <section className="max-w-4xl space-y-16 p-6 md:p-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white uppercase underline underline-offset-8">
              Path A — Vercel
            </h2>
            <p className="text-sm leading-relaxed font-medium text-zinc-400">
              Deploy <code className="text-zinc-200">apps/web</code> and{' '}
              <code className="text-zinc-200">apps/server</code> as two Vercel projects. API uses{' '}
              <code className="text-zinc-300">vercel-handler.ts</code>.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white uppercase underline underline-offset-8">
              Path B — Render
            </h2>
            <p className="text-sm leading-relaxed font-medium text-zinc-400">
              Web on Vercel; API via <code className="text-zinc-300">render.yaml</code> and{' '}
              <code className="text-zinc-200">apps/server/Dockerfile</code>. Paste Neon and Upstash
              URLs in the dashboard.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white uppercase underline underline-offset-8">
              Path C — Railway
            </h2>
            <p className="text-sm leading-relaxed font-medium text-zinc-400">
              Same split as Render: Vercel for web, Railway Docker for the API using{' '}
              <code className="text-zinc-300">railway.toml</code>.
            </p>
          </div>
        </div>

        <div className="space-y-6 border border-zinc-800 bg-zinc-900/50 p-8">
          <h3 className="text-lg font-bold text-white uppercase">Infrastructure as Code</h3>
          <p className="text-sm leading-relaxed text-zinc-400">
            Fullstack scaffolds include <code className="text-zinc-300">docker-compose.yml</code>{' '}
            for local Postgres and Redis. Production uses Neon + Upstash URLs on every path.
          </p>
          <div className="border border-zinc-800 bg-black p-4 font-mono text-xs text-green-400">
            $ docker compose up -d
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
            CI/CD Workflows
          </h2>
          <p className="leading-relaxed font-medium text-zinc-400">
            GitHub Actions runs format check, lint, typecheck, tests, Vercel server build, and a
            Docker smoke build on every push to <code className="text-zinc-300">main</code>.
          </p>
          <div className="flex items-center gap-4 border border-zinc-800 bg-zinc-900 p-6">
            <span className="size-4 animate-pulse bg-blue-500" />
            <code className="font-mono text-xs text-zinc-300">.github/workflows/ci.yml</code>
          </div>
        </div>
      </section>
    </div>
  )
}
