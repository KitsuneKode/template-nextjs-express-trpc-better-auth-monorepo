import type { Metadata } from 'next'
import { Fira_Code, Oxanium } from 'next/font/google'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import '@arche-template/ui/globals.css'
import { Providers } from '@/components/providers'
import { RouteTopLoader } from '@/components/shell/route-top-loader'
import { env } from '@/env'

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Arche — The beginning of every project',
    template: '%s | Arche',
  },
  description:
    'A personal project origin system for TypeScript, Rust, Solana, workers, deployments, and agent-readable scaffolds.',
  openGraph: {
    title: 'Arche — Project origin system',
    description:
      'Scaffold serious workspaces with typed boundaries, Rust-ready services, deployment paths, and useful agent context.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${oxanium.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <RouteTopLoader />
        </Suspense>
        <Providers>{children}</Providers>
        <Toaster theme="dark" position="bottom-right" className="font-sans" />
      </body>
    </html>
  )
}
