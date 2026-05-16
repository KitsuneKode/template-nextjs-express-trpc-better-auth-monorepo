# Convex Backend Integration Guide

This guide walks through setting up a Next.js + Convex project with Better Auth authentication.

## Project Structure

```bash
apps/web/
├── convex/
│   ├── _generated/
│   │   ├── api.d.ts
│   │   └── server.d.ts
│   ├── auth.ts                 # Better Auth integration
│   ├── schema.ts               # Database schema
│   ├── posts.ts                # Post queries and mutations
│   ├── users.ts                # User queries
│   └── http.ts                 # HTTP routes (webhooks, Better Auth)
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   └── signin/page.tsx
│   └── (dashboard)/
│       └── posts/page.tsx
└── hooks/
    └── useUser.ts              # Custom hook for current user
```

## 1. Installation & Setup

```bash
# Install Convex CLI
npm install convex

# Initialize Convex in your project
npx convex init

# This creates:
# - convex.json (config)
# - convex/ directory
# - .env.local with CONVEX_DEPLOYMENT
```

## 2. Define Your Schema

### convex/schema.ts

```typescript
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    betterAuthId: v.string(),
    createdAt: v.number(),
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
```

## 3. Integrate Better Auth

### convex/auth.ts

```typescript
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

/**
 * Called by Better Auth when a user is created
 * Webhook from Better Auth endpoints
 */
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
      return await ctx.db.patch(existing._id, {
        name: args.name,
        avatar: args.avatar,
        updatedAt: Date.now(),
      })
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

/**
 * Get current user from session
 */
export const getCurrentUser = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_sessionToken', (q) => q.eq('sessionToken', sessionToken))
      .first()

    if (!session) return null

    // Check if session is expired
    if (session.expires < Date.now()) {
      await ctx.db.delete(session._id)
      return null
    }

    const user = await ctx.db.get(session.userId)
    return user
  },
})

/**
 * Logout: delete session
 */
export const logout = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_sessionToken', (q) => q.eq('sessionToken', sessionToken))
      .first()

    if (session) {
      await ctx.db.delete(session._id)
    }
  },
})
```

## 4. Define Query and Mutation Functions

### convex/posts.ts

```typescript
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: { userId: v.optional(v.id('users')) },
  handler: async (ctx, { userId }) => {
    if (userId) {
      return await ctx.db
        .query('posts')
        .withIndex('by_userId', (q) => q.eq('userId', userId))
        .collect()
    }

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
  handler: async (ctx, { title, content, userId }) => {
    return await ctx.db.insert('posts', {
      title,
      content,
      userId,
      published: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})

export const update = mutation({
  args: {
    postId: v.id('posts'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, { postId, ...updates }) => {
    return await ctx.db.patch(postId, {
      ...updates,
      updatedAt: Date.now(),
    })
  },
})

export const remove = mutation({
  args: { postId: v.id('posts') },
  handler: async (ctx, { postId }) => {
    await ctx.db.delete(postId)
  },
})
```

## 5. Setup HTTP Routes for Better Auth

### convex/http.ts

```typescript
import { httpRouter } from 'convex/server'
import { syncUser, logout } from './auth'

const http = httpRouter()

// Better Auth webhook endpoint
http.route({
  path: '/auth/webhook',
  method: 'POST',
  handler: async (ctx, request) => {
    const body = await request.json()

    // Handle Better Auth events
    if (body.event === 'user.created') {
      await ctx.runMutation(syncUser, {
        betterAuthId: body.data.id,
        email: body.data.email,
        name: body.data.name || '',
        avatar: body.data.image,
      })
    }

    if (body.event === 'session.deleted') {
      await ctx.runMutation(logout, {
        sessionToken: body.data.sessionToken,
      })
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  },
})

export default http
```

## 6. Frontend Integration

### app/layout.tsx

```typescript
'use client'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { SessionProvider } from 'next-auth/react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ConvexProvider client={convex}>
          <SessionProvider>{children}</SessionProvider>
        </ConvexProvider>
      </body>
    </html>
  )
}
```

### hooks/useUser.ts

```typescript
'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useSession } from 'next-auth/react'

export function useUser() {
  const { data: session } = useSession()
  const user = useQuery(api.auth.getCurrentUser, {
    sessionToken: session?.user?.sessionToken || '',
  })

  return { user, isLoading: user === undefined, isAuthenticated: !!user }
}
```

### app/posts/page.tsx

```typescript
'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@/hooks/useUser'

export default function PostsPage() {
  const { user } = useUser()
  const posts = useQuery(api.posts.list, { userId: user?._id })
  const createPost = useMutation(api.posts.create)

  async function handleCreate(title: string, content: string) {
    if (!user) return
    await createPost({ title, content, userId: user._id })
  }

  return (
    <div>
      <h1>My Posts</h1>
      {posts?.map((post) => (
        <article key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  )
}
```

## 7. Real-time Subscriptions

```typescript
'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function RealtimePosts() {
  // This automatically re-renders when data changes
  const posts = useQuery(api.posts.list)

  return (
    <div>
      {posts?.map((post) => (
        <div key={post._id}>{post.title}</div>
      ))}
    </div>
  )
}
```

## 8. Environment Variables

### .env.local

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Better Auth webhook (tell Better Auth where Convex is)
BETTER_AUTH_WEBHOOK_URL=https://xxx.convex.cloud/auth/webhook
```

## 9. Deployment

### Deploy to Vercel

```bash
vercel deploy
```

### Deploy to Convex

```bash
npx convex deploy
```

Convex automatically deploys when you push to main.

## 10. Performance Considerations

### Indexes

```typescript
// Always index frequently queried fields
posts: defineTable({
  userId: v.id('users'),
  published: v.boolean(),
})
  .index('by_userId', ['userId'])
  .index('by_published', ['published'])
```

### Pagination

```typescript
export const listPaginated = query({
  args: { cursor: v.optional(v.string()), limit: v.number() },
  handler: async (ctx, { cursor, limit }) => {
    const posts = await ctx.db
      .query('posts')
      .order('desc')
      .paginate({ cursor, numItems: limit })

    return posts
  },
})
```

**Caching:** Convex automatically caches queries for real-time updates.

## 11. Common Patterns

### Aggregation

```typescript
export const postCount = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('posts')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .count()
  },
})
```

### Transactions

```typescript
export const updateUserAndPost = mutation({
  handler: async (ctx) => {
    // Both succeed or both fail
    await ctx.db.patch(userId, { /* ... */ })
    await ctx.db.insert('posts', { /* ... */ })
  },
})
```

## Next Steps

1. Deploy to Convex cloud
2. Setup Better Auth webhooks
3. Add frontend authentication UI
4. Implement real-time features
5. Add error handling and validation
