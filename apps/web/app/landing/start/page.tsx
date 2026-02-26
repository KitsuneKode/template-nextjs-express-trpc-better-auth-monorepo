import type { Metadata } from 'next'
import { QuickStartTimeline } from '@/components/landing-premium/sections/quickstart-timeline'
import { SectionShell } from '@/components/landing-premium/primitives/section-shell'

export const metadata: Metadata = {
  title: 'Quick Start | Kitsune Stack Premium',
  description: 'Command-first onboarding flow for the premium landing route.',
}

export default function LandingStartPage() {
  return (
    <SectionShell
      eyebrow="Quick Start"
      title="Scaffold, wire, and ship in one setup flow."
      description="Run the exact command sequence to bootstrap the template, configure scope, and add shared shadcn components."
    >
      <QuickStartTimeline />
    </SectionShell>
  )
}
