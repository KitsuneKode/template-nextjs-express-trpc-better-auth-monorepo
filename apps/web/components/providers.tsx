'use client'

import * as React from 'react'
import { TRPCReactProvider } from '@/trpc/client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <React.Suspense>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </React.Suspense>
    </NextThemesProvider>
  )
}
