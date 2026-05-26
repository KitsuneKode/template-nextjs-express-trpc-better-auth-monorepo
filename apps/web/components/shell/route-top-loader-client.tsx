'use client'

import dynamic from 'next/dynamic'

const RouteTopLoader = dynamic(
  () =>
    import('@/components/shell/route-top-loader').then((mod) => ({
      default: mod.RouteTopLoader,
    })),
  { ssr: false },
)

export function RouteTopLoaderClient() {
  return <RouteTopLoader />
}
