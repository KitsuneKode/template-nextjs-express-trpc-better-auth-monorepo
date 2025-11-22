'use client'

import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@template/ui/lib/utils'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export const SectionWrapper = ({
  children,
  className,
  id,
}: SectionWrapperProps) => {
  return (
    <section id={id} className={cn('relative py-24', className)}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-4 md:px-6"
      >
        {children}
      </motion.div>
    </section>
  )
}
