# Server Notes

## Purpose

`apps/server` is the Express service that exposes Better Auth, tRPC, and a
health endpoint.

## Read First

- `src/app.ts`
- `src/server.ts`
- `src/utils/config.ts`
- `src/middlewares/error-handler-middleware.ts`
- `src/middlewares/timing-middleware.ts`
- `src/lib/redis/index.ts`

## Owns

- Express app bootstrap
- Better Auth route mount at `/api/auth/*splat`
- tRPC route mount at `/api/trpc`
- `/health` endpoint
- process startup and cluster behavior

## Common Tasks

- Route or middleware changes:
  `src/app.ts`, `src/middlewares/*`
- Startup, port, or process model changes:
  `src/server.ts`
- backend env or Redis wiring:
  `src/utils/config.ts`, `src/lib/redis/index.ts`

## Cleanup Notes

- Keep this workspace for real backend logic even if most template UI is
  removed.
- Revisit `src/server.ts` if you do not want clustered startup.

## Vercel Deployment

Required environment variable in Vercel project (all environments: Production, Preview, Development):

```
VERCEL_EXPERIMENTAL_BACKENDS=1
```

Set the value to exactly `1` with no trailing newline. This enables experimental build mode which resolves TypeScript path aliases (`@/`, workspace packages) during the Vercel build. Without it, cold starts fail with `ResolveMessage {}` and `Bun process exited with exit status: 1`.

Set `package.json` `main` to `src/vercel-handler.ts` (Bun `require` shim, then dynamic import of `./app`). Do not use `src/server.ts` (cluster/listen) or rely on `dist/` from `build:vercel` — Vercel bundles from source.

Winston file logging under `logs/` is disabled on Vercel (`VERCEL=1`); logs go to stdout only.

## Update When

Update this file when route mounts, middleware order, config usage, or startup
behavior changes.
