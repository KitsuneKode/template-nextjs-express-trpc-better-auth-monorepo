import { Navbar } from '@/components/arche/navbar'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col bg-black font-sans text-white selection:bg-white selection:text-black">
      <Navbar />

      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col border-r border-l border-zinc-800 md:flex-row">
        {/* Docs Sidebar */}
        <aside className="w-full shrink-0 border-b border-zinc-800 bg-zinc-950/30 p-6 md:w-64 md:border-r md:border-b-0">
          <div className="sticky top-20">
            <div className="mb-6 flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              <span className="block size-1.5 bg-white" />
              Navigation
            </div>

            <nav className="space-y-8">
              <div>
                <h4 className="mb-3 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                  Core Concepts
                </h4>
                <ul className="space-y-2 text-sm font-medium">
                  <li>
                    <a href="/docs" className="text-zinc-300 transition-colors hover:text-white">
                      Quick Start
                    </a>
                  </li>
                  <li>
                    <a
                      href="/docs/cli"
                      className="text-zinc-300 transition-colors hover:text-white"
                    >
                      CLI Tooling
                    </a>
                  </li>
                  <li>
                    <a
                      href="/docs/architecture"
                      className="text-zinc-300 transition-colors hover:text-white"
                    >
                      Architecture
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                  Packages
                </h4>
                <ul className="space-y-2 text-sm font-medium">
                  <li>
                    <a
                      href="/docs/auth"
                      className="text-zinc-300 transition-colors hover:text-white"
                    >
                      Authentication
                    </a>
                  </li>
                  <li>
                    <a
                      href="/docs/store"
                      className="text-zinc-300 transition-colors hover:text-white"
                    >
                      Prisma Store
                    </a>
                  </li>
                  <li>
                    <a
                      href="/docs/trpc"
                      className="text-zinc-300 transition-colors hover:text-white"
                    >
                      tRPC API
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                  Operations
                </h4>
                <ul className="space-y-2 text-sm font-medium">
                  <li>
                    <a
                      href="/docs/deploy"
                      className="text-zinc-300 transition-colors hover:text-white"
                    >
                      Deployment
                    </a>
                  </li>
                  <li>
                    <a
                      href="/docs/scaling"
                      className="text-zinc-300 transition-colors hover:text-white"
                    >
                      Scaling
                    </a>
                  </li>
                  <li>
                    <a
                      href="/docs/security"
                      className="text-zinc-300 transition-colors hover:text-white"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </aside>

        {/* Docs Content Area */}
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </main>
  )
}
