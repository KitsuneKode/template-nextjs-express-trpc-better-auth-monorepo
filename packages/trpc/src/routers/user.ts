import { protectedProcedure, publicProcedure } from '../trpc'
import type { TRPCRouterRecord } from '@trpc/server'
import { prisma } from '@template/store'
import { z } from 'zod'

export const userRouter = {
  getUser: publicProcedure.query(() => {
    return { id: '1', name: 'Bilbo' }
  }),
  getAllUser: publicProcedure.query(async () => {
    return prisma.user.findMany()
  }),
  createUser: protectedProcedure
    .input(z.object({ email: z.email(), name: z.string().min(5) }))
    .mutation(async (opts) => {
      // use your ORM of classhoice
      return prisma.user.findMany({
        where: {
          email: opts.input.email,
        },
      })
    }),
} satisfies TRPCRouterRecord
