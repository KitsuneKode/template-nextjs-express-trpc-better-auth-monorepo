'use client'

import Link from 'next/link'
import type { SiteDesign } from '@/lib/site-design'
import type { Dispatch, SetStateAction } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Github } from '@template/ui/components/icons'
import { DesignToggle } from '@/components/shell/design-toggle'

interface PremiumMobileMenuProps {
  design: SiteDesign
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  links: readonly { href: string; label: string }[]
}

export function PremiumMobileMenu({
  design,
  isOpen,
  setIsOpen,
  links,
}: PremiumMobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="overflow-hidden border-b border-white/10 bg-[#0b0f14]/95 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto max-w-[1200px] space-y-2 px-4 py-5 sm:px-6">
            <div className="pb-2">
              <DesignToggle design={design} tone="premium" />
            </div>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-[#c8b7a3] transition-colors hover:bg-white/5 hover:text-[#faf5ed]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3">
              <Link
                href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.02] py-3 text-sm text-[#e5d6c4]"
              >
                <Github className="h-4 w-4" /> GitHub Repository
              </Link>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
