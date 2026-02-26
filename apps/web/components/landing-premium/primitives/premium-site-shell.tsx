import type { ReactNode } from 'react'
import { cn } from '@template/ui/lib/utils'
import { NoiseOverlay } from './noise-overlay'
import type { SiteDesignNamespace } from '@/lib/site-design'
import { PremiumFooter } from '@/components/landing-premium/footer/premium-footer'

interface PremiumSiteShellProps {
  children: ReactNode
  className?: string
  withFooter?: boolean
  footerNamespace?: SiteDesignNamespace
}

export function PremiumSiteShell({
  children,
  className,
  withFooter = true,
  footerNamespace = 'canonical',
}: PremiumSiteShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080c11] text-[#f4ecdf] selection:bg-[#d7ae7f]/35 selection:text-white">
      <NoiseOverlay />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(215,174,127,0.14),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(102,200,186,0.12),transparent_36%),radial-gradient(circle_at_50%_88%,rgba(129,154,187,0.1),transparent_46%)]" />
      <main className={cn('pt-16 lg:pt-20', className)}>{children}</main>
      {withFooter ? <PremiumFooter namespace={footerNamespace} /> : null}
    </div>
  )
}
