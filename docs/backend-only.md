# Backend-Only Template Guide

This guide covers setting up an Express + tRPC + Prisma backend for API-first projects.

## When to Use Backend-Only

Use this template when you:

- Need a backend API for multiple frontends
- Are building a service for mobile apps
- Want API-first architecture
- Prefer decoupled frontend/backend
- Are creating a GraphQL/REST hybrid API
- Need microservices architecture
- Want maximum control over backend logic

## Project Structure

```bash
template-express-trpc-api/
├── src/
│   ├── app.ts                    # Express app setup
│   ├── server.ts                 # Server entry point
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   └── users.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── error-handler.ts
│   │   └── request-logging.ts
│   ├── services/
│   │   ├── auth.ts
│   │   ├── post.ts
│   │   └── user.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── errors.ts
│   │   └── validators.ts
│   ├── jobs/
│   │   ├── email.ts
│   │   └── webhooks.ts
│   └── types/
│       └── index.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/
│   ├── integration/
│   │   ├── auth.test.ts
│   │   └── posts.test.ts
│   └── unit/
│       └── validators.test.ts
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env.example
├── package.json
└── tsconfig.json
```

## Core Setup

### 1. Express Application

**src/app.ts**

```typescript
import express, { Express } from 'express'
import helmet from 'helmet'
import { createOpenApiDocument, createExpressMiddleware, Procedure, ProcedureType } from '@trpc/server/adapters/express'
import { appRouter } from './routes'
import { createTRPCContext } from '@/utils/trpc'
import { errorHandler } from '@/middleware/error-handler'
import { requestLogger } from '@/middleware/request-logging'
import { corsMiddleware } from '@/middleware/cors'

export function createApp(): Express {
  const app = express()

  // Security
  app.use(helmet())
  app.use(corsMiddleware)

  // Logging
  app.use(requestLogger)

  // Body parsing
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // tRPC routes
  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext: createTRPCContext,
    }),
  )

  // OpenAPI/REST routes (optional)
  app.use('/api', require('@/routes'))

  // Error handling (last middleware)
  app.use(errorHandler)

  return app
}

export default createApp
```

**src/server.ts**

```typescript
import 'dotenv/config'
import { createApp } from './app'
import { validateEnvironment } from '@template/backend-common/validate-env'
import { setupGracefulShutdown, onShutdown } from '@template/backend-common/graceful-shutdown'
import { logger } from '@template/backend-common/logger/server'
import { prisma } from '@template/store'
import { redis } from '@template/backend-common/redis'

const PORT = process.env.PORT || 3000

// Validate environment
validateEnvironment('server')

const app = createApp()

const server = app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server started')
})

// Register shutdown handlers
onShutdown(async () => {
  logger.info('Closing database connection')
  await prisma.$disconnect()
})

onShutdown(async () => {
  logger.info('Closing Redis connection')
  await redis.close()
})

// Setup graceful shutdown
setupGracefulShutdown()
```

### 2. tRPC Router Setup

**src/routes/index.ts**

```typescript
import { router } from '@/utils/trpc'
import { authRouter } from './auth'
import { postsRouter } from './posts'
import { usersRouter } from './users'

export const appRouter = router({
  auth: authRouter,
  posts: postsRouter,
  users: usersRouter,
})

export type AppRouter = typeof appRouter
```

### 3. Example Route: Posts

**src/routes/posts.ts**

```typescript
import { z } from 'zod'
import { publicProcedure, protectedProcedure, router } from '@/utils/trpc'
import { prisma } from '@template/store'
import { TRPCError } from '@trpc/server'

export const postsRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().default(10), cursor: z.string().optional() }))
    .query(async ({ input }) => {
      const posts = await prisma.post.findMany({
        take: input.limit + 1,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
      })

      let nextCursor: typeof input.cursor | undefined = undefined
      if (posts.length > input.limit) {
        nextCursor = posts.pop()?.id
      }

      return { posts, nextCursor }
    }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const post = await prisma.post.findUnique({
      where: { id: input },
      include: { author: true, comments: true },
    })

    if (!post) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
    }

    return post
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const post = await prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.user.id,
        },
      })

      return post
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const post = await prisma.post.findUnique({ where: { id: input.id } })

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
      }

      if (post.authorId !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot update post' })
      }

      return await prisma.post.update({
        where: { id: input.id },
        data: { title: input.title, content: input.content },
      })
    }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    const post = await prisma.post.findUnique({ where: { id: input } })

    if (!post) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
    }

    if (post.authorId !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot delete post' })
    }

    await prisma.post.delete({ where: { id: input } })
  }),
})
```

### 4. Authentication Route

**src/routes/auth.ts**

```typescript
import { z } from 'zod'
import { publicProcedure, router } from '@/utils/trpc'
import { betterAuth } from '@template/auth'
import { TRPCError } from '@trpc/server'

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
      // Integrate with Better Auth
      // This is a placeholder - actual implementation depends on Better Auth setup
      try {
        const result = await betterAuth.signInWithCredentials({
          email: input.email,
          password: input.password,
        })
        return result
      } catch (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        })
      }
    }),

  signup: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const result = await betterAuth.signUp({
          email: input.email,
          password: input.password,
          name: input.name,
        })
        return result
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to create account',
        })
      }
    }),

  logout: publicProcedure.mutation(async () => {
    return { success: true }
  }),
})
```

### 5. Middleware

**src/middleware/error-handler.ts**

```typescript
import { Express, Request, Response, NextFunction } from 'express'
import { TRPCError } from '@trpc/server'
import { logger } from '@template/backend-common/logger/server'

export function errorHandler(err: Error | TRPCError, _req: Request, res: Response, _next: NextFunction) {
  // Log error
  logger.error({ error: err.message, stack: err.stack }, 'Request error')

  // Handle tRPC errors
  if (err instanceof TRPCError) {
    return res.status(getHttpStatusCode(err.code)).json({
      code: err.code,
      message: err.message,
    })
  }

  // Generic error response
  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
}

function getHttpStatusCode(code: string): number {
  const mapping: Record<string, number> = {
    PARSE_ERROR: 400,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
  }
  return mapping[code] || 500
}
```

**src/middleware/request-logging.ts**

```typescript
import { Request, Response, NextFunction } from 'express'
import { logger } from '@template/backend-common/logger/server'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now()

  // Log response
  const originalSend = res.send
  res.send = function (data) {
    const duration = Date.now() - startTime
    logger.info(
      {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration,
      },
      'Request completed',
    )
    return originalSend.call(this, data)
  }

  next()
}
```

### 6. Prisma Setup

**prisma/schema.prisma**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // Hashed
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
  @@index([published])
}
```

## Testing

**tests/integration/posts.test.ts**

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { appCaller } from '@/utils/trpc-test'

describe('Posts Router', () => {
  it('should list posts', async () => {
    const result = await appCaller.posts.list({ limit: 10 })
    expect(result).toHaveProperty('posts')
    expect(result).toHaveProperty('nextCursor')
  })

  it('should create a post', async () => {
    const post = await appCaller.posts.create(
      { title: 'Test', content: 'Test content' },
      { user: { id: 'test-user' } },
    )
    expect(post).toHaveProperty('id')
    expect(post.title).toBe('Test')
  })
})
```

## Deployment

### Docker

**Dockerfile**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json bun.lockb ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

**docker-compose.yml**

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: api
    ports:
      - '5432:5432'

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

  api:
    build: .
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/api
      REDIS_URL: redis://redis:6379
    ports:
      - '3000:3000'
    depends_on:
      - db
      - redis
```

### Railway/Render

```bash
# Deploy to Railway
railway up

# Deploy to Render
render deploy
```

## Performance Tips

**Indexing:**
- Index frequently queried fields
- Use composite indexes for multi-field queries

**Caching:**
- Cache responses with Redis
- Use query deduplication

**Rate Limiting:**
- Implement per-IP rate limits
- Implement per-user rate limits

**Pagination:**
- Always paginate large result sets
- Use cursor-based pagination for consistency

## Environment Variables

**.env**

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/api

# Redis
REDIS_URL=redis://localhost:6379

# Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Server
NODE_ENV=development
PORT=3000

# Logging
LOG_LEVEL=info
```

## Common Patterns

**Rate Limiting:**
See `packages/backend-common` for rate-limit middleware

**Caching:**
See `packages/backend-common` for caching utilities

**Error Handling:**
All errors should use TRPCError with appropriate status codes

**Input Validation:**
All inputs must be validated with Zod schemas

## Migrating to Full Stack

When you need a frontend:

1. Add Next.js at `apps/web`
2. Setup tRPC client in Next.js
3. Use tRPC hooks instead of fetch
4. Deploy frontend and backend separately or together

See `docs/template-variants.md` for more details.
