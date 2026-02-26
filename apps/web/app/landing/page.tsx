import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from '@template/ui/components/icons'
import { PremiumHero } from '@/components/landing-premium/hero/premium-hero'
import { PremiumMetrics } from '@/components/landing-premium/sections/premium-metrics'
import { StackGrid } from '@/components/landing-premium/sections/stack-grid'
import { ProofTabs } from '@/components/landing-premium/sections/proof-tabs'
import { QuickStartTimeline } from '@/components/landing-premium/sections/quickstart-timeline'
import { ArchitectureMap } from '@/components/landing-premium/sections/architecture-map'
import { SectionShell } from '@/components/landing-premium/primitives/section-shell'

export const metadata: Metadata = {
  title: 'Premium Landing | Kitsune Stack',
  description:
    'Premium landing experience for the Next.js + Express + tRPC + Prisma template.',
}

export default function LandingPage() {
  return (
    <>
      <PremiumHero />
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
            href="/landing/demos"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-[#e5d5c0] uppercase transition-colors hover:bg-white/[0.08]"
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
    </>
  )
}
