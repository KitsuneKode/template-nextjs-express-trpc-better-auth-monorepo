import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deployment Guide',
  description: 'Learn how to deploy your Arche monorepo using Docker, Vercel, or Fly.io.',
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
            Arche is built for high-performance production environments. Ship to any cloud that
            supports Docker or Node.js.
          </p>
        </div>
      </section>

      <section className="max-w-4xl space-y-16 p-6 md:p-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white uppercase underline underline-offset-8">
              Vercel (UI)
            </h2>
            <p className="text-sm leading-relaxed font-medium text-zinc-400">
              The <code className="text-zinc-200">apps/web</code> package is optimized for Vercel.
              Simply point the project root to the repo and set the root directory to{' '}
              <code className="text-zinc-300">apps/web</code>.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white uppercase underline underline-offset-8">
              Fly.io / VPS (API)
            </h2>
            <p className="text-sm leading-relaxed font-medium text-zinc-400">
              The <code className="text-zinc-200">apps/server</code> includes a production-ready
              Dockerfile. Deploy to Fly.io, Railway, or any VPS with ease.
            </p>
          </div>
        </div>

        <div className="space-y-6 border border-zinc-800 bg-zinc-900/50 p-8">
          <h3 className="text-lg font-bold text-white uppercase">Infrastructure as Code</h3>
          <p className="text-sm leading-relaxed text-zinc-400">
            Every family includes a <code className="text-zinc-300">docker-compose.yml</code> for
            local database and caching needs, ensuring your development environment matches
            production as closely as possible.
          </p>
          <div className="border border-zinc-800 bg-black p-4 font-mono text-xs text-green-400">
            $ docker-compose up -d
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
            CI/CD Workflows
          </h2>
          <p className="leading-relaxed font-medium text-zinc-400">
            GitHub Actions workflows are pre-configured to run linting, type checks, and tests on
            every push.
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
