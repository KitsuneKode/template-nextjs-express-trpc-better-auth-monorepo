import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { config } from '@template/backend-common/config'
import type { AppRouter } from './routers/_app'
import { createCallerFactory } from './trpc'
import { appRouter } from './routers/_app'
import { createTRPCContext } from './trpc'
/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>

const expressMiddleWare = createExpressMiddleware({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    config.getConfig('environment') === 'development'
      ? ({ path, error }) => {
          console.error(`[TRPC]❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`)
        }
      : undefined,
})

const createCaller = createCallerFactory(appRouter)

export { appRouter, expressMiddleWare, createTRPCContext, createCaller }
export type { AppRouter, RouterInputs, RouterOutputs }
