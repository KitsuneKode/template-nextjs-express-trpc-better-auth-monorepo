# Repository Docs

This repository is a Bun + Turborepo template with a real Next.js frontend,
Express backend, Better Auth, Prisma, tRPC, shared UI, and a large amount of
template showcase content.

Start here before searching the repo.

## How To Navigate

1. Open the nearest local `AGENTS.md`.
2. Use this file for the global map, commands, and env names.
3. Use `docs/architecture.md` if the change crosses workspaces.
4. Use `docs/start-fresh.md` if the goal is to turn the template into a new
   product.

## Workspace Map

- `apps/web`
  Next.js App Router frontend. Real runtime wiring lives in
  `app/layout.tsx`, `components/providers.tsx`, `trpc/client.tsx`,
  `trpc/server.tsx`, and `utils/config.ts`.
  Template-only content lives under `app/demo`, `app/landing`,
  `components/demos`, `components/landing`, `components/landing-premium`,
  `components/sections`, `lib/demo-data.ts`, and `public/brand`.

- `apps/server`
  Express service. `src/app.ts` mounts Better Auth, JSON middleware, tRPC, and
  `/health`. `src/server.ts` handles process startup and clustering.

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

- `toolings/eslint-config`
  Shared ESLint presets for backend, Next.js, and shared React packages.

- `toolings/typescript-config`
  Shared TS base configs extended by apps and packages.

- `toolings/scripts`
  Repo utility scripts for scope migration, redundancy auditing, and
  start-fresh cleanup.

- `tests`
  Test workspace for repo tooling and future broader coverage. It now contains
  real Bun tests for the repo scripts, but it is not a full app-level safety
  net yet.

## Task Routing

- Auth changes:
  `packages/auth`, `packages/trpc/src/trpc.ts`, `apps/server/src/app.ts`,
  `apps/web/components/demos/auth-flow.tsx`
- API/router changes:
  `packages/trpc`, `apps/server/src/app.ts`, `apps/web/trpc/*`
- Database and schema changes:
  `packages/store/prisma/schema.prisma`, `packages/store/src/index.ts`,
  `packages/store/src/scripts/seed.ts`
- Shared frontend primitives:
  `packages/ui/src/components`, `packages/ui/src/styles/globals.css`
- Web app shell or providers:
  `apps/web/app/layout.tsx`, `apps/web/components/providers.tsx`,
  `apps/web/trpc/*`
- Template cleanup:
  `docs/start-fresh.md` and `apps/web/AGENTS.md`
- Tooling changes:
  `toolings/*` and the local `AGENTS.md` there

## Common Commands

- `bun install`
  Install workspace dependencies and trigger Prisma generate via `postinstall`.
- `bun dev`
  Run all workspace dev tasks through Turbo.
- `bun run dev:web`
  Run only the Next.js app.
- `bun run dev:server`
  Run only the Express server.
- `bun run dev:worker`
  Run only the worker.
- `bun run build`
  Build the workspace.
- `bun run lint`
  Lint code and markdown.
- `bun run check-types`
  Run workspace type checks.
- `bun run db:generate`
  Generate Prisma client.
- `bun run db:migrate`
  Run Prisma migrate dev via Turbo.
- `bun run db:seed`
  Seed the database.
- `bun run db:studio`
  Open Prisma Studio.
- `bun run rename-scope:dry`
  Preview replacing `@template/*` package names with the root package name.
- `bun run rename-scope`
  Apply the scope rename across the repo.
- `bun run repo:doctor`
  Audit the repo for stale scaffolding, broken exports, placeholder files, and
  doc drift.
- `bun run repo:doctor:strict`
  Fail on warnings and errors for CI or pre-release checks.
- `bun run template:clean:dry`
  Preview the start-fresh cleanup plan for removing showcase code and optional
  workspaces.
- `bun run template:clean`
  Apply the recommended start-fresh cleanup plan.
- `bun run commit:check`
  Validate the most recent commit message against the repo commit convention.

## Environment Names

- Client:
  `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, `NODE_ENV`
- Server:
  `PORT`, `FRONTEND_URL`, `DATABASE_URL`, `REDIS_URL`,
  `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `NODE_ENV`
- Optional social auth:
  `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID`,
  `GOOGLE_CLIENT_SECRET`

`apps/server/.env.example` is the safe example source for the backend keys.

## Commit Convention

Commit messages are linted with Conventional Commits via Husky and commitlint.

- Preferred format:
  `type(scope): short imperative summary`
- Common types:
  `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `build`, `ci`
- Example:
  `feat(auth): add GitHub provider configuration`

## Start-Fresh Bias

If the goal is a new product instead of a preserved template showcase, read
`docs/start-fresh.md` before editing UI routes. A large part of `apps/web` is
safe to remove once you decide not to keep the landing/demo experience.
