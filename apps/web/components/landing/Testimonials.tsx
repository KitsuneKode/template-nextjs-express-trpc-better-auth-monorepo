'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, Quote } from '@template/ui/components/icons'

const testimonials = [
  {
    quote:
      'This template saved me weeks of setup time. The monorepo structure is exactly what I needed for my scaling startup.',
    author: 'Sarah Chen',
    role: 'CTO at TechFlow',
    avatar: 'SC',
    color: 'bg-emerald-500',
  },
  {
    quote:
      "The integration of tRPC and Prisma is flawless. It's the most productive stack I've ever used.",
    author: 'Michael Ross',
    role: 'Senior Engineer',
    avatar: 'MR',
    color: 'bg-blue-500',
  },
  {
    quote:
      "Finally, a starter kit that doesn't feel bloated but has everything you actually need. The UI components are top-notch.",
    author: 'Jessica Lee',
    role: 'Frontend Lead',
    avatar: 'JL',
    color: 'bg-purple-500',
  },
]

export const Testimonials = () => {
  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative bg-neutral-950 py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            Loved by Developers
          </h2>
          <p className="text-lg text-neutral-400">
            Don't just take our word for it.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-neutral-800/20">
            <Quote size={120} />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/30 p-8 backdrop-blur-sm md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <p className="mb-8 text-xl leading-relaxed font-medium text-neutral-200 md:text-2xl">
                  "{testimonials?.[current]?.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-white ${testimonials?.[current]?.color}`}
                  >
                    {testimonials?.[current]?.avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">
                      {testimonials?.[current]?.author}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {testimonials?.[current]?.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={prev}
                className="rounded-full bg-neutral-800 p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="rounded-full bg-neutral-800 p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
