import { Badge } from '@arche-template/ui/components/badge'
import { Button } from '@arche-template/ui/components/button'

export default function Mockup9() {
  return (
    <main className="min-h-screen bg-[#050505] pb-24 font-sans text-zinc-300 selection:bg-amber-500/30">
      {/*
        Aesthetic: Bento Architecture
        Focus: Showing off the stack modules in a beautiful grid.
      */}

      {/* Top Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-amber-500">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-semibold tracking-wide text-white">ARCHE</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
            <a href="/docs" className="transition-colors hover:text-white">
              Stack
            </a>
            <a href="/docs" className="transition-colors hover:text-white">
              Documentation
            </a>
            <Button
              variant="outline"
              className="h-8 rounded-full border-white/10 bg-transparent px-4 text-white hover:bg-white/5"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto flex max-w-[1400px] flex-col items-center px-6 pt-32 pb-16 text-center">
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />

        <Badge className="mb-8 rounded-full border-0 bg-amber-500/10 px-4 py-1.5 text-amber-400 backdrop-blur-md hover:bg-amber-500/20">
          Arche CLI v3 is now live
        </Badge>

        <h1 className="mb-6 max-w-4xl text-5xl leading-[1.1] font-bold tracking-tight text-white md:text-[5rem]">
          The ultimate monorepo <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            engine for scale.
          </span>
        </h1>

        <p className="mb-12 max-w-2xl text-xl font-medium text-zinc-400">
          Stop configuring Webpack, Prisma, and tRPC. Run one command and start building your
          product immediately.
        </p>

        <div className="mb-20 flex items-center rounded-full border border-white/10 bg-white/5 p-1.5 pl-6 shadow-2xl backdrop-blur-md">
          <code className="mr-6 font-mono text-white">bunx --bun arche create</code>
          <Button className="h-10 rounded-full bg-amber-500 px-6 font-semibold text-black shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:bg-amber-400">
            Copy
          </Button>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="mx-auto max-w-[1400px] px-6">
        <div className="grid auto-rows-[240px] grid-cols-1 gap-4 md:grid-cols-4">
          {/* Card 1: Large */}
          <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04] md:col-span-2 md:row-span-2">
            <div className="absolute top-0 right-0 h-full w-full bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <h3 className="z-10 mb-2 text-2xl font-semibold text-white">End-to-End Type Safety</h3>
            <p className="z-10 mb-8 max-w-md text-zinc-400">
              From your Postgres database to your React components, tRPC ensures you never guess a
              type again.
            </p>

            <div className="z-10 mt-auto rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-sm text-zinc-300 shadow-inner">
              <span className="text-pink-400">const</span>{' '}
              <span className="text-blue-400">user</span> ={' '}
              <span className="text-pink-400">await</span> trpc.user.get.
              <span className="text-amber-300">useQuery</span>();
              <br />
              <span className="mt-2 block text-zinc-500">{`// user.email is strongly typed from Prisma`}</span>
            </div>
          </div>

          {/* Card 2: Small */}
          <div className="group flex flex-col justify-between rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04] md:col-span-1 md:row-span-1">
            <h3 className="text-xl font-semibold text-white">Better Auth</h3>
            <p className="text-sm text-zinc-400">
              Pre-configured OAuth, sessions, and protected routes out of the box.
            </p>
          </div>

          {/* Card 3: Small */}
          <div className="group flex flex-col justify-between rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04] md:col-span-1 md:row-span-1">
            <h3 className="text-xl font-semibold text-white">Docker Ready</h3>
            <p className="text-sm text-zinc-400">
              Generated Docker Compose and Nginx configs for immediate deployment.
            </p>
          </div>

          {/* Card 4: Medium Wide */}
          <div className="group relative flex flex-col justify-center overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04] md:col-span-2 md:row-span-1">
            <div className="transition-duration-700 absolute top-0 right-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_right,rgba(245,158,11,0.1),transparent)] opacity-0 group-hover:opacity-100" />
            <div className="z-10 mb-4 flex items-center gap-4">
              <Badge
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-amber-400"
              >
                AGENTS.md
              </Badge>
              <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400">
                CLAUDE.md
              </Badge>
            </div>
            <h3 className="z-10 mb-2 text-xl font-semibold text-white">Agent-First Architecture</h3>
            <p className="z-10 max-w-sm text-sm text-zinc-400">
              Arche ships with rules for Cursor, Claude, and Gemini so your AI always knows the
              stack.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
