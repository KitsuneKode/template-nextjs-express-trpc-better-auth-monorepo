import { Fira_Code, Oxanium } from 'next/font/google'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import '@arche-template/ui/globals.css'
import '@/styles/docs-prose.css'
import { Providers } from '@/components/providers'
import { SiteJsonLd } from '@/components/seo/site-json-ld'
import { RouteTopLoaderClient } from '@/components/shell/route-top-loader-client'
import { buildRootLayoutMetadata } from '@/lib/seo'

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

export const metadata = buildRootLayoutMetadata()

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
        <SiteJsonLd />
        <Suspense fallback={null}>
          <RouteTopLoaderClient />
        </Suspense>
        <Providers>{children}</Providers>
        <Toaster theme="dark" position="bottom-right" className="font-sans" />
      </body>
    </html>
  )
}
