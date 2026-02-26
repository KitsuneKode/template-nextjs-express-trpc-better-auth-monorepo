'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@template/ui/lib/utils'
import { useEffect, useState, useTransition } from 'react'
import {
  SITE_DESIGN_COOKIE_NAME,
  SiteDesign,
  toSiteDesignCookieValue,
} from '@/lib/site-design'

interface DesignToggleProps {
  design: SiteDesign
  tone?: 'classic' | 'premium'
  className?: string
}

const labels = {
  design1: 'Design 1',
  design2: 'Design 2',
} as const

export function DesignToggle({
  design,
  tone = 'classic',
  className,
}: DesignToggleProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeDesign, setActiveDesign] = useState<SiteDesign>(design)

  useEffect(() => {
    setActiveDesign(design)
  }, [design])

  const setDesign = (nextDesign: SiteDesign) => {
    if (nextDesign === activeDesign) {
      return
    }

    setActiveDesign(nextDesign)
    document.cookie = `${SITE_DESIGN_COOKIE_NAME}=${toSiteDesignCookieValue(nextDesign)}; path=/; max-age=31536000; samesite=lax`
    window.dispatchEvent(new Event('site-design-change'))
    toast.success(`Switched to ${labels[nextDesign]}`)

    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border p-1',
        tone === 'premium'
          ? 'border-white/15 bg-white/[0.03]'
          : 'border-white/10 bg-white/[0.02]',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setDesign('design1')}
        disabled={isPending}
        className={cn(
          'rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors',
          activeDesign === 'design1'
            ? tone === 'premium'
              ? 'bg-[#d7ae7f] text-[#1a130c]'
              : 'bg-[#D9AB72] text-[#0A0A0A]'
            : tone === 'premium'
              ? 'text-[#bea98f] hover:text-[#f2e8dc]'
              : 'text-[#A1A1AA] hover:text-[#FAFAFA]',
        )}
      >
        D1
      </button>
      <button
        type="button"
        onClick={() => setDesign('design2')}
        disabled={isPending}
        className={cn(
          'rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors',
          activeDesign === 'design2'
            ? tone === 'premium'
              ? 'bg-[#67c8ba] text-[#0f171d]'
              : 'bg-[#67c8ba] text-[#0f171d]'
            : tone === 'premium'
              ? 'text-[#bea98f] hover:text-[#f2e8dc]'
              : 'text-[#A1A1AA] hover:text-[#FAFAFA]',
        )}
      >
        D2
      </button>
    </div>
  )
}
