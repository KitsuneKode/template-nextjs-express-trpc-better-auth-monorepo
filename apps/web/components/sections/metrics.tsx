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
    <SectionWrapper id="metrics" className="py-16">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.article
            key={metric.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            className="rounded-3xl border border-white/12 bg-[#10161d]/84 p-5"
          >
            <p className="text-xs tracking-[0.16em] text-[#ceb89a] uppercase">
              {metric.label}
            </p>
            <p className="mt-3 font-serif text-4xl text-[#f7ede1]">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-[#cbbba7]">{metric.detail}</p>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  )
}
