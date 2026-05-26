'use client'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import type { ReactNode } from 'react'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

if (!convexUrl) {
  console.warn(
    'NEXT_PUBLIC_CONVEX_URL is not set. Run `bun run dev:convex` and copy .env.local values.',
  )
}

const convex = new ConvexReactClient(convexUrl ?? 'https://placeholder.convex.cloud')

export function Providers({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
