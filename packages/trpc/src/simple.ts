import z from 'zod'
import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { createExpressMiddleware } from '@trpc/server/adapters/express'

const createTRPCContext = async ({
  req: _req,
  res: _res,
}: trpcExpress.CreateExpressContextOptions) => {
  return { userId: 'user_123' }
}
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.

type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
})
// Base router and procedure helpers
const createTRPCRouter = t.router
const baseProcedure = t.procedure

const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      }
    }),
})
// export type definition of API

const expressMiddleWareSimple = createExpressMiddleware({
  router: appRouter,
  createContext: createTRPCContext,
})

export { expressMiddleWareSimple, appRouter, createTRPCContext }
export type AppRouter = typeof appRouter
