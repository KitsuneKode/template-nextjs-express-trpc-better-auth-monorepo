# Agent Navigation

This repository is both a working full-stack baseline and a template showcase.
Do not start with a repo-wide search unless the local docs fail to answer the
question.

## Read Order

1. Open the nearest local `AGENTS.md` in the workspace you are touching.
2. Use `docs/README.md` for the global map and command/env overview.
3. Use `docs/architecture.md` for cross-workspace flow.
4. Use `docs/start-fresh.md` when stripping template/demo content.
5. Use `docs/context-maintenance.md` when updating these docs.

## Fast Routing

- Auth: `packages/auth`, `packages/trpc/src/trpc.ts`, `apps/server/src/app.ts`
- tRPC routers and context: `packages/trpc`
- Prisma schema, migrations, seed data: `packages/store`
- Shared UI and shadcn setup: `packages/ui`
- Client env/config loading: `packages/common`
- Server and worker env/logger/redis: `packages/backend-common`
- Bootstrap CLI: `apps/cli`
- Next.js app shell and providers: `apps/web`
- Express bootstrap and route mounts: `apps/server`
- Background jobs: `apps/worker`
- Repo tooling: `toolings/*`
- Test scaffold status: `tests`

## Repo Reality

- `apps/web` contains real app wiring and template marketing/demo surfaces.
- `apps/cli` bootstraps a cleaned project from this template.
- `apps/server` mounts Better Auth at `/api/auth/*splat` and tRPC at
  `/api/trpc`.
- `apps/worker` is mostly a stub today.
- `tests` now contains repo tooling tests, but it is not yet a full app-level
  safety net.
- Existing package and app `README.md` files are mostly boilerplate; prefer
  `AGENTS.md` plus `docs/`.

## Update Rules

- Update the nearest local `AGENTS.md` when ownership, entrypoints, commands,
  cleanup notes, or file layout materially change.
- Update `docs/architecture.md` only when a change crosses workspace
  boundaries.
- Update `docs/start-fresh.md` when template-only surfaces are added, renamed,
  or removed.
- Keep docs as current-state summaries. Do not append task journals.

## Hygiene Commands

- `bun run repo:doctor`
  Audit stale scaffolding, broken exports, and doc drift.
- `bun run template:clean:dry`
  Preview the opinionated start-fresh cleanup plan.
- `bun run template:clean`
  Apply the recommended cleanup to a cloned project.
