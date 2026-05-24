import { Metadata } from 'next'
import { FamilyTable } from '@/components/arche/family-table'
import { Navbar } from '@/components/arche/navbar'
import { HeroBlock, SiteFrame, SiteShell, StatusPill } from '@/components/arche/site-primitives'

export const metadata: Metadata = {
  title: 'Architecture Families',
  description: 'Compare and choose the best starter template for your next project.',
}

export default function FamiliesPage() {
  return (
    <SiteShell>
      <Navbar />

      <SiteFrame>
        <HeroBlock
          eyebrow={<StatusPill tone="muted">Preset families</StatusPill>}
          title="Pick your"
          outline="foundation."
        >
          Choose the architecture route first, then let the CLI generate only the workspaces,
          package scopes, docs, and verification hooks that belong to that route.
        </HeroBlock>

        <section className="flex-1 bg-black p-6 md:p-16">
          <FamilyTable />
        </section>
      </SiteFrame>
    </SiteShell>
  )
}
