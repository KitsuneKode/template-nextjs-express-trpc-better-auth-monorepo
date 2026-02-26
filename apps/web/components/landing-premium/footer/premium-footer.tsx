import Link from 'next/link'
import { Github } from '@template/ui/components/icons'
import type { SiteDesignNamespace } from '@/lib/site-design'

const landingLinks = [
  { href: '/landing', label: 'Home' },
  { href: '/landing/stack', label: 'Stack' },
  { href: '/landing/demos', label: 'Demos' },
  { href: '/landing/start', label: 'Start' },
  { href: '/landing/blog', label: 'Blog' },
] as const

const canonicalLinks = [
  { href: '/', label: 'Home' },
  { href: '/#stack', label: 'Stack' },
  { href: '/#proof', label: 'Proof' },
  { href: '/#quick-start', label: 'Quick Start' },
  { href: '/blog', label: 'Blog' },
] as const

interface PremiumFooterProps {
  namespace?: SiteDesignNamespace
}

export function PremiumFooter({ namespace = 'landing' }: PremiumFooterProps) {
  const links = namespace === 'canonical' ? canonicalLinks : landingLinks

  return (
    <footer className="relative border-t border-white/10 py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d7ae7f]/45 to-transparent" />
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#cfaf87] uppercase">Kitsune Stack Premium</p>
            <p className="mt-3 font-serif text-2xl leading-tight text-[#f5ede3] sm:text-3xl">
              Premium baseline for teams shipping real software.
            </p>
            <p className="mt-3 text-sm text-[#b9a68d]">
              Architecture, UI system, and developer workflows aligned from day one.
            </p>
          </div>
          <Link
            href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-[#ddccba] uppercase transition-colors hover:bg-white/[0.08]"
          >
            <Github className="h-4 w-4" /> GitHub
          </Link>
        </div>

        <nav className="flex flex-wrap gap-2 border-t border-white/10 pt-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs tracking-[0.12em] text-[#cdb9a0] uppercase transition-colors hover:bg-white/[0.06] hover:text-[#f2e9de]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
