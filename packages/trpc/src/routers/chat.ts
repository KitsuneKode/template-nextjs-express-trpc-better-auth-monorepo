import { protectedProcedure, publicProcedure } from '../trpc'
import type { TRPCRouterRecord } from '@trpc/server'
import { prisma } from '@template/store'
import { z } from 'zod'

export const chatRouter = {
  list: publicProcedure.query(async () => {
    return prisma.message.findMany({
      orderBy: { createdAt: 'asc' },
      take: 50,
      include: { sender: true },
    })
  }),

  send: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return prisma.message.create({
        data: {
          content: input.content,
          senderId: ctx.session.user.id,
        },
        include: { sender: true },
      })
    }),
} satisfies TRPCRouterRecord
