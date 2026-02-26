import { Toaster } from 'sonner'
import '@template/ui/globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { NavbarSwitcher } from '@/components/shell/navbar-switcher'

export const metadata: Metadata = {
  metadataBase: new URL('https://template.kitsunekode.com'),
  title: {
    default: 'Next.js Monorepo Template',
    template: '%s | Next.js Monorepo Template',
  },
  description:
    'Production-ready full-stack monorepo template with Better Auth, Prisma ORM, tRPC, Next.js 15, and Upstash Redis.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <NavbarSwitcher />
          {children}
        </Providers>
        <Toaster theme="dark" position="bottom-right" className="font-sans" />
      </body>
    </html>
  )
}
