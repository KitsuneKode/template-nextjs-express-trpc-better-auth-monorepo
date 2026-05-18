import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Architecture Overview',
  description: 'Deep dive into the Arche monorepo architecture and package boundaries.',
}

export default function ArchitectureDocsPage() {
  return (
    <div className="flex h-full flex-col">
      <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 text-left md:p-12">
        <div className="relative z-10 flex max-w-3xl flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase">
            Core Concepts
          </div>
          <h1 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-5xl">
            Architecture <br />
            <span className="text-stroke-white text-transparent">Principles.</span>
          </h1>
          <p className="text-lg leading-snug font-medium text-zinc-300">
            Arche is designed for high-velocity teams who need to scale without losing architectural
            integrity.
          </p>
        </div>
      </section>

      <section className="max-w-4xl space-y-16 p-6 md:p-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
            1. Package Boundaries
          </h2>
          <p className="leading-relaxed font-medium text-zinc-400">
            We use Turborepo to enforce strict boundaries. Code in{' '}
            <code className="border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-zinc-200">
              packages/
            </code>{' '}
            must be stateless and focused on a single domain. This allows your{' '}
            <code className="text-zinc-300">apps/</code> (web, server, workers) to share logic
            without circular dependencies.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="mb-2 text-xs font-bold text-white uppercase">Shared Logic</h3>
              <p className="text-sm text-zinc-500">
                Auth protocols, database clients, and shared tRPC routers live in packages.
              </p>
            </div>
            <div className="border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="mb-2 text-xs font-bold text-white uppercase">Environment Isolation</h3>
              <p className="text-sm text-zinc-500">
                Server-only code is kept out of the UI bundle via package exports.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">2. Type Flow</h2>
          <p className="leading-relaxed font-medium text-zinc-400">
            Type safety is the "origin" of Arche. A single change in your database schema propagates
            to your frontend with zero manual intervention.
          </p>
          <div className="border border-zinc-800 bg-black p-6 font-mono text-sm leading-relaxed text-blue-400">
            Prisma Schema → Prisma Client → tRPC Router → Next.js UI
          </div>
        </div>

        <div className="border border-zinc-800 bg-zinc-950 p-8">
          <h3 className="mb-4 flex items-center gap-3 text-lg font-bold text-white uppercase">
            <span className="size-2 bg-amber-500" />
            ADR Process
          </h3>
          <p className="text-sm leading-relaxed text-zinc-400">
            The <code className="text-zinc-300">docs/architecture-decisions.md</code> file in this
            repo tracks every major decision made during the development of Arche, providing the
            "why" behind the code.
          </p>
        </div>
      </section>
    </div>
  )
}
