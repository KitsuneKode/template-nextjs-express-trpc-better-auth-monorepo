'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Check,
  Database,
  Lock,
  Zap,
} from '@template/ui/components/icons'

const STACK = [
  'Next.js 16',
  'tRPC',
  'Prisma',
  'Better Auth',
  'Upstash Redis',
  'Turborepo',
]

const KEY_POINTS = [
  'Typed end-to-end from DB to UI',
  'Web + server + worker in one repo',
  'Reusable shadcn-based UI package',
]

const HERO_COMMANDS = [
  'bun create-turbo@latest --example https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo my-app',
  'cd my-app && bun install',
  'bunx shadcn@latest add button card dialog',
  'bun dev',
]

export const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(217,171,114,0.05),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />

      <div className="container mx-auto grid min-w-0 gap-16 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#A1A1AA] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9AB72] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D9AB72]"></span>
            </span>
            Production Monorepo Foundation
          </div>

          <h1 className="font-serif text-5xl font-medium tracking-tight text-[#FAFAFA] sm:text-6xl lg:text-7xl lg:leading-[1.1]">
            Ship product logic,
            <span className="block text-[#D9AB72] italic">
              not setup scripts.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#A1A1AA] sm:text-xl">
            A full-stack starter built for teams that want real momentum: shared
            UI, typed APIs, auth wired in, database ready, and live demos you
            can trust on day one.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#quick-start"
              className="group inline-flex items-center gap-2 rounded-full bg-[#D9AB72] px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all hover:bg-[#E5BE8C] active:scale-95"
            >
              Scaffold In 5 Minutes
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#demos"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-6 py-3.5 text-sm font-medium text-[#FAFAFA] transition-colors hover:bg-white/5"
            >
              View Live Demos
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {KEY_POINTS.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="flex flex-col border-l border-white/10 pl-4"
              >
                <Check className="mb-2 h-4 w-4 text-[#5FD1C4]" />
                <p className="text-sm font-medium text-[#D4D4D8]">{point}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[600px] lg:mx-0 lg:ml-auto"
        >
          {/* Decorative glow */}
          <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-br from-[#D9AB72]/20 via-transparent to-[#5FD1C4]/20 blur-xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/90 shadow-2xl backdrop-blur-xl">
            {/* Window Header */}
            <div className="flex items-center border-b border-white/5 bg-white/[0.02] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/50" />
              </div>
              <p className="ml-4 font-mono text-xs text-[#71717A]">terminal</p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="space-y-3 font-mono text-xs sm:text-sm">
                {HERO_COMMANDS.map((line) => (
                  <div key={line} className="flex min-w-0 gap-3">
                    <span className="text-[#5FD1C4] select-none">$</span>
                    <span className="min-w-0 flex-1 break-all whitespace-pre-wrap text-[#D4D4D8]">
                      {line}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="mb-3 text-xs font-medium text-[#71717A]">
                    Core Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STACK.slice(0, 4).map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-[#A1A1AA]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="mb-3 text-xs font-medium text-[#71717A]">
                    Features
                  </p>
                  <ul className="space-y-2.5 text-xs text-[#A1A1AA]">
                    <li className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-[#D9AB72]" /> Auth
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-[#5FD1C4]" /> Real-time
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="h-3.5 w-3.5 text-[#D9AB72]" /> Prisma
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
