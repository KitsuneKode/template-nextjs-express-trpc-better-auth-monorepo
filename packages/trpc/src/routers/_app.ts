import { createTRPCRouter, publicProcedure } from '../trpc'
import { userRouter } from './user'
import { authRouter } from './auth'
import { postRouter } from './post'
import { chatRouter } from './chat'
import { z } from 'zod'

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
