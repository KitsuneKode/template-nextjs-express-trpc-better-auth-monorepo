import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'tRPC API Guide',
  description: 'Build typesafe APIs that connect your frontend and backend.',
}

export default function TrpcDocsPage() {
  return (
    <div className="flex h-full flex-col">
      <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 md:p-12">
        <div className="relative z-10 flex max-w-3xl flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase">
            Package / tRPC
          </div>
          <h1 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-5xl">
            Typesafe <br />
            <span className="text-stroke-white text-transparent">APIs.</span>
          </h1>
          <p className="text-lg leading-snug font-medium text-zinc-400">
            The connective tissue of the monorepo. Type safety from your function definition to your
            UI components.
          </p>
        </div>
      </section>

      <section className="max-w-4xl space-y-12 p-6 md:p-12">
        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-tight uppercase">The Glue</h2>
          <p className="leading-relaxed font-medium text-zinc-400">
            tRPC allows us to share TypeScript types between the{' '}
            <code className="text-zinc-200">apps/server</code> (the provider) and{' '}
            <code className="text-zinc-200">apps/web</code> (the consumer) without a separate build
            step or Swagger definition.
          </p>
        </div>

        <div className="space-y-6">
          <div className="border border-zinc-800 bg-zinc-950 p-8">
            <h3 className="mb-4 text-xl font-bold text-white">How it works</h3>
            <ol className="space-y-6">
              {[
                {
                  title: 'Define procedures',
                  desc: 'In apps/server/src/modules/<feature>/*.trpc.ts, define procedures and Zod schemas.',
                },
                {
                  title: 'Compose router',
                  desc: 'Wire feature routers in apps/server/src/modules/trpc/app.router.ts.',
                },
                {
                  title: 'Share contract',
                  desc: 'packages/trpc re-exports AppRouter and createCaller for the web client only.',
                },
                {
                  title: 'Import type',
                  desc: 'The frontend imports only the type (zero runtime router code shared).',
                },
                {
                  title: 'Auto-Complete',
                  desc: 'Your IDE provides full auto-complete and type checking for every API call.',
                },
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-mono text-zinc-600">[{i + 1}]</span>
                  <div>
                    <div className="font-bold tracking-tight text-white uppercase">
                      {step.title}
                    </div>
                    <div className="text-sm text-zinc-500">{step.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col border border-zinc-800 p-6">
            <div className="mb-4 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              Procedural Logic
            </div>
            <h4 className="mb-2 text-lg font-bold">Middlewares</h4>
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
              Built-in middlewares for authentication and logging ensure every procedure is secure
              and audited.
            </p>
            <div className="mt-auto bg-zinc-900 p-3 font-mono text-xs text-blue-400">
              protectedProcedure.query(...)
            </div>
          </div>
          <div className="flex flex-col border border-zinc-800 p-6">
            <div className="mb-4 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              Validation
            </div>
            <h4 className="mb-2 text-lg font-bold">Zod Integration</h4>
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
              Input validation is enforced at the network boundary, catching errors before they
              reach your logic.
            </p>
            <div className="mt-auto bg-zinc-900 p-3 font-mono text-xs text-pink-400">
              .input(z.object({'{'} ... {'}'}))
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
