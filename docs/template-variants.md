# Template Variants

This document describes the four template variants available in the Kitsune Stack:

1. **Full Stack (Current)** - Next.js + Express + tRPC + Prisma + Better Auth
2. **Convex Backend** - Next.js + Convex + Better Auth
3. **Standalone Next.js** - Next.js only (no backend)
4. **Backend-Only** - Express + tRPC + Prisma (for API-first projects)

---

## 1. Full Stack Template (Current)

**Best for:** Teams needing maximum control, custom backend logic, and traditional architecture.

**Stack:**

- **Frontend:** Next.js 16 with App Router, React 19
- **Backend:** Express.js with TypeScript
- **API:** tRPC for end-to-end type safety
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Better Auth
- **Jobs:** BullMQ with Redis
- **Deployment:** Docker + Docker Compose

**Key files:**

- `apps/server` - Express backend
- `packages/trpc` - tRPC router definitions
- `packages/store` - Prisma schema
- `apps/worker` - Background job processing

**When to use:**

- Complex backend logic needed
- Custom authentication requirements
- Multiple services/workers
- Traditional monorepo structure

---

## 2. Convex Backend Variant

**Best for:** Teams wanting real-time features, serverless backend, and less operational complexity.

**Stack:**

- **Frontend:** Next.js 16 with App Router, React 19
- **Backend:** Convex (serverless backend)
- **Database:** Convex (included)
- **Authentication:** Better Auth (with Convex integration)
- **Real-time:** Built-in Convex subscriptions
- **Deployment:** Vercel + Convex dashboard

**Key differences from Full Stack:**

```text
❌ No Express, tRPC, Prisma, BullMQ, Redis, Docker
✅ Convex functions replace tRPC routers
✅ Convex database replaces Prisma
✅ Convex actions replace background jobs
✅ Automatic deployment and scaling
```

**Project structure:**

```bash
template-nextjs-convex-bettera-auth/
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       └── convex/
│           ├── _generated/
│           ├── auth.ts
│           ├── posts.ts
│           └── schema.ts
├── packages/
│   ├── auth/
│   ├── common/
│   ├── ui/
│   └── eslint-config/
└── convex.json
```

**Key features:**

- `convex/schema.ts` - Define database tables (replaces Prisma schema)
- `convex/*.ts` - Query and mutation functions (replaces tRPC routers)
- `convex/auth.ts` - Better Auth integration
- Real-time subscriptions via `useQuery` and `useAction` hooks

### Reading posts with Convex

```typescript
// convex/posts.ts
import { query } from './_generated/server'

export const list = query(async (ctx) => {
  return await ctx.db.query('posts').collect()
})

// app/page.tsx
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function Home() {
  const posts = useQuery(api.posts.list)
  return <div>{posts?.map(p => <div key={p._id}>{p.title}</div>)}</div>
}
```

**When to use:**

- Real-time features are important
- Minimal DevOps needed
- Prototyping or MVP
- Serverless architecture preference

---

## 3. Standalone Next.js Template

**Best for:** Simple projects, marketing sites, or frontend-only applications.

**Stack:**

- **Frontend:** Next.js 16 with App Router
- **Authentication:** None (integrate Clerk, Auth0, or headless auth)
- **Database:** Optional (no pre-configured)
- **Deployment:** Vercel, Netlify

**Project structure:**

```bash
template-nextjs-standalone/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   └── (dashboard)/
├── components/
├── lib/
├── styles/
└── public/
```

**Key features:**

- Zero backend scaffolding
- Clean component structure
- SEO utilities
- Design tokens and UI library
- No database or auth pre-configured

**When to use:**

- Landing pages
- Marketing sites
- Content-driven apps
- Frontend developer training
- SPA with external backend

---

## 4. Backend-Only Template

**Best for:** Teams building APIs for multiple frontends or mobile apps.

**Stack:**

- **Backend:** Express.js with TypeScript
- **API:** tRPC + REST endpoints
- **Database:** PostgreSQL with Prisma
- **Authentication:** Better Auth
- **Jobs:** BullMQ with Redis
- **Deployment:** Docker

**Project structure:**

```bash
template-express-trpc-api/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   └── users.ts
│   ├── middleware/
│   ├── utils/
│   └── jobs/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
├── Dockerfile
└── docker-compose.yml
```

**Key features:**

- Express setup with minimal frontend dependencies
- tRPC for type-safe APIs
- Better Auth endpoints
- Background job processing
- Production-ready error handling
- Full logging and monitoring

### tRPC router example

```typescript
// src/routes/posts.ts
import { publicProcedure, router } from '@/trpc'
import { z } from 'zod'

export const postsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany()
  }),

  create: publicProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.post.create({ data: input })
    }),
})
```

**When to use:**

- Multiple frontend applications
- Native mobile apps
- API-first architecture
- Microservices
- GraphQL/REST hybrid

---

## Migration Between Variants

### From Full Stack to Convex

1. Keep `apps/web` and `packages/*`
2. Replace `apps/server` with Convex functions
3. Replace Prisma schema with Convex schema
4. Replace tRPC routers with Convex queries/mutations
5. Use Convex actions for background jobs

**Time estimate:** 2-3 days for medium project

### From Full Stack to Standalone Next.js

1. Keep `apps/web` and `packages/ui`
2. Remove `apps/server`, `apps/worker`, `packages/trpc`, `packages/store`
3. Integrate external auth provider
4. Remove backend-only dependencies

**Time estimate:** 1 day

### From Full Stack to Backend-Only

1. Keep `apps/server`, `packages/trpc`, `packages/store`
2. Remove `apps/web`, `apps/worker` frontend
3. Keep `apps/worker` for jobs
4. Remove Next.js dependencies from root

**Time estimate:** 1 day

---

## Choosing Your Variant

| Feature | Full Stack | Convex | Standalone | Backend-Only |
|---------|-----------|--------|-----------|--------------|
| **Real-time** | Manual | Built-in | Manual | N/A |
| **DevOps** | Medium | Low | Low | Medium |
| **Control** | High | Medium | High | High |
| **Learning curve** | Medium | Low | Low | Medium |
| **Scaling** | Manual | Auto | Auto | Manual |
| **Cost** | Low (self-host) | High | Low | Low (self-host) |
| **Team size** | 2+ | 1+ | 1+ | 2+ |

---

## Getting Started

To initialize your chosen variant:

```bash
# Full Stack (current - default)
npx @kitsu/create@latest my-app

# Convex Backend
npx @kitsu/create@latest my-app --preset convex

# Standalone Next.js
npx @kitsu/create@latest my-app --preset next-only

# Backend-Only
npx @kitsu/create@latest my-app --preset api-only
```

Each variant comes pre-configured with:

- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Turborepo for monorepos
- ✅ Design tokens and UI components
- ✅ Production-ready error handling
- ✅ Security best practices
- ✅ Docker support
- ✅ CI/CD workflows
