'use client'

import { useLinkStatus } from 'next/link'
import { cn } from '@template/ui/lib/utils'
import { Loader2 } from '@template/ui/components/icons'

interface LinkPendingIndicatorProps {
  tone?: 'default' | 'premium'
}

export function LinkPendingIndicator({
  tone = 'default',
}: LinkPendingIndicatorProps) {
  const { pending } = useLinkStatus()

  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex w-0 items-center justify-center overflow-hidden opacity-0 transition-[width,opacity,margin] duration-200',
        pending && 'ml-1.5 w-3 opacity-100',
      )}
    >
      <Loader2
        className={cn(
          'h-3 w-3 animate-spin',
          tone === 'premium' ? 'text-[#67c8ba]' : 'text-[#5FD1C4]',
        )}
      />
    </span>
  )
}
