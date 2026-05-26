import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    betterAuthId: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index('by_email', ['email'])
    .index('by_betterAuthId', ['betterAuthId']),

  posts: defineTable({
    title: v.string(),
    content: v.string(),
    userId: v.id('users'),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_published', ['published']),

  sessions: defineTable({
    sessionToken: v.string(),
    userId: v.id('users'),
    expires: v.number(),
    betterAuthSessionId: v.string(),
  })
    .index('by_sessionToken', ['sessionToken'])
    .index('by_userId', ['userId']),
})
