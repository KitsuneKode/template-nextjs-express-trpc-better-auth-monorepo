'use client'

import React from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Code2,
  Database,
  Layout,
  Lock,
  MessageSquare,
  Zap,
} from '@template/ui/components/icons'
import { SectionWrapper } from '../ui/section-wrapper'

const PACKAGES = [
  { name: 'apps/web', role: 'Next.js UI + app router', icon: Layout },
  { name: 'apps/server', role: 'Express + tRPC handlers', icon: Zap },
  { name: 'apps/worker', role: 'Background jobs + queues', icon: MessageSquare },
  { name: 'packages/ui', role: 'shadcn-based shared design system', icon: Code2 },
  { name: 'packages/store', role: 'Prisma client + schema', icon: Database },
  { name: 'packages/auth', role: 'Better Auth config + client', icon: Lock },
]

const FLOW = [
  'User interacts with web app components from packages/ui.',
  'Typed procedures call server routers through tRPC.',
  'Server reads/writes via Prisma and shared store package.',
  'Realtime updates and async jobs fan out through worker + Redis.',
]

export const Architecture = () => {
  return (
    <SectionWrapper id="architecture" className="pt-10 pb-20">
      <div className="mb-10 max-w-3xl">
        <p className="mb-3 text-xs tracking-[0.2em] text-[#ccb392] uppercase">
          Architecture
        </p>
        <h2 className="font-serif text-3xl leading-tight text-[#f7efe3] md:text-5xl">
          A monorepo layout your team can reason about quickly.
        </h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-white/12 bg-[#10161d]/84 p-6">
          <p className="mb-4 text-xs tracking-[0.16em] text-[#ccb392] uppercase">
            Workspace Map
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {PACKAGES.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-2xl border border-white/10 bg-[#0d1218] p-4"
              >
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#f4eadc]">
                  <item.icon className="h-4 w-4 text-[#d9ab72]" />
                  {item.name}
                </div>
                <p className="text-sm leading-relaxed text-[#c8b8a4]">{item.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/12 bg-[#10161d]/84 p-6">
          <p className="mb-4 text-xs tracking-[0.16em] text-[#ccb392] uppercase">
            Request Flow
          </p>
          <ol className="space-y-3">
            {FLOW.map((step, index) => (
              <li
                key={step}
                className="rounded-2xl border border-white/10 bg-[#0d1218] p-4"
              >
                <div className="mb-2 flex items-center gap-2 text-xs tracking-[0.14em] text-[#d9ab72] uppercase">
                  Step {index + 1}
                  {index < FLOW.length - 1 && <ArrowRight className="h-3 w-3" />}
                </div>
                <p className="text-sm leading-relaxed text-[#d6c7b5]">{step}</p>
              </li>
            ))}
          </ol>

          <div className="mt-4 rounded-2xl border border-[#5fd1c4]/25 bg-[#5fd1c4]/10 p-4 text-sm text-[#d6e9e5]">
            One repo, shared types, and consistent conventions means onboarding
            new developers is predictable instead of tribal.
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
