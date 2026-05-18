import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Database & Store',
  description: 'Managing Prisma schema, migrations, and database access.',
}

export default function StoreDocsPage() {
  return (
    <div className="flex h-full flex-col">
      <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 md:p-12">
        <div className="relative z-10 flex max-w-3xl flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase">
            Package / Store
          </div>
          <h1 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-5xl">
            Prisma <br />
            <span className="text-stroke-white text-transparent">Store.</span>
          </h1>
          <p className="text-lg leading-snug font-medium text-zinc-400">
            The single source of truth for your data models. Encapsulated database access and
            migrations.
          </p>
        </div>
      </section>

      <section className="max-w-4xl space-y-12 p-6 md:p-12">
        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-tight uppercase">Architecture</h2>
          <p className="mb-6 leading-relaxed font-medium text-zinc-400">
            Located in{' '}
            <code className="border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-zinc-200">
              packages/store
            </code>
            , this package owns the Prisma schema. By centralizing the database client, we ensure
            that any app or worker in the monorepo uses the same model definitions.
          </p>
          <div className="flex flex-col gap-8 border border-zinc-800 bg-zinc-900 p-6 md:flex-row">
            <div className="flex-1">
              <div className="mb-3 font-mono text-xs tracking-widest text-zinc-500 uppercase">
                Database Client
              </div>
              <p className="text-sm text-zinc-400">
                A singleton PrismaClient instance exported for use in apps.
              </p>
            </div>
            <div className="flex-1">
              <div className="mb-3 font-mono text-xs tracking-widest text-zinc-500 uppercase">
                Migrations
              </div>
              <p className="text-sm text-zinc-400">
                All SQL migration files live here, tracking your schema evolution.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-white uppercase">
            Database Operations
          </h2>
          <div className="space-y-4">
            {[
              {
                cmd: 'bun run db:generate',
                desc: 'Regenerates the typed Prisma client after schema changes.',
              },
              {
                cmd: 'bun run db:migrate',
                desc: 'Applies migrations and updates your database schema.',
              },
              {
                cmd: 'bun run db:studio',
                desc: 'Opens the interactive Prisma UI to view and edit data.',
              },
              {
                cmd: 'bun run db:seed',
                desc: 'Executes the seed script to populate your database.',
              },
            ].map((c, i) => (
              <div
                key={i}
                className="flex flex-col justify-between gap-4 border border-zinc-800 p-4 transition-colors hover:bg-zinc-900/30 sm:flex-row sm:items-center"
              >
                <code className="font-mono text-sm text-blue-400">{c.cmd}</code>
                <span className="text-sm font-medium text-zinc-500">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-zinc-800 bg-black p-8">
          <h3 className="mb-4 flex items-center gap-3 text-lg font-bold tracking-tight text-white uppercase">
            <span className="size-2 bg-green-500" />
            AI Ready
          </h3>
          <p className="text-sm leading-relaxed text-zinc-400">
            The store package includes specific rules to help AI agents understand how to extend the
            database. When you ask to "add a new model", the agent reads the context in{' '}
            <code className="text-zinc-300">AGENTS.md</code> to follow the correct monorepo
            patterns.
          </p>
        </div>
      </section>
    </div>
  )
}
