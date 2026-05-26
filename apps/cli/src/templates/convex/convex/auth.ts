import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

/** Sync a Better Auth user into Convex (wire from your auth webhook or action). */
export const syncUser = mutation({
  args: {
    betterAuthId: v.string(),
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_betterAuthId', (q) => q.eq('betterAuthId', args.betterAuthId))
      .first()

    if (existing) {
      const userId = existing['_id']
      await ctx.db.patch(userId, {
        name: args.name,
        avatar: args.avatar,
        updatedAt: Date.now(),
      })
      return userId
    }

    return await ctx.db.insert('users', {
      betterAuthId: args.betterAuthId,
      email: args.email,
      name: args.name,
      avatar: args.avatar,
      createdAt: Date.now(),
    })
  },
})

export const getCurrentUser = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_sessionToken', (q) => q.eq('sessionToken', sessionToken))
      .first()

    if (!session || session.expires < Date.now()) {
      return null
    }

    return await ctx.db.get(session.userId)
  },
})
