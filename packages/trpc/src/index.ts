import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import type { AppRouter } from './routers/_app'
import { appRouter } from './routers/_app'
import { createCallerFactory } from './trpc'
import { createTRPCContext } from './trpc'
import { config } from './utils/config'
import { logger } from './utils/logger'
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
    config.NODE_ENV === 'development'
      ? ({ path, error }) => {
          logger.error(`[TRPC]❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`, error)
        }
      : undefined,
})

const createCaller = createCallerFactory(appRouter)

export { appRouter, expressMiddleWare, createTRPCContext, createCaller }
export type { AppRouter, RouterInputs, RouterOutputs }
