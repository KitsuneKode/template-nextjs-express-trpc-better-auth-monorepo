import { Button } from '@arche-template/ui/components/button'

export default function Mockup15() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05050F] font-sans text-white selection:bg-fuchsia-500/30">
      {/*
        Aesthetic: Cyber-Organic / Web3
        Focus: Moving fluid mesh gradients behind frosted glass cards. Magical, creative, fluid.
      */}

      {/* Fluid Mesh Gradient Background Elements */}
      <div className="absolute top-[-20%] -left-[10%] h-[70vw] w-[70vw] animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-fuchsia-600/20 mix-blend-screen blur-[120px]" />
      <div className="absolute -right-[10%] bottom-[-10%] h-[60vw] w-[60vw] animate-[pulse_10s_ease-in-out_infinite_reverse] rounded-full bg-cyan-600/20 mix-blend-screen blur-[120px]" />
      <div className="absolute top-[20%] left-[40%] h-[40vw] w-[40vw] animate-[pulse_12s_ease-in-out_infinite] rounded-full bg-indigo-600/20 mix-blend-screen blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pt-10 pb-32">
        {/* Glass Nav */}
        <nav className="mb-20 flex h-14 items-center justify-between rounded-full border border-white/[0.08] bg-white/[0.03] px-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="size-6 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 shadow-[0_0_15px_rgba(217,70,239,0.5)]" />
            <span className="text-[16px] font-bold tracking-wide">Arche</span>
          </div>
          <div className="hidden items-center gap-8 text-[14px] font-medium text-white/70 md:flex">
            <a href="/docs" className="drop-shadow-sm transition-colors hover:text-white">
              Ecosystem
            </a>
            <a href="/docs" className="drop-shadow-sm transition-colors hover:text-white">
              Documentation
            </a>
            <a href="/docs" className="drop-shadow-sm transition-colors hover:text-white">
              Community
            </a>
          </div>
          <Button className="h-8 rounded-full border border-white/10 bg-white/10 px-5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20">
            GitHub
          </Button>
        </nav>

        {/* Hero */}
        <section className="flex flex-col items-center text-center">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-sm font-medium text-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-xl">
            <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text font-bold text-transparent">
              New
            </span>
            <span className="mx-1 h-3 w-px bg-white/20" />
            Arche Engine v3
          </div>

          <h1 className="mb-8 max-w-5xl text-6xl leading-[1.05] font-bold tracking-tighter md:text-[88px]">
            The magical stack for <br />
            <span className="bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(217,70,239,0.3)]">
              modern creators.
            </span>
          </h1>

          <p className="mb-14 max-w-2xl text-xl leading-relaxed font-medium [text-wrap:balance] text-white/60 md:text-2xl">
            Stop wrestling with config files. A beautifully wired, fully typed monorepo that lets
            you focus purely on creating.
          </p>

          {/* Glass Terminal */}
          <div className="group relative mb-24 w-full max-w-2xl">
            <div className="absolute -inset-0.5 rounded-[24px] bg-gradient-to-r from-fuchsia-500/50 via-indigo-500/50 to-cyan-500/50 opacity-50 blur-xl transition duration-1000 group-hover:opacity-100" />
            <div className="relative flex items-center rounded-[20px] border border-white/10 bg-black/40 p-2 shadow-2xl backdrop-blur-2xl">
              <div className="flex flex-1 items-center gap-4 px-6 py-4 text-left font-mono text-[15px]">
                <span className="text-fuchsia-400">✧</span>
                <code className="text-white/90">bunx --bun arche create my-app</code>
              </div>
              <Button className="h-12 rounded-[14px] bg-white px-8 font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:bg-white/90 active:scale-95">
                Copy
              </Button>
            </div>
          </div>

          {/* Glass Cards Grid */}
          <div className="grid w-full grid-cols-1 gap-6 text-left md:grid-cols-3">
            {[
              {
                title: 'Type Telepathy',
                desc: 'Changes in your database instantly reflect in your frontend components. Complete end-to-end safety via tRPC.',
              },
              {
                title: 'Modular Magic',
                desc: 'Auth, database, and API logic separated into beautiful, isolated packages managed by Turborepo.',
              },
              {
                title: 'AI Native',
                desc: 'Arche speaks fluently to Claude and Cursor. Pre-configured AGENTS.md ensures your AI understands your architecture.',
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-[24px] border border-white/[0.05] bg-white/[0.02] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-3xl transition-colors hover:bg-white/[0.04]"
              >
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <h3 className="mb-3 text-[22px] font-bold tracking-tight text-white">
                  {feat.title}
                </h3>
                <p className="text-[15px] leading-relaxed font-medium text-white/60">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
