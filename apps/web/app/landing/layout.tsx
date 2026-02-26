import type { ReactNode } from 'react'
import { PremiumFooter } from '@/components/landing-premium/footer/premium-footer'
import { NoiseOverlay } from '@/components/landing-premium/primitives/noise-overlay'

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080c11] text-[#f4ecdf] selection:bg-[#d7ae7f]/35 selection:text-white">
      <NoiseOverlay />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(215,174,127,0.14),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(102,200,186,0.12),transparent_36%),radial-gradient(circle_at_50%_88%,rgba(129,154,187,0.1),transparent_46%)]" />
      <main className="pt-16 lg:pt-20">{children}</main>
      <PremiumFooter />
    </div>
  )
}
