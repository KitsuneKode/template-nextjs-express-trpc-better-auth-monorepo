export function FeatureGrid() {
  const features = [
    {
      title: 'End-to-End Types',
      desc: 'Prisma schema types flow seamlessly through tRPC routers directly into your Next.js components without manual codegen steps.',
      id: '01',
    },
    {
      title: 'Turbo Powered',
      desc: 'Zero-config build caching and task execution. Only rebuild what changed. Local and remote cache enabled by default.',
      id: '02',
    },
    {
      title: 'Better Auth',
      desc: 'Sessions, OAuth providers, and protected routes pre-wired into the Express backend and perfectly typed for the frontend.',
      id: '03',
    },
    {
      title: 'Agent First',
      desc: 'Ships with AGENTS.md, rules for Cursor, and structural memory files. Built explicitly to be understood and maintained by AI.',
      id: '04',
    },
    {
      title: 'Scale Aware',
      desc: 'Three deploy paths (Vercel, Render, Railway) with Neon + Upstash, Docker API images, and post-deploy smoke via bun run test:deploy.',
      id: '05',
    },
    {
      title: 'Modular Packages',
      desc: 'The logic lives in isolated packages (auth, store, ui) so you can easily spin up mobile apps or cron workers that share code.',
      id: '06',
    },
  ]

  return (
    <section className="grid grid-cols-1 divide-y divide-zinc-800 border-y border-zinc-800 bg-black md:grid-cols-2 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
      {features.map((feat) => (
        <div
          key={feat.id}
          className="group relative overflow-hidden p-8 transition-colors hover:bg-zinc-900/50"
        >
          <div className="absolute -top-4 -right-4 text-[120px] font-black text-zinc-900 opacity-0 transition-all duration-500 select-none group-hover:opacity-50">
            {feat.id}
          </div>
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
              <span className="block size-1.5 bg-white" />
              Module / {feat.id}
            </div>
            <h3 className="mb-3 text-xl font-bold tracking-tight text-white">{feat.title}</h3>
            <p className="text-sm leading-relaxed font-medium text-zinc-400">{feat.desc}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
