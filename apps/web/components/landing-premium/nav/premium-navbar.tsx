'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@template/ui/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Github, Menu, X } from '@template/ui/components/icons'
import { PremiumMobileMenu } from './premium-mobile-menu'
import { DesignToggle } from '@/components/shell/design-toggle'
import type { SiteDesign, SiteDesignNamespace } from '@/lib/site-design'

interface PremiumNavbarProps {
  design: SiteDesign
  namespace: SiteDesignNamespace
}

export function PremiumNavbar({ design, namespace }: PremiumNavbarProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = useMemo(() => {
    if (namespace === 'canonical') {
      return [
        { href: '/#stack', label: 'Stack' },
        { href: '/#proof', label: 'Proof' },
        { href: '/#quick-start', label: 'Quick Start' },
        { href: '/#architecture', label: 'Architecture' },
        { href: '/blog', label: 'Blog' },
      ] as const
    }

    if (pathname === '/landing') {
      return [
        { href: '/landing#stack', label: 'Stack' },
        { href: '/landing#proof', label: 'Proof' },
        { href: '/landing#quick-start', label: 'Quick Start' },
        { href: '/landing#architecture', label: 'Architecture' },
        { href: '/landing/blog', label: 'Blog' },
      ] as const
    }

    return [
      { href: '/landing', label: 'Home' },
      { href: '/landing/stack', label: 'Stack' },
      { href: '/landing/demos', label: 'Demos' },
      { href: '/landing/start', label: 'Start' },
      { href: '/landing/blog', label: 'Blog' },
    ] as const
  }, [pathname, namespace])

  const homeHref = namespace === 'canonical' ? '/' : '/landing'
  const startHref = namespace === 'canonical' ? '/#quick-start' : '/landing/start'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isScrolled ? 'border-b border-white/12 bg-[#090d12]/90 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link
          href={homeHref}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-[#f0e4d6] uppercase"
        >
          <span className="h-2 w-2 rounded-full bg-[#d7ae7f] shadow-[0_0_14px_#d7ae7f]" />
          Kitsune Stack Premium
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium tracking-[0.14em] text-[#b8a48b] uppercase transition-colors hover:text-[#f6eee4]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <DesignToggle design={design} tone="premium" />
          <Link
            href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-[#b9a589] transition-colors hover:bg-white/[0.06] hover:text-[#f9f3eb]"
          >
            <Github className="h-4 w-4" />
          </Link>
          <Link
            href={startHref}
            className="group inline-flex items-center gap-2 rounded-full bg-[#d7ae7f] px-5 py-2 text-xs font-semibold tracking-[0.14em] text-[#19130d] uppercase transition hover:brightness-110"
          >
            Start Project
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-lg p-2 text-[#c9b397] transition-colors hover:bg-white/5 hover:text-[#f5ebdf] lg:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <PremiumMobileMenu
        design={design}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        links={links}
      />
    </header>
  )
}
