import { z } from 'zod'
import { prisma } from '@template/store'
import type { TRPCRouterRecord } from '@trpc/server'
import { protectedProcedure, publicProcedure } from '@/trpc'

export const userRouter = {
  getUser: publicProcedure.query(() => {
    return { id: '1', name: 'Bilbo' }
  }),
  getAllUser: publicProcedure.query(async () => {
    return prisma.user.findMany()
  }),
  createUser: protectedProcedure
    .input(z.object({ name: z.string().min(5) }))
    .mutation(async (opts) => {
      // use your ORM of classhoice
      return prisma.user.create({
        data: opts.input,
      })
    }),
} satisfies TRPCRouterRecord
