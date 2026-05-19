import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import '@template/ui/globals.css'
import { Providers } from '@/components/providers'
import { RouteTopLoader } from '@/components/shell/route-top-loader'
import { env } from '@/env'

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Arche — The beginning of every project',
    template: '%s | Arche',
  },
  description:
    'Full-stack TypeScript monorepo template. One command to auth, database, API, and frontend. Built with Next.js, Express, Better Auth, Prisma, and tRPC.',
  openGraph: {
    images: [{ url: '/brand/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/brand/og-image.png'],
  },
  robots: { index: true, follow: true },
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
        <Providers>{children}</Providers>
        <Toaster theme="dark" position="bottom-right" className="font-sans" />
      </body>
    </html>
  )
}
