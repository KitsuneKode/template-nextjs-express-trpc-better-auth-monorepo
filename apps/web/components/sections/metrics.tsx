'use client'

import React from 'react'
import { motion } from 'motion/react'
import { SectionWrapper } from '@/components/ui/section-wrapper'

const metrics = [
  {
    label: 'App Surfaces',
    value: '3',
    detail: 'web, server, worker',
  },
  {
    label: 'Shared Packages',
    value: '8+',
    detail: 'ui, auth, trpc, store, common',
  },
  {
    label: 'Bootstrap Time',
    value: '<10m',
    detail: 'from clone to running stack',
  },
  {
    label: 'Type Coverage',
    value: '100%',
    detail: 'single TS contract across layers',
  },
]

export const Metrics = () => {
  return (
    <SectionWrapper id="metrics" className="py-20">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.article
            key={metric.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center transition-colors hover:bg-white/[0.04] sm:p-8 sm:text-left"
          >
            <p className="text-xs font-medium tracking-widest text-[#A1A1AA] uppercase">
              {metric.label}
            </p>
            <div className="mt-6">
              <p className="font-serif text-4xl font-medium tracking-tight text-[#FAFAFA] sm:text-5xl">
                {metric.value}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[#71717A] sm:text-sm">
                {metric.detail}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  )
}
