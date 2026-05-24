export function FeatureGrid() {
  const features = [
    {
      title: 'Typed Boundaries',
      desc: 'Contracts flow through tRPC and shared packages while framework entrypoints stay thin.',
      id: '01',
    },
    {
      title: 'Turbo Aware',
      desc: 'Tasks are shaped for Turborepo pipelines, affected checks, package boundaries, and optional remote cache.',
      id: '02',
    },
    {
      title: 'Auth As A Module',
      desc: 'Better Auth remains the TypeScript default while Rust services can integrate through explicit API boundaries.',
      id: '03',
    },
    {
      title: 'Agent First',
      desc: 'Ships one canonical AGENTS.md map plus .docs and .plans so agents load the right context without bloating prompts.',
      id: '04',
    },
    {
      title: 'Deployment Shaped',
      desc: 'Vercel web, Docker services, Neon, Upstash, Changesets, and CI are documented as composable paths.',
      id: '05',
    },
    {
      title: 'Polyglot Ready',
      desc: 'TypeScript apps, Rust workspaces, workers, and Solana client foundations are explicit preset concerns.',
      id: '06',
    },
  ]

  return (
    <section className="grid grid-cols-1 divide-y divide-zinc-800 border-y border-zinc-800 bg-black md:grid-cols-2 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
      {features.map((feat) => (
        <div
          key={feat.id}
          className="group relative overflow-hidden p-8 transition-[background-color] duration-200 ease-out hover:bg-zinc-900/50"
        >
          <div className="absolute -top-4 -right-4 text-[120px] font-black text-zinc-900 opacity-0 transition-[opacity,transform] duration-500 ease-out select-none group-hover:translate-y-1 group-hover:opacity-50">
            {feat.id}
          </div>
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
              <span className="block size-1.5 bg-white" />
              Module / {feat.id}
            </div>
            <h3 className="mb-3 text-xl font-bold tracking-tight text-white">{feat.title}</h3>
            <p className="text-sm leading-relaxed font-medium text-pretty text-zinc-400">
              {feat.desc}
            </p>
          </div>
        </div>
      ))}
    </section>
  )
}
