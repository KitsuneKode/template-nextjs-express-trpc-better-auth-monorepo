import '@template/ui/globals.css'
import { Providers } from '@/components/providers'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-mono font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
