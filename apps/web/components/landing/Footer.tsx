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
    <footer className="relative mt-20 border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 text-sm tracking-[0.24em] text-[#FAFAFA] uppercase">
              <span className="h-2 w-2 rounded-full bg-[#D9AB72] shadow-[0_0_12px_#D9AB72]" />
              Kitsune Stack
            </div>
            <p className="mt-6 font-serif text-2xl font-medium tracking-tight text-[#FAFAFA] sm:text-3xl">
              Build product features, not monorepo plumbing.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#A1A1AA]">
              Built for teams who want type safety, coherent architecture, and
              polished UX from the first commit.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/10 bg-white/[0.02] px-5 py-2.5 text-xs font-medium tracking-wide text-[#A1A1AA] uppercase transition-colors hover:bg-white/[0.05] hover:text-[#FAFAFA]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-2.5 text-xs font-medium tracking-wide text-[#A1A1AA] uppercase transition-colors hover:bg-white/[0.05] hover:text-[#FAFAFA]"
            >
              <Github className="h-4 w-4" /> GitHub
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="text-xs text-[#71717A]">
            <Suspense>
              © <CurrentYear /> KitsuneKode. All rights reserved.
            </Suspense>
          </div>
          <div className="text-xs text-[#71717A]">
            Made with{' '}
            <Heart className="mx-1 mb-0.5 inline-block h-3 w-3 fill-[#D9AB72] text-[#D9AB72]" />
            for serious builders.
          </div>
        </div>
      </div>
    </footer>
  )
}
