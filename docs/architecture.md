# Architecture

Runtime flow across workspaces. For variant families (next, backend, rust), see [template-variants.md](./template-variants.md).

## Request flow

1. `apps/web` loads `@template/ui/globals.css` in `app/layout.tsx`.
2. `apps/web/components/providers.tsx` mounts theme + tRPC React provider.
3. **Browser:** `apps/web/trpc/client.tsx` → `NEXT_PUBLIC_API_URL` + `/api/trpc`.
4. **RSC / server actions:** `apps/web/trpc/server.tsx` → `trpcCaller()` → `createCaller` from `@template/trpc` (in-process, no HTTP).
5. `apps/server/src/app.ts` mounts Better Auth (`/api/auth`), tRPC (`/api/trpc`), health (`/health`).
6. tRPC procedures in `apps/server/src/modules/<feature>/*.trpc.ts`, composed in `modules/trpc/app.router.ts`.
7. Services use Prisma via `@template/store`.

## Workspace dependencies

- `apps/web` → `@template/auth`, `@template/common`, `@template/store`, `@template/trpc`, `@template/ui`
- `apps/server` → `@template/auth`, `@template/backend-common`, `@template/store`; implements tRPC
- `apps/worker` → `@template/backend-common`, `@template/store` (jobs; needs `REDIS_URL`)
- `packages/trpc` → re-exports server router types and `createCaller` only
- `packages/backend-common` → `serverEnv`, ioredis, logging, `validate-env`

## Config

- Web: `apps/web/env.ts` (t3-env, `NEXT_PUBLIC_*`)
- Server/worker: `packages/backend-common/src/env.ts`
- Cross-platform matrix: [deployment-env.md](./deployment-env.md)

## Deploy topology

See [deployment.md](./deployment.md).

- Path A: `apps/web` + `apps/server` on Vercel
- Path B: `apps/web` on Vercel, `apps/server` on Render ([render.yaml](../render.yaml), Neon + Upstash)
- Path C: `apps/web` on Vercel, `apps/server` on Railway ([railway.toml](../railway.toml), Neon + Upstash)

## Scaffold status

- `apps/worker` — Redis wiring; job handlers still minimal
- `tests/` — CLI and repo tooling tests, not full E2E of production deploy

Template-only UI: [archive/README.md](./archive/README.md).
