'use client'

import React from 'react'
import { motion } from 'motion/react'
import { features } from '@/lib/demo-data'
import { SectionWrapper } from '../ui/section-wrapper'

export const Features = () => {
  return (
    <SectionWrapper id="stack" className="py-24 sm:py-32">
      <div className="mb-16 max-w-3xl">
        <p className="mb-4 text-xs font-semibold tracking-widest text-[#D9AB72] uppercase">
          Technology Stack
        </p>
        <h2 className="font-serif text-4xl font-medium tracking-tight text-[#FAFAFA] sm:text-5xl">
          Opinionated choices that keep velocity high after month twelve.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-[#A1A1AA]">
          Every layer is pre-wired for real product work. No toy architecture,
          no “starter” compromises, no disconnected package decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]"
          >
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] text-[#D9AB72] ring-1 ring-white/10 transition-transform group-hover:scale-105 group-hover:text-white group-hover:ring-white/20">
              <feature.icon className="h-6 w-6" />
            </div>

            <h3 className="mb-3 text-xl font-medium text-[#FAFAFA]">
              {feature.title}
            </h3>
            <p className="mb-6 flex-1 text-sm leading-relaxed text-[#A1A1AA]">
              {feature.description}
            </p>

            {feature.code && (
              <div className="min-w-0 overflow-hidden rounded-lg border border-white/5 bg-[#0A0A0A] p-4">
                <pre className="font-mono text-xs leading-relaxed break-all whitespace-pre-wrap text-[#D4D4D8]">
                  <code>{feature.code}</code>
                </pre>
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  )
}
