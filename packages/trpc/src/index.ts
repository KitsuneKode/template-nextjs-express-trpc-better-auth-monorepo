import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import type { AppRouter } from './routers/_app'
import { createCallerFactory } from './trpc'
import { appRouter } from './routers/_app'
import { createTRPCContext } from './trpc'
import { logger } from './utils/logger'
import { config } from './utils/config'
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
    config.getConfig('nodeEnv') === 'development'
      ? ({ path, error }) => {
          logger.error(`[TRPC]❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`, error)
        }
      : undefined,
})

const createCaller = createCallerFactory(appRouter)

export { appRouter, expressMiddleWare, createTRPCContext, createCaller }
export type { AppRouter, RouterInputs, RouterOutputs }
