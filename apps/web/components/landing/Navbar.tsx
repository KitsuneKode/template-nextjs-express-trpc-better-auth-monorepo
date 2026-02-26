'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@template/ui/lib/utils'
import React, { useEffect, useState } from 'react'
import type { SiteDesign } from '@/lib/site-design'
import { motion, AnimatePresence } from 'motion/react'
import { DesignToggle } from '@/components/shell/design-toggle'
import { ArrowRight, Github, Menu, X } from '@template/ui/components/icons'
import { LinkPendingIndicator } from '@/components/shell/link-pending-indicator'

const NAV_LINKS = [
  { href: '#stack', label: 'Stack' },
  { href: '#demos', label: 'Demos' },
  { href: '#quick-start', label: 'Quick Start' },
  { href: '#architecture', label: 'Architecture' },
  { href: '/blog', label: 'Blog' },
]

interface NavbarProps {
  design: SiteDesign
}

export const Navbar = ({ design }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        isScrolled
          ? 'border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-widest text-[#FAFAFA] uppercase"
          >
            <Image
              src="/brand/template-mark.svg"
              alt="Kitsune Stack logo"
              width={22}
              height={22}
              className="rounded-md"
              priority
            />
            Kitsune Stack
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium tracking-wide text-[#A1A1AA] uppercase transition-colors hover:text-[#FAFAFA]"
              >
                <span className="inline-flex items-center">
                  {link.label}
                  <LinkPendingIndicator />
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <DesignToggle design={design} />
            <Link
              href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-[#A1A1AA] transition-colors hover:bg-white/[0.05] hover:text-[#FAFAFA]"
              aria-label="GitHub Repository"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              href="#quick-start"
              className="group inline-flex items-center gap-2 rounded-full bg-[#D9AB72] px-5 py-2 text-xs font-semibold tracking-wide text-[#0A0A0A] uppercase transition-all hover:bg-[#E5BE8C] active:scale-95"
            >
              Start Project
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-[#A1A1AA] hover:bg-white/5 hover:text-[#FAFAFA] lg:hidden"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container mx-auto space-y-2 px-4 py-6 sm:px-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-[#A1A1AA] transition-colors hover:bg-white/5 hover:text-[#FAFAFA]"
                >
                  <span className="inline-flex items-center">
                    {link.label}
                    <LinkPendingIndicator />
                  </span>
                </Link>
              ))}
              <div className="pt-2">
                <DesignToggle design={design} className="w-fit" />
              </div>
              <div className="mt-6 border-t border-white/5 pt-6">
                <Link
                  href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] py-3 text-sm font-medium text-[#FAFAFA]"
                >
                  <Github className="h-4 w-4" /> View Repository
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
