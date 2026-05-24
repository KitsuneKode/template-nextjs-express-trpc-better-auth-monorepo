import { Button } from '@template/ui/components/button'

export default function Mockup13() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/*
        Aesthetic: Stripe / Notion Hybrid (Hyper-Clean Light Mode)
        Focus: Ultimate trust, clarity, pure white, subtle cool-gray borders, highly saturated micro-interactions.
      */}

      {/* Super clean Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1080px] items-center justify-between px-6">
          <div className="group flex cursor-pointer items-center gap-2.5">
            <div className="size-5 rounded-[5px] bg-slate-900 shadow-sm transition-colors duration-300 group-hover:bg-amber-500"></div>
            <span className="text-[15px] font-semibold tracking-tight">Arche</span>
          </div>
          <div className="hidden items-center gap-8 text-[14px] font-medium text-slate-500 md:flex">
            <a href="/docs" className="transition-colors hover:text-slate-900">
              Products
            </a>
            <a href="/docs" className="transition-colors hover:text-slate-900">
              Documentation
            </a>
            <a href="/docs" className="transition-colors hover:text-slate-900">
              Showcase
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/docs"
              className="hidden text-[14px] font-medium text-slate-500 transition-colors hover:text-slate-900 sm:block"
            >
              GitHub
            </a>
            <Button className="h-8 rounded-full bg-slate-900 px-4 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-slate-800 active:scale-95">
              Start Building
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-[1080px] flex-col items-center px-6 pt-24 pb-20 text-center">
        <a
          href="/docs"
          className="group mb-10 inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-slate-50 px-3 py-1.5 text-[13px] font-medium text-slate-600 transition-all hover:bg-slate-100"
        >
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold tracking-wider text-amber-700 uppercase">
            New
          </span>
          Arche v3 is now available
          <svg
            className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        <h1 className="mb-6 max-w-4xl text-5xl leading-[1.05] font-bold tracking-tight [text-wrap:balance] text-slate-900 md:text-[5.5rem]">
          The foundation for <br className="hidden md:block" />
          ambitious products.
        </h1>

        <p className="mb-12 max-w-2xl text-[19px] leading-relaxed font-medium [text-wrap:pretty] text-slate-500">
          A production-ready TypeScript monorepo that wires together Next.js, Express, tRPC, and
          Prisma. Zero configuration required.
        </p>

        {/* Clean Terminal/Interactive block */}
        <div className="mb-16 flex w-full max-w-xl items-center rounded-[16px] border border-slate-200/80 bg-white p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex flex-1 items-center gap-3 rounded-[12px] bg-slate-50/50 px-4 py-3 font-mono text-[14px]">
            <span className="text-slate-300">$&gt;</span>
            <code className="text-slate-700">bunx --bun arche create my-app</code>
          </div>
          <Button className="ml-2 h-[46px] rounded-[12px] border border-slate-200 bg-white px-5 font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]">
            Copy
          </Button>
        </div>

        {/* Beautiful Bento Grid */}
        <div className="grid w-full grid-cols-1 gap-6 text-left md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-10 shadow-[0_2px_10px_rgb(0,0,0,0.02)] md:col-span-2">
            <div className="absolute top-0 right-0 -z-10 h-64 w-64 translate-x-1/4 -translate-y-1/2 rounded-full bg-amber-50 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
            <div className="mb-6 flex size-10 items-center justify-center rounded-[10px] border border-indigo-100 bg-indigo-50">
              <svg
                className="h-5 w-5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-3 text-[22px] font-semibold tracking-tight text-slate-900">
              End-to-end Type Safety
            </h3>
            <p className="max-w-md text-[16px] leading-relaxed [text-wrap:balance] text-slate-500">
              Changes to your Prisma database schema instantly propagate types through your Express
              API down to your Next.js React components via tRPC.
            </p>
          </div>

          <div className="group rounded-[24px] border border-slate-200/80 bg-white p-10 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-colors hover:border-slate-300">
            <div className="mb-6 flex size-10 items-center justify-center rounded-[10px] border border-amber-100 bg-amber-50">
              <svg
                className="h-5 w-5 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-[20px] font-semibold tracking-tight text-slate-900">
              Better Auth
            </h3>
            <p className="text-[15px] leading-relaxed text-slate-500">
              Fully configured OAuth, session management, and protected routes.
            </p>
          </div>

          <div className="group rounded-[24px] border border-slate-200/80 bg-white p-10 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-colors hover:border-slate-300">
            <div className="mb-6 flex size-10 items-center justify-center rounded-[10px] border border-emerald-100 bg-emerald-50">
              <svg
                className="h-5 w-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.713-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-[20px] font-semibold tracking-tight text-slate-900">
              AI Agent Ready
            </h3>
            <p className="text-[15px] leading-relaxed text-slate-500">
              Ships with AGENTS.md and memory files so Cursor and Claude know your stack.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[24px] bg-slate-900 p-10 shadow-lg md:col-span-2">
            <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            <h3 className="relative z-10 mb-3 text-[22px] font-semibold tracking-tight text-white">
              Monorepo Architecture
            </h3>
            <p className="relative z-10 max-w-md text-[16px] leading-relaxed text-slate-400">
              Apps stay in <code className="text-slate-300">apps/</code>, logic stays in{' '}
              <code className="text-slate-300">packages/</code>. Turborepo handles the build graph
              with perfect caching.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
