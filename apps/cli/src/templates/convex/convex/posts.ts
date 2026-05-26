import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('posts')
      .withIndex('by_published', (q) => q.eq('published', true))
      .collect()
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('posts', {
      title: args.title,
      content: args.content,
      userId: args.userId,
      published: false,
      createdAt: now,
      updatedAt: now,
    })
  },
})
