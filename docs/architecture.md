# Architecture

This file describes the real runtime flow across workspaces so agents can avoid
guessing from folder names alone.

This repo is a **ts-turbo family** template — the default full-stack TypeScript
monorepo. For other family architectures (next, backend, convex, rust, etc.),
see [template-variants.md](./template-variants.md).

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
- `packages/common` holds client-side config and shared env validation.

## Config Surfaces

- Client config is validated in `packages/common/src/env/client.ts`.
- Backend env validation lives in `packages/backend-common/src/env.ts`.
- `apps/server/src/utils/config.ts` re-exports backend config.
- `apps/web/utils/config.ts` is a thin wrapper around client config.

## Template-Only Surfaces

See `docs/start-fresh.md` for the full list of template-only surfaces that can
be removed when turning this template into a product.

## Current Scaffold Status

- `apps/worker` has logging and Redis wiring but no real background job system.
- `tests` contains repo tooling and CLI tests, but not broad runtime coverage yet.
- All 11 CLI families are defined but only `ts-turbo` has a dedicated template source.
