import 'server-only' // <-- ensure this file cannot be imported from the client
import config from '@/utils/config'
import React, { cache } from 'react'
import { SuperJSON } from 'superjson'
import { headers } from 'next/headers'
import { auth } from '@template/auth/server'
import { createCaller } from '@template/trpc'
import { prisma as db } from '@template/store'
import type { AppRouter } from '@template/trpc'
import { makeQueryClient } from './query-client'
import { createTRPCClient, httpLink } from '@trpc/client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import {
  createTRPCOptionsProxy,
  TRPCQueryOptions,
} from '@trpc/tanstack-react-query'

export const getQueryClient = cache(makeQueryClient)

export const trpcCaller = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return createCaller({ session, db })
})

function getUrl() {
  const base = (() => {
    // if (typeof window !== 'undefined') return ''
    return config.getConfig('apiBaseUrl')
  })()
  return `${base}/api/trpc`
}

export const trpc = createTRPCOptionsProxy({
  client: createTRPCClient<AppRouter>({
    links: [httpLink({ url: getUrl(), transformer: SuperJSON })],
  }),
  queryClient: getQueryClient,
})

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient()
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void queryClient.prefetchInfiniteQuery(queryOptions as any)
  } else {
    void queryClient.prefetchQuery(queryOptions)
  }
}
