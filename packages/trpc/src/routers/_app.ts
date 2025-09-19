import { createTRPCRouter } from '../trpc'
import { userRouter } from './user'
import { authRouter } from './auth'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
