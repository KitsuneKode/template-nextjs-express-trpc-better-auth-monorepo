# Architecture

This file describes the real runtime flow across workspaces so agents can avoid
guessing from folder names alone.

## Request Flow

1. `apps/web` loads shared global styles from `@template/ui/globals.css` in
   `app/layout.tsx`.
2. `apps/web/components/providers.tsx` mounts `next-themes` and the shared tRPC
   React provider.
3. `apps/web/trpc/client.tsx` builds the browser tRPC client against
   `NEXT_PUBLIC_API_URL + /api/trpc`.
4. `apps/server/src/app.ts` exposes:
   - Better Auth at `/api/auth/*splat`
   - tRPC at `/api/trpc`
   - health check at `/health`
5. `packages/trpc/src/trpc.ts` resolves request context from Better Auth
   session data and Prisma.
6. Routers in `packages/trpc/src/routers` call Prisma directly through
   `@template/store`.
7. `packages/store` reads `packages/store/prisma/schema.prisma`, generated
   client output, and migrations.

## Workspace Dependencies

- `apps/web` depends on `@template/auth`, `@template/common`,
  `@template/store`, `@template/trpc`, and `@template/ui`.
- `apps/server` depends on `@template/auth`, `@template/backend-common`, and
  `@template/trpc`.
- `apps/worker` depends on `@template/auth`, `@template/backend-common`,
  `@template/common`, and `@template/store`.
- `packages/auth` uses Better Auth with the Prisma adapter from
  `@template/store`.
- `packages/trpc` centralizes context, middleware, and routers and depends on
  auth, store, common, and backend-common.
- `packages/backend-common` holds backend env validation, Redis, and logging.
- `packages/common` holds the generic `ConfigLoader` plus client-side config.

## Config Surfaces

- Client config is validated in `packages/common/src/utils/config-loader.ts`.
- `apps/web/utils/config.ts` is a thin wrapper around the shared client config.
- Backend env validation lives in
  `packages/backend-common/src/utils/config.ts`.
- `apps/server/src/utils/config.ts` and `packages/trpc/src/utils/config.ts`
  both re-export backend config.

## Template-Only Surfaces

These are present for template evaluation, not because the product runtime
needs them:

- `apps/web/app/demo`
- `apps/web/app/landing`
- `apps/web/components/demos`
- `apps/web/components/landing`
- `apps/web/components/landing-premium`
- `apps/web/components/sections`
- `apps/web/lib/demo-data.ts`
- `apps/web/public/brand`
- large chunks of seeded post content in `packages/store/src/scripts/seed.ts`

## Current Scaffold Status

- `apps/worker` has logging and Redis wiring but no real background job system.
- `tests` contains repo tooling tests, but not broad runtime coverage yet.
- `packages/backend-common/src/index.ts` is effectively empty; most meaningful
  imports use subpath exports such as `@template/backend-common/config`.
