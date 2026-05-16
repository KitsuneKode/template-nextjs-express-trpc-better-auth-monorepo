'use client'

import { useEffect, useState } from 'react'

/**
 * Cookie consent banner component
 *
 * GDPR-compliant cookie consent banner.
 * Stores user preference in localStorage under `cookieConsent`.
 */
export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 text-white p-4 border-t border-neutral-700">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            We use cookies to enhance your browsing experience and analyze traffic.
            By continuing, you accept our{' '}
            <a href="/privacy" className="underline hover:text-neutral-300">
              privacy policy
            </a>
            .
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm border border-neutral-600 rounded hover:bg-neutral-800 transition"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
