# Agent guide (canonical)

Read this file first, then the **nearest** local `AGENTS.md` for the workspace you are editing. Use [docs/README.md](docs/README.md) for commands. Production deploy: [docs/deployment.md](docs/deployment.md) and [docs/deployment-env.md](docs/deployment-env.md).

## Core priorities

**Performance first.** **Reliability first.** Keep behavior predictable under load and during failures (session restarts, reconnects, partial streams).

If a tradeoff is required, choose **correctness and robustness** over short-term convenience.

**Maintainability:** Before adding functionality, check whether shared logic belongs in a dedicated module. Duplicate logic across files is a code smell. Do not take shortcuts with one-off local hacks—refactor existing code when it improves the system.

## How to navigate

1. Nearest `AGENTS.md` (app or package you touch).
2. [docs/README.md](docs/README.md) — index and workspace map.
3. One task-specific doc (deploy, architecture, CLI)—not the whole `docs/` tree.

Run `bun run repo:doctor` before release or after large cleanup passes.

Prefer `AGENTS.md` over package `README.md` files for agent context. When behavior or commands change, update the nearest `AGENTS.md` and the affected doc in `docs/`.

## Stack map

| Workspace                 | Role                                                                           |
| ------------------------- | ------------------------------------------------------------------------------ |
| `apps/web`                | Next.js App Router; tRPC client + `trpcCaller` for RSC                         |
| `apps/server`             | Express, Better Auth, module-first features (`src/modules/*`)                  |
| `apps/worker`             | Background jobs (Redis/BullMQ when enabled)                                    |
| `packages/trpc`           | **Client contract only** — re-exports `AppRouter` / `createCaller` from server |
| `packages/store`          | Prisma schema and client                                                       |
| `packages/auth`           | Better Auth server + client                                                    |
| `packages/backend-common` | `serverEnv`, Redis (ioredis), logging, `validate-env`                          |

tRPC procedures live in `apps/server/src/modules/<feature>/*.trpc.ts`, composed in `apps/server/src/modules/trpc/app.router.ts`.

## Deploy (production)

Hub: [docs/deployment.md](docs/deployment.md). Env matrix: [docs/deployment-env.md](docs/deployment-env.md).

- **Path A:** `apps/web` + `apps/server` on Vercel — [docs/deployment-vercel.md](docs/deployment-vercel.md) (`vercel-handler`, external `DATABASE_URL` / `REDIS_URL`).
- **Path B:** `apps/web` on Vercel, `apps/server` on Render Docker — [docs/deployment-render.md](docs/deployment-render.md) ([render.yaml](render.yaml) or [render.api-only.yaml](render.api-only.yaml) + external URLs).

Postgres and Redis are always URL-based on the API host. `ENABLE_REDIS=false` for API-only (no `/admin/queues`, no worker).

## Commands

See [docs/commands.md](docs/commands.md). Common: `bun dev`, `bun run build`, `bun run db:migrate`, `bun test`.

## Do not load by default

Historical planning and assessment docs live under [docs/archive/planning/](docs/archive/planning/). They are not implementation sources.

## Portfolio / CLI

Scaffold CLI: [apps/cli/CLI-SPEC.md](apps/cli/CLI-SPEC.md). Fullstack scaffolds may include `SHOWCASE.mdx` for portfolio sync (`kitsunekode.in`).
