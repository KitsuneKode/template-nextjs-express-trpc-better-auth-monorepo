'use client'

import React from 'react'
import { motion } from 'motion/react'
import { SectionWrapper } from '../ui/section-wrapper'
import {
  Code2,
  Database,
  Layout,
  Lock,
  MessageSquare,
  Zap,
} from '@template/ui/components/icons'

const PACKAGES = [
  { name: 'apps/web', role: 'Next.js UI + app router', icon: Layout },
  { name: 'apps/server', role: 'Express + tRPC handlers', icon: Zap },
  {
    name: 'apps/worker',
    role: 'Background jobs + queues',
    icon: MessageSquare,
  },
  {
    name: 'packages/ui',
    role: 'shadcn-based shared design system',
    icon: Code2,
  },
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
    <SectionWrapper id="architecture" className="py-24 sm:py-32">
      <div className="mb-16 max-w-3xl">
        <p className="mb-4 text-xs font-semibold tracking-widest text-[#D9AB72] uppercase">
          Architecture
        </p>
        <h2 className="font-serif text-4xl font-medium tracking-tight text-[#FAFAFA] sm:text-5xl">
          A monorepo layout your team can reason about quickly.
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:p-8">
          <p className="mb-6 text-xs font-semibold tracking-widest text-[#A1A1AA] uppercase">
            Workspace Map
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {PACKAGES.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex flex-col rounded-xl border border-white/5 bg-[#0A0A0A] p-4 ring-1 ring-white/5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#D9AB72]">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-[#FAFAFA]">
                    {item.name}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#A1A1AA]">
                  {item.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:p-8">
          <p className="mb-6 text-xs font-semibold tracking-widest text-[#A1A1AA] uppercase">
            Request Flow
          </p>
          <ol className="flex-1 space-y-4">
            {FLOW.map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-4 rounded-xl border border-white/5 bg-[#0A0A0A] p-4 ring-1 ring-white/5"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9AB72]/10 text-xs font-semibold text-[#D9AB72]">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed text-[#D4D4D8]">{step}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-xl border border-[#5FD1C4]/20 bg-[#5FD1C4]/[0.05] p-5 text-sm leading-relaxed text-[#A1A1AA]">
            <span className="font-medium text-[#FAFAFA]">
              Predictable onboarding:
            </span>{' '}
            One repo, shared types, and consistent conventions means onboarding
            new developers is predictable instead of tribal.
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
