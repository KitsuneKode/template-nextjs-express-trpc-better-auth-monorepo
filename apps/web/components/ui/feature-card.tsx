'use client'

import React from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from '@template/ui/components/icons'
import { cn } from '@template/ui/lib/utils'

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  className?: string
  delay?: number
}

export const FeatureCard = ({
  title,
  description,
  icon,
  className,
  delay = 0,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10',
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
        <p className="mb-4 leading-relaxed text-neutral-400">{description}</p>

        <div className="flex -translate-x-2 items-center text-sm font-medium text-[var(--solar-teal)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          Learn more <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </motion.div>
  )
}
