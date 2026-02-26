import type { Metadata } from 'next'
import { StackGrid } from '@/components/landing-premium/sections/stack-grid'
import { ArchitectureMap } from '@/components/landing-premium/sections/architecture-map'
import { SectionShell } from '@/components/landing-premium/primitives/section-shell'

export const metadata: Metadata = {
  title: 'Stack Deep Dive | Kitsune Stack Premium',
  description: 'Technical deep dive for the premium landing stack architecture.',
}

export default function LandingStackPage() {
  return (
    <>
      <SectionShell
        eyebrow="Stack Deep Dive"
        title="The implementation choices behind the template."
        description="This page maps each key subsystem to its practical role in delivery, maintainability, and team velocity."
      >
        <StackGrid />
      </SectionShell>

      <SectionShell
        id="architecture"
        eyebrow="Request + Ownership Flow"
        title="How data and responsibility move through the monorepo."
        description="This flow is designed to reduce ambiguity across frontend, backend, and shared package ownership."
      >
        <ArchitectureMap />
      </SectionShell>
    </>
  )
}
