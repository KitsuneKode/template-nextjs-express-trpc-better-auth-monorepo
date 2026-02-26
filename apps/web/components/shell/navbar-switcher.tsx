'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/landing/Navbar'
import { PremiumNavbar } from '@/components/landing-premium/nav/premium-navbar'
import { parseDesignFromCookieString, type SiteDesign } from '@/lib/site-design'

export function NavbarSwitcher() {
  const pathname = usePathname()
  const [activeDesign, setActiveDesign] = useState<SiteDesign>('design1')

  useEffect(() => {
    const syncDesignFromCookie = () => {
      setActiveDesign(parseDesignFromCookieString(document.cookie))
    }

    syncDesignFromCookie()
    window.addEventListener('site-design-change', syncDesignFromCookie)
    window.addEventListener('focus', syncDesignFromCookie)

    return () => {
      window.removeEventListener('site-design-change', syncDesignFromCookie)
      window.removeEventListener('focus', syncDesignFromCookie)
    }
  }, [])

  if (pathname.startsWith('/landing')) {
    return <PremiumNavbar design="design2" namespace="landing" />
  }

  if (activeDesign === 'design2') {
    return <PremiumNavbar design={activeDesign} namespace="canonical" />
  }

  return <Navbar design={activeDesign} />
}
