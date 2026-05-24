import { Button } from '@arche-template/ui/components/button'

export default function Mockup5() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] font-sans text-zinc-300 selection:bg-amber-500/30">
      {/*
        Note: The root layout.tsx NavbarSwitcher might be visible at the top. 
        This mockup is designed with a "Blueprint / Structured Grid" aesthetic.
      */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col border-r border-l border-zinc-800/50">
        {/* Decorative Grid Background */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative flex flex-col items-center border-b border-zinc-800/50 p-8 text-center md:p-16 lg:p-24">
          <div className="mb-6 flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 uppercase">
            <span className="block size-2 bg-amber-500" />
            Arche Architecture
          </div>

          <h1 className="mb-8 text-5xl leading-[1.05] font-medium tracking-tight text-zinc-100 md:text-7xl lg:text-[5.5rem]">
            The foundation of <br />
            <span className="text-zinc-500">modern software.</span>
          </h1>

          <p className="mb-12 max-w-2xl text-lg leading-relaxed text-balance text-zinc-400 md:text-xl">
            A precisely engineered TypeScript monorepo. Database, authentication, API, and frontend
            components systematically wired together.
          </p>

          <div className="group flex w-full max-w-2xl flex-col items-stretch gap-0 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 border border-zinc-800 bg-black/50 p-4 text-left font-mono text-sm transition-colors group-hover:border-zinc-700">
              <span className="text-amber-500">~</span>
              <code className="text-zinc-300">bunx --bun arche create my-app</code>
            </div>
            <Button className="h-[54px] rounded-none border-y border-r border-zinc-100 bg-zinc-100 px-8 font-medium text-zinc-900 transition-colors group-hover:border-amber-500 hover:bg-amber-500">
              Initialize
            </Button>
          </div>
        </div>

        <div className="relative border-b border-zinc-800/50 p-8">
          <div className="flex flex-wrap justify-center gap-8 font-mono text-sm tracking-wider text-zinc-500 uppercase">
            {['Monorepo', 'Better Auth', 'tRPC', 'Prisma', 'Next.js', 'Docker'].map((tech) => (
              <div key={tech} className="flex items-center gap-2">
                <span className="text-zinc-800">+</span>
                {tech}
              </div>
            ))}
          </div>
        </div>

        <div className="relative grid flex-1 grid-cols-1 divide-y divide-zinc-800/50 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3">
          {[
            {
              id: '01',
              title: 'Modular Design',
              desc: 'Pick a family. Answer 5 prompts. Get a working monorepo in seconds.',
            },
            {
              id: '02',
              title: 'Extensible Core',
              desc: 'Add realtime WebSocket, AI bundles, analytics, or S3 storage post-scaffold.',
            },
            {
              id: '03',
              title: 'Absolute Safety',
              desc: 'End-to-end types from database schema through tRPC to your frontend.',
            },
          ].map((feat) => (
            <div
              key={feat.id}
              className="flex flex-col p-8 transition-colors hover:bg-zinc-900/20 md:p-12"
            >
              <span className="mb-6 block font-mono text-xs text-amber-500">{feat.id}</span>
              <h3 className="mb-3 text-xl font-medium text-zinc-100">{feat.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{feat.desc}</p>
              <div className="mt-auto pt-12">
                <div className="h-px w-full bg-gradient-to-r from-zinc-800 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
