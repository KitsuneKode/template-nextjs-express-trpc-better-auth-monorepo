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

## Update When

Update this file when route mounts, middleware order, config usage, or startup
behavior changes.
