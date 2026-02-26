import type { Metadata } from 'next'
import { DemoShowcase } from '@/components/landing-premium/sections/demo-showcase'
import { SectionShell } from '@/components/landing-premium/primitives/section-shell'

export const metadata: Metadata = {
  title: 'Functional Demos | Kitsune Stack Premium',
  description:
    'Interactive demos showcasing auth, realtime, blog, and database flows.',
}

export default function LandingDemosPage() {
  return (
    <SectionShell
      eyebrow="Functional Demos"
      title="Live proof that the baseline actually works."
      description="Explore real interaction patterns through the included mock-mode demos. These flows map directly to production concerns."
    >
      <DemoShowcase />
    </SectionShell>
  )
}
