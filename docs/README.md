# Repository docs

Bun + Turborepo template: Next.js, Express, Better Auth, Prisma, tRPC, shared UI.

**Agents:** start at root [AGENTS.md](../AGENTS.md), then this index.

## Navigate

| Need             | Doc                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Commands         | [commands.md](./commands.md)                                                             |
| Env vars         | [env.md](./env.md) → [deployment-env.md](./deployment-env.md)                            |
| Architecture     | [architecture.md](./architecture.md)                                                     |
| Render deploy    | [deployment-render.md](./deployment-render.md)                                           |
| Other platforms  | [deployment-platforms.md](./deployment-platforms.md)                                     |
| Troubleshooting  | [troubleshooting.md](./troubleshooting.md)                                               |
| CLI development  | [cli-development.md](./cli-development.md)                                               |
| Bootstrap CLI    | [bootstrap-cli.md](./bootstrap-cli.md)                                                   |
| Portfolio sync   | [portfolio-sync.md](./portfolio-sync.md)                                                 |
| E2E / monitoring | [e2e-testing.md](./e2e-testing.md), [monitoring-debugging.md](./monitoring-debugging.md) |

Historical planning docs: [archive/planning/](./archive/planning/).

## Workspace map

- **`apps/web`** — Next.js App Router; `trpc/client.tsx`, `trpc/server.tsx` (`trpcCaller`), `app/layout.tsx`
- **`apps/server`** — Express; module-first `src/modules/*`; tRPC in `*.trpc.ts`
- **`apps/cli`** — `@arche/create` scaffold; see `apps/cli/CLI-SPEC.md`
- **`apps/worker`** — background jobs (requires Redis when used)
- **`packages/trpc`** — client contract; re-exports `AppRouter` / `createCaller` from server (not `src/routers/`)
- **`packages/store`** — Prisma
- **`packages/auth`** — Better Auth
- **`packages/backend-common`** — `serverEnv`, ioredis, logging
- **`packages/ui`** — shared components
- **`toolings/*`** — shared TS config and repo scripts

## Start fresh

Template showcase UI cleanup: [archive/start-fresh.md](./archive/start-fresh.md).

## Commands (quick)

```bash
bun install
bun dev
bun run repo:doctor
bun run db:migrate
```

Full list: [commands.md](./commands.md).
