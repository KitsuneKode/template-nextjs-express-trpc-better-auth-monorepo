'use client'

import Link from 'next/link'
import { cn } from '@template/ui/lib/utils'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, Github, ArrowRight } from 'lucide-react'

const NAV_LINKS = [
  { href: '/blog', label: 'Blog' },
  { href: '/demo', label: 'Demos' },
  { href: '#features', label: 'Features' },
  { href: '#architecture', label: 'Architecture' },
]

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        isScrolled
          ? 'border-b border-white/10 bg-neutral-950/80 backdrop-blur-lg'
          : 'bg-transparent',
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            <span className="bg-gradient-to-r from-[var(--solar-orange)] to-[var(--solar-purple)] bg-clip-text text-transparent">
              Template
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-300 transition-colors hover:text-white"
                // onClick={(e) => {
                //   e.preventDefault();
                //   const element = document.querySelector(link.href);
                //   if (element) {
                //     element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                //   }
                // }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 transition-colors hover:text-white"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="#quick-start"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--solar-orange)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Use Template
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white md:hidden"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-white/10 bg-neutral-950/95 backdrop-blur-lg md:hidden"
          >
            <div className="container mx-auto space-y-4 px-4 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMobileMenuOpen(false)
                    //   setTimeout(() => {
                    //     const element = document.querySelector(link.href);
                    //     if (element) {
                    //       element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    //     }
                    //   }, 300);
                  }}
                  className="block py-2 text-neutral-300 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
                <Link
                  href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-neutral-300 transition-colors hover:text-white"
                >
                  <Github className="h-5 w-5" />
                  View on GitHub
                </Link>
                <Link
                  href="#quick-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--solar-orange)] px-4 py-2 text-white transition-opacity hover:opacity-90"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
