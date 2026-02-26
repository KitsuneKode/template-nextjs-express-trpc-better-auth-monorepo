import Link from 'next/link'
import React, { Suspense } from 'react'
import { CurrentYear } from './CurrentYear'
import { Github, Heart } from '@template/ui/components/icons'

const FOOTER_LINKS = [
  { href: '#stack', label: 'Stack' },
  { href: '#demos', label: 'Demos' },
  { href: '#quick-start', label: 'Quick Start' },
  { href: '/blog', label: 'Blog' },
]

export const Footer = () => {
  return (
    <footer className="relative mt-8 border-t border-white/12 bg-[#0a0e13] py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9ab72]/50 to-transparent" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.2em] text-[#ccb392] uppercase">
              Kitsune Stack
            </p>
            <p className="mt-3 font-serif text-2xl leading-snug text-[#f6eee3] md:text-3xl">
              Build product features, not monorepo plumbing.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#c8b9a6]">
              Built for teams who want type safety, coherent architecture, and
              polished UX from the first commit.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/12 bg-white/4 px-4 py-2 text-xs tracking-[0.14em] text-[#ddcfbc] uppercase transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/4 px-4 py-2 text-xs tracking-[0.14em] text-[#ddcfbc] uppercase transition-colors hover:bg-white/10 hover:text-white"
            >
              <Github className="h-4 w-4" /> GitHub
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-[#af9f8c]">
          <Suspense>
            © <CurrentYear /> KitsuneKode. Made with{' '}
          </Suspense>
          <Heart className="mx-1 inline-block h-4 w-4 fill-[#d9ab72] text-[#d9ab72]" />
          for serious builders.
        </div>
      </div>
    </footer>
  )
}
