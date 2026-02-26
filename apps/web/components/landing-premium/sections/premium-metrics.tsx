'use client'

import { motion } from 'motion/react'
import { premiumMetrics } from './content'

export function PremiumMetrics() {
  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {premiumMetrics.map((item, index) => (
          <motion.article
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="rounded-2xl border border-white/10 bg-[#0e1319]/80 p-5"
          >
            <p className="text-xs font-semibold tracking-[0.16em] text-[#c8ad8d] uppercase">{item.label}</p>
            <p className="mt-3 font-serif text-4xl text-[#f6eee3]">{item.value}</p>
            <p className="mt-2 text-sm text-[#b7a48d]">{item.note}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
