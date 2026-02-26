import Link from 'next/link'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Hero } from '@/components/sections/hero'
import { Footer } from '@/components/landing/Footer'
import { Metrics } from '@/components/sections/metrics'
import { Features } from '@/components/sections/features'
import { ArrowRight } from '@template/ui/components/icons'
import { LiveDemos } from '@/components/sections/live-demos'
import { QuickStart } from '@/components/sections/quick-start'
import { Architecture } from '@/components/sections/architecture'
import { PremiumHero } from '@/components/landing-premium/hero/premium-hero'
import { ProofTabs } from '@/components/landing-premium/sections/proof-tabs'
import { StackGrid } from '@/components/landing-premium/sections/stack-grid'
import { resolveSiteDesign, SITE_DESIGN_COOKIE_NAME } from '@/lib/site-design'
import { SectionShell } from '@/components/landing-premium/primitives/section-shell'
import { PremiumMetrics } from '@/components/landing-premium/sections/premium-metrics'
import { ArchitectureMap } from '@/components/landing-premium/sections/architecture-map'
import { PremiumSiteShell } from '@/components/landing-premium/primitives/premium-site-shell'
import { QuickStartTimeline } from '@/components/landing-premium/sections/quickstart-timeline'

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
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Kitsune Stack Template social preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Monorepo Template',
    description:
      'Production-ready full-stack monorepo template with Better Auth, Prisma, and tRPC.',
    images: ['/twitter-image'],
  },
}

export default async function Page() {
  const cookieStore = await cookies()
  const design = resolveSiteDesign(
    cookieStore.get(SITE_DESIGN_COOKIE_NAME)?.value,
  )

  if (design === 'design2') {
    return (
      <PremiumSiteShell>
        <PremiumHero startHref="/#quick-start" demosHref="/demo" />
        <PremiumMetrics />

        <SectionShell
          id="stack"
          eyebrow="Technology Stack"
          title="Opinionated engineering choices, intentionally integrated."
          description="Every layer is wired to reduce long-term integration debt: typed boundaries, shared UI primitives, and stable operational defaults."
        >
          <StackGrid />
        </SectionShell>

        <SectionShell
          id="proof"
          eyebrow="Functional Proof"
          title="Proof of capability before your first custom feature."
          description="The baseline includes working patterns you can evaluate immediately: authentication, API contracts, data persistence, and realtime support."
        >
          <ProofTabs />
          <div className="mt-6">
            <Link
              href="/demo"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/3 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-[#e5d5c0] uppercase transition-colors hover:bg-white/8"
            >
              Open full demos page
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </SectionShell>

        <SectionShell
          id="quick-start"
          eyebrow="Quick Start"
          title="From clone to shipping without ceremony."
          description="Use the same onboarding flow your team will follow in real projects, including shared shadcn component setup in packages/ui."
        >
          <QuickStartTimeline />
        </SectionShell>

        <SectionShell
          id="architecture"
          eyebrow="Architecture"
          title="Monorepo topology built for clear ownership boundaries."
          description="Apps and packages are split by responsibility so teams can scale scope without coupling every delivery stream."
          className="pb-12"
        >
          <ArchitectureMap />
        </SectionShell>
      </PremiumSiteShell>
    )
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#0A0A0A] text-[#EDEDED] selection:bg-[#D9AB72]/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 flex justify-center">
        <div className="absolute top-[-20%] h-150 w-150 rounded-full bg-[#D9AB72]/3 blur-[120px]" />
      </div>

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
