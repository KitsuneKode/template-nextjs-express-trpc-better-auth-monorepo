import type { Metadata } from 'next'
import { Hero } from '@/components/sections/hero'
import { Footer } from '@/components/landing/Footer'
import { Metrics } from '@/components/sections/metrics'
import { Features } from '@/components/sections/features'
import { LiveDemos } from '@/components/sections/live-demos'
import { QuickStart } from '@/components/sections/quick-start'
import { Architecture } from '@/components/sections/architecture'

export const metadata: Metadata = {
  title: 'Next.js Monorepo Template | Better Auth + Prisma + tRPC',
  description:
    'Production-ready full-stack monorepo template with Better Auth, Prisma ORM, tRPC, Next.js 16, and Upstash Redis. Type-safe, scalable, and developer-friendly.',
  keywords: [
    'Next.js',
    'Monorepo',
    'tRPC',
    'Prisma',
    'Better Auth',
    'Turborepo',
    'TypeScript',
    'Full-Stack',
    'Template',
  ],
  authors: [{ name: 'KitsuneKode' }],
  openGraph: {
    title: 'Next.js Monorepo Template | Better Auth + Prisma + tRPC',
    description:
      'Production-ready full-stack monorepo template. Stop configuring and start shipping.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Monorepo Template',
    description:
      'Production-ready full-stack monorepo template with Better Auth, Prisma, and tRPC.',
  },
}

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#090d12] text-[#f8f0e5] selection:bg-[#d9ab72] selection:text-[#1d1812]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_12%,rgba(217,171,114,0.14),transparent_34%),radial-gradient(circle_at_86%_4%,rgba(70,178,182,0.1),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(231,133,98,0.09),transparent_42%)]" />

      <Hero />
      <Metrics />
      <Features />
      <LiveDemos mode="mock" />
      <QuickStart />
      <Architecture />
      <Footer />
    </main>
  )
}
