'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@arche-template/ui/lib/utils'

import { BrandMark } from '@/components/arche/brand-mark'

const links = [
  { href: '/families', label: 'Families' },
  { href: '/docs', label: 'Docs' },
  { href: '/examples', label: 'Examples' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-50 border-b border-zinc-800 bg-black/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between border-r border-l border-zinc-800 px-6">
        <Link
          href="/"
          transitionTypes={['route-soft']}
          className="flex min-h-10 items-center gap-4 text-sm font-bold tracking-tight uppercase transition-[opacity] duration-150 hover:opacity-80"
        >
          <BrandMark size={28} className="text-white" />
          ARCHE
        </Link>
        <div className="hidden items-center gap-6 text-[11px] font-bold tracking-[0.15em] uppercase lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              transitionTypes={['route-soft']}
              className={cn(
                'inline-flex min-h-10 items-center px-2 transition-[background-color,color] duration-150 ease-out active:scale-[0.96]',
                pathname.startsWith(link.href)
                  ? 'bg-white text-black'
                  : 'text-zinc-500 hover:text-white',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <a
          href="https://github.com/KitsuneKode/arche"
          className="inline-flex min-h-10 items-center text-xs font-bold tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
        >
          GitHub ↗
        </a>
      </nav>
    </div>
  )
}
