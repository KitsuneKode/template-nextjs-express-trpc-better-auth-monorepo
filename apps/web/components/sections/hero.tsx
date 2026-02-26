'use client'

import Link from 'next/link'
import React from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Check,
  Code2,
  Database,
  Layout,
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
    <section className="relative isolate overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_18%,rgba(216,166,110,0.34),transparent_42%),radial-gradient(circle_at_84%_16%,rgba(66,168,175,0.22),transparent_38%),radial-gradient(circle_at_52%_88%,rgba(228,127,98,0.18),transparent_46%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="container mx-auto grid gap-12 px-4 md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#d9ab72]/40 bg-[#d9ab72]/10 px-4 py-2 text-xs tracking-[0.18em] text-[#f0ddc3] uppercase">
            Production Monorepo Foundation
          </div>

          <h1 className="font-serif text-4xl leading-[1.08] font-semibold text-[#fbf5ec] sm:text-5xl lg:text-7xl">
            Ship product logic,
            <span className="block text-[#d9ab72]">not setup scripts.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#d9ccb9] md:text-xl">
            A full-stack starter built for teams that want real momentum: shared
            UI, typed APIs, auth wired in, database ready, and live demos you can
            trust on day one.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#quick-start"
              className="group inline-flex items-center gap-2 rounded-full bg-[#d9ab72] px-6 py-3 text-xs font-semibold tracking-[0.14em] text-[#1f1810] uppercase transition-all hover:-translate-y-0.5 hover:brightness-110"
            >
              Scaffold In 5 Minutes
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#demos"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-semibold tracking-[0.14em] text-[#efe2cf] uppercase transition-colors hover:bg-white/10"
            >
              View Live Capabilities
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {KEY_POINTS.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-[#12171d]/65 px-4 py-4"
              >
                <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#5fd1c4]/18 text-[#5fd1c4]">
                  <Check className="h-4 w-4" />
                </span>
                <p className="text-sm leading-relaxed text-[#e4d9c8]">{point}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-0.5 rounded-[28px] bg-[linear-gradient(145deg,rgba(217,171,114,0.45),rgba(66,168,175,0.2),rgba(255,255,255,0.08))] blur-sm" />
          <div className="relative overflow-hidden rounded-[28px] border border-white/14 bg-[#0e1319]/90 p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs tracking-[0.18em] text-[#cab79f] uppercase">
                Launch Panel
              </p>
              <span className="rounded-full border border-[#5fd1c4]/35 bg-[#5fd1c4]/10 px-3 py-1 text-[11px] text-[#5fd1c4]">
                Ready-to-run
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#090d12] p-4">
              <p className="mb-3 text-[11px] tracking-[0.16em] text-[#8fa1b2] uppercase">
                Terminal Recipe
              </p>
              <div className="space-y-2 font-mono text-xs text-[#dbccbb] md:text-sm">
                {HERO_COMMANDS.map((line) => (
                  <p
                    key={line}
                    className="overflow-x-auto whitespace-nowrap rounded-md bg-white/3 px-3 py-2"
                  >
                    <span className="mr-2 text-[#5fd1c4]">$</span>
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                <p className="mb-3 text-[11px] tracking-[0.16em] text-[#8fa1b2] uppercase">
                  Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {STACK.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/12 bg-[#131921] px-2.5 py-1 text-xs text-[#ecdfce]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                <p className="mb-3 text-[11px] tracking-[0.16em] text-[#8fa1b2] uppercase">
                  Included Flows
                </p>
                <ul className="space-y-2 text-sm text-[#e5d8c6]">
                  <li className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#d9ab72]" /> Auth
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#5fd1c4]" /> Real-time demo
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-[#85d8e3]" /> Prisma data
                  </li>
                  <li className="flex items-center gap-2">
                    <Layout className="h-4 w-4 text-[#e79b78]" /> Shared UI package
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#d9ab72]/22 bg-[#d9ab72]/8 p-4">
              <p className="mb-2 text-[11px] tracking-[0.16em] text-[#e4cda8] uppercase">
                Why teams pick this
              </p>
              <p className="text-sm leading-relaxed text-[#efe4d6]">
                Replace boilerplate week with product week. You start from
                aligned conventions, production defaults, and a stack that scales
                without rewrites.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-[#f4e6d1]">
                <Code2 className="h-4 w-4" /> Crafted for shipping, not demos.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
