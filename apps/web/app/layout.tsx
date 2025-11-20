import '@template/ui/globals.css'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/landing/Navbar'
import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL('https://template.kitsunekode.com'),
  title: {
    default: "Next.js Monorepo Template",
    template: "%s | Next.js Monorepo Template"
  },
  description: "Production-ready full-stack monorepo template with Better Auth, Prisma ORM, tRPC, Next.js 15, and Upstash Redis.",
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
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
