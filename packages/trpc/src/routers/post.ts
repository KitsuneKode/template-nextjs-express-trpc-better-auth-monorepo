import { protectedProcedure, publicProcedure } from '../trpc'
import type { TRPCRouterRecord } from '@trpc/server'
import { prisma } from '@template/store'
import { z } from 'zod'

export const postRouter = {
  list: publicProcedure.query(async () => {
    return prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    })
  }),

  byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    return prisma.post.findUnique({
      where: { id: input.id },
      include: { author: true },
    })
  }),

  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    return prisma.post.findUnique({
      where: { slug: input.slug },
      include: { author: true },
    })
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        slug: z.string().min(1),
        published: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.post.create({
        data: {
          ...input,
          authorId: ctx.session.user.id,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        published: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Ensure ownership
      const post = await prisma.post.findUnique({
        where: { id: input.id },
      })

      if (!post || post.authorId !== ctx.session.user.id) {
        throw new Error('Unauthorized')
      }

      return prisma.post.update({
        where: { id: input.id },
        data: input,
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Ensure ownership
      const post = await prisma.post.findUnique({
        where: { id: input.id },
      })

      if (!post || post.authorId !== ctx.session.user.id) {
        throw new Error('Unauthorized')
      }

      return prisma.post.delete({
        where: { id: input.id },
      })
    }),
} satisfies TRPCRouterRecord
