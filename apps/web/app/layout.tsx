import { Suspense } from 'react'
import { Toaster } from 'sonner'
import '@template/ui/globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { NavbarSwitcher } from '@/components/shell/navbar-switcher'
import { RouteTopLoader } from '@/components/shell/route-top-loader'

export const metadata: Metadata = {
  metadataBase: new URL('https://template.kitsunekode.com'),
  title: {
    default: 'Next.js Monorepo Template',
    template: '%s | Next.js Monorepo Template',
  },
  description:
    'Production-ready full-stack monorepo template with Better Auth, Prisma ORM, tRPC, Next.js 15, and Upstash Redis.',
  openGraph: {
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Kitsune Stack Template social preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/twitter-image'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <RouteTopLoader />
        </Suspense>
        <Providers>
          <NavbarSwitcher />
          {children}
        </Providers>
        <Toaster theme="dark" position="bottom-right" className="font-sans" />
      </body>
    </html>
  )
}
