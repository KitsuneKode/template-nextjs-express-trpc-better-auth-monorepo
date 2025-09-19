import superjson from 'superjson'
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'

/**
 * Creates and returns a new QueryClient instance with custom default options.
 *
 * The returned QueryClient is configured with a 30-second stale time for queries and a custom dehydration policy that includes queries with a 'pending' status.
 * @returns A configured QueryClient instance.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
        shouldRedactErrors: () => {
          // We should not catch Next.js server errors
          // as that's how Next.js detects dynamic pages
          // so we cannot redact them.
          // Next.js also automatically redacts errors for us
          // with better digests.
          return false
        },
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  })
}
