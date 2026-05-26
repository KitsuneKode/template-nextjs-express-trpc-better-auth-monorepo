import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deployment Guide',
  description:
    'Deploy Arche with three production paths: Vercel (web + API), Render Docker, or Railway Docker — Neon + Upstash for data.',
}

const referenceHosts = [
  {
    path: 'Path A — Vercel web',
    url: 'https://arche-kitsunekode.vercel.app',
    note: 'Dashboard: vercel.com/kitsunekode/arche',
  },
  {
    path: 'Path A — Vercel API',
    url: 'https://arche-api-kitsunekode.vercel.app',
    note: 'May require VERCEL_PROTECTION_BYPASS for automated smoke (deployment protection on *.vercel.app).',
  },
  {
    path: 'Path B — Render API',
    url: 'https://arche-template-api.onrender.com',
    note: 'Blueprint service arche-template-api; ENABLE_REDIS=false by default.',
  },
  {
    path: 'Path C — Railway API',
    url: 'https://<your-service>.up.railway.app',
    note: 'Deploy via railway.toml — set RAILWAY_API_URL after you generate a public domain.',
  },
] as const

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
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
            Production reference URLs
          </h2>
          <p className="text-sm leading-relaxed font-medium text-zinc-400">
            Point <code className="text-zinc-300">NEXT_PUBLIC_API_URL</code> at one API host. Use
            the same host in Better Auth and CORS env vars.
          </p>
          <ul className="space-y-4 border border-zinc-800 bg-zinc-950/80">
            {referenceHosts.map((host) => (
              <li key={host.path} className="border-b border-zinc-800 p-4 last:border-b-0 md:p-6">
                <div className="mb-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                  {host.path}
                </div>
                <code className="block font-mono text-sm text-green-400">{host.url}</code>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">{host.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6 border border-zinc-800 bg-zinc-900/50 p-8">
          <h3 className="text-lg font-bold text-white uppercase">Post-deploy smoke</h3>
          <p className="text-sm leading-relaxed text-zinc-400">
            Run locally after a deploy (not part of default CI). Validates{' '}
            <code className="text-zinc-300">/</code> and{' '}
            <code className="text-zinc-300">/health</code> including database connectivity.
          </p>
          <div className="space-y-2 border border-zinc-800 bg-black p-4 font-mono text-xs text-green-400">
            <div>$ bun run test:deploy</div>
            <div>$ bun run test:deploy:all</div>
          </div>
          <p className="text-xs text-zinc-500">
            Docs: <code className="text-zinc-400">docs/deploy-smoke.md</code> in the template repo.
          </p>
        </div>

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
              <code className="text-zinc-300">railway.toml</code>. Login:{' '}
              <code className="text-zinc-300">npx @railway/cli login</code>.
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
            Docker smoke build on every push to <code className="text-zinc-300">main</code>. Live
            deploy smoke stays manual — see <code className="text-zinc-300">test:deploy</code>.
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
