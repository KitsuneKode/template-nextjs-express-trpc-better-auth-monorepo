'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, Github, Menu, X } from '@template/ui/components/icons'
import { cn } from '@template/ui/lib/utils'

const NAV_LINKS = [
  { href: '#stack', label: 'Stack' },
  { href: '#demos', label: 'Demos' },
  { href: '#quick-start', label: 'Quick Start' },
  { href: '#architecture', label: 'Architecture' },
  { href: '/blog', label: 'Blog' },
]

export const Navbar = () => {
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
          ? 'border-b border-white/12 bg-[#0b0d11]/80 backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm tracking-[0.24em] text-[#f8efe3] uppercase"
          >
            <span className="h-2 w-2 rounded-full bg-[#d9ab72] shadow-[0_0_18px_#d9ab72]" />
            Kitsune Stack
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium tracking-[0.18em] text-[#dcccb8]/80 uppercase transition-colors hover:text-[#f7efe4]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#e8d7c2] transition-colors hover:bg-white/10 hover:text-white"
              aria-label="GitHub Repository"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              href="#quick-start"
              className="group inline-flex items-center gap-2 rounded-full bg-[#d9ab72] px-5 py-2 text-xs font-semibold tracking-[0.12em] text-[#1c1713] uppercase transition-all hover:brightness-110"
            >
              Start Project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="rounded-md p-2 text-[#f8efe3] md:hidden"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-b border-white/12 bg-[#0b0d11]/95 backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto space-y-3 px-4 py-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-[#e7d7c3] transition-colors hover:bg-white/8 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 py-2.5 text-sm text-[#e8d7c2]"
              >
                <Github className="h-4 w-4" /> View Repository
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
