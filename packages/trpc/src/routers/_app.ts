import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { authRouter } from './auth'
import { chatRouter } from './chat'
import { postRouter } from './post'
import { userRouter } from './user'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  post: postRouter,
  chat: chatRouter,
  hello: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )

    .query(({ input }) => {
      return `Hi ${input.name} from TRPC`
    }),
})

export type AppRouter = typeof appRouter
