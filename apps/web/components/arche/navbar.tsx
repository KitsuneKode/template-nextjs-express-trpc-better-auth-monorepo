'use client'

import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-50 border-b border-zinc-800 bg-black">
      <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between border-r border-l border-zinc-800 px-6">
        <a
          href="/"
          className="flex items-center gap-4 text-sm font-bold tracking-tight uppercase transition-opacity hover:opacity-80"
        >
          <div className="size-3 bg-white" />
          ARCHE
        </a>
        <div className="hidden items-center gap-6 text-[11px] font-bold tracking-[0.15em] uppercase lg:flex">
          <a
            href="/families"
            className={`px-2 py-1 transition-colors ${pathname.startsWith('/families') ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            Families
          </a>
          <a
            href="/docs"
            className={`px-2 py-1 transition-colors ${pathname.startsWith('/docs') ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            Docs
          </a>
          <a
            href="/examples"
            className={`px-2 py-1 transition-colors ${pathname.startsWith('/examples') ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            Examples
          </a>
          <a
            href="/showcase"
            className={`px-2 py-1 transition-colors ${pathname.startsWith('/showcase') ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            Showcase
          </a>
          <a
            href="/blog"
            className={`px-2 py-1 transition-colors ${pathname.startsWith('/blog') ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            Blog
          </a>
        </div>
        <a
          href="https://github.com/KitsuneKode/template-nextjs-express-trpc-bettera-auth-monorepo"
          className="text-xs font-bold tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
        >
          GitHub ↗
        </a>
      </nav>
    </div>
  )
}
