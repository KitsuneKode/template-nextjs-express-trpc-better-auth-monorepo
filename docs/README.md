# Repository Docs

This repository is a Bun + Turborepo template with a real Next.js frontend,
Express backend, Better Auth, Prisma, tRPC, shared UI, and a large amount of
template showcase content.

Start here before searching the repo.

## How To Navigate

1. Open the nearest local `AGENTS.md`.
2. Use `docs/commands.md` for commands and `docs/env.md` for env vars.
3. Use `docs/architecture.md` if the change crosses workspaces.
4. Use `docs/start-fresh.md` to turn the template into a new product.

## Workspace Map

- `apps/web`
  Next.js App Router frontend. Real runtime wiring lives in
  `app/layout.tsx`, `components/providers.tsx`, `trpc/client.tsx`,
  `trpc/server.tsx`, and `utils/config.ts`.
  Template-only content: see `docs/start-fresh.md`.

- `apps/server`
  Express service. `src/app.ts` mounts Better Auth, JSON middleware, tRPC, and
  `/health`. `src/server.ts` handles process startup and clustering.

- `apps/cli`
  Bun-native bootstrap CLI for generating a cleaned project from this template.
  Generation logic lives in `src/lib/scaffold.ts`.

- `apps/worker`
  Worker scaffold. Logging and Redis helpers exist, but `src/index.ts` is still
  placeholder logic.

- `packages/auth`
  Better Auth server and client wrappers. Server setup lives in `src/index.ts`.
  Client setup lives in `src/client.ts`.

- `packages/trpc`
  Shared tRPC context, procedure helpers, middleware, and routers. Real app
  router lives in `src/routers/_app.ts`.

- `packages/store`
  Prisma schema, migrations, generated client output, and seed data.

- `packages/common`
  Shared config-loading utilities and client logger.

- `packages/backend-common`
  Shared backend config, winston logger setup, and Bun Redis helper.

- `packages/ui`
  Shared UI components, styles, and shadcn generator config.

- `.oxlintrc.json`
  Repo-wide oxlint configuration replacing ESLint.

- `toolings/typescript-config`
  Shared TS base configs extended by apps and packages.

- `toolings/scripts`
  Repo utility scripts for scope migration, redundancy auditing, and
  start-fresh cleanup.

- `tests`
  Test workspace for repo tooling and future broader coverage. It now contains
  real Bun tests for the repo scripts, but it is not a full app-level safety
  net yet.

## Start-Fresh Bias

If the goal is a new product instead of a preserved template showcase, read
`docs/start-fresh.md` before editing UI routes.
