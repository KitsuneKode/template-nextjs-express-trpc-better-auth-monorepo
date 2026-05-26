export function FeatureGrid() {
  const features = [
    {
      title: 'Typed Boundaries',
      desc: 'Contracts flow through tRPC and shared packages while framework entrypoints stay thin.',
    },
    {
      title: 'Turbo Aware',
      desc: 'Tasks are shaped for Turborepo pipelines, affected checks, package boundaries, and optional remote cache.',
    },
    {
      title: 'Auth As A Module',
      desc: 'Better Auth remains the TypeScript default while Rust services can integrate through explicit API boundaries.',
    },
    {
      title: 'Agent First',
      desc: 'Ships one canonical AGENTS.md map plus .docs and .plans so agents load the right context without bloating prompts.',
    },
    {
      title: 'Deployment Shaped',
      desc: 'Vercel web, Docker services, Neon, Upstash, Changesets, and CI are documented as composable paths.',
    },
    {
      title: 'Polyglot Ready',
      desc: 'TypeScript apps, Rust workspaces, workers, and Solana client foundations are explicit preset concerns.',
    },
  ]

  return (
    <section className="grid grid-flow-dense auto-rows-fr grid-cols-1 gap-px border-y border-zinc-800 bg-zinc-800 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feat) => (
        <div
          key={feat.title}
          className="group bg-black p-8 transition-[background-color] duration-200 ease-out hover:bg-zinc-950"
        >
          <h3 className="mb-3 text-xl font-bold tracking-tight text-balance text-white">
            {feat.title}
          </h3>
          <p className="text-sm leading-relaxed font-medium text-pretty text-zinc-400">
            {feat.desc}
          </p>
        </div>
      ))}
    </section>
  )
}
