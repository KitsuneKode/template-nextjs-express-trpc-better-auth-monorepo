'use client'

import React from 'react'
import { motion } from 'motion/react'
import { features } from '@/lib/demo-data'
import { SectionWrapper } from '../ui/section-wrapper'

export const Features = () => {
  return (
    <SectionWrapper id="stack" className="pt-14 pb-10">
      <div className="mb-12 max-w-3xl">
        <p className="mb-3 text-xs tracking-[0.2em] text-[#ccb392] uppercase">
          Technology Stack
        </p>
        <h2 className="font-serif text-3xl leading-tight text-[#f8f0e4] md:text-5xl">
          Opinionated choices that keep velocity high after month twelve.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-[#cfbfaa] md:text-lg">
          Every layer is pre-wired for real product work. No toy architecture,
          no “starter” compromises, no disconnected package decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-white/12 bg-[#10161d]/82 p-6"
            style={{
              ['--feature-color' as string]: feature.color,
            }}
          >
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(circle at 84% 12%, color-mix(in srgb, var(--feature-color) 24%, transparent), transparent 42%)',
              }}
            />
            <div
              className="absolute -top-12 -right-10 h-24 w-24 rounded-full blur-2xl"
              style={{
                backgroundColor: 'var(--feature-color)',
                opacity: 0.2,
              }}
            />

            <div className="relative z-10">
              <div
                className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12"
                style={{
                  color: feature.color,
                  background: `color-mix(in srgb, ${feature.color} 14%, #10161d)`,
                }}
              >
                <feature.icon className="h-5 w-5" />
              </div>

              <h3 className="mb-2 text-xl font-semibold text-[#f8f2e8]">
                {feature.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-[#cfc0ad]">
                {feature.description}
              </p>

              <pre className="overflow-x-auto rounded-xl border border-white/8 bg-[#0a0e13] p-3 text-xs leading-relaxed text-[#a8b8c8]">
                <code>{feature.code}</code>
              </pre>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  )
}
