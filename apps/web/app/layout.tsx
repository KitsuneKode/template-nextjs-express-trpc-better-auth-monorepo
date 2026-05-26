import type { Metadata } from 'next'
import { Fira_Code, Oxanium } from 'next/font/google'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import '@arche-template/ui/globals.css'
import '@/styles/docs-prose.css'
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
    default: 'Arche — scaffold CLI & docs',
    template: '%s | Arche',
  },
  description:
    'Personal scaffolding vault for TypeScript, Rust, and Solana—with deployment notes and agent context that stays accurate.',
  openGraph: {
    title: 'Arche — scaffold CLI',
    description:
      'Generate workspaces with typed boundaries, optional Rust and Solana routes, and agent-readable project maps.',
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
      <body className="bg-black font-sans text-white antialiased">
        <Suspense fallback={null}>
          <RouteTopLoader />
        </Suspense>
        <Providers>{children}</Providers>
        <Toaster theme="dark" position="bottom-right" className="font-sans" />
      </body>
    </html>
  )
}
