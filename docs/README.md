# Repository docs

**Arche** — Bun + Turborepo monorepo template: Next.js, Express, Better Auth, Prisma, tRPC, shared UI. CLI: `npx arche create`.

**Agents:** start at root [AGENTS.md](../AGENTS.md), then this index.

## Navigate

| Need                              | Doc                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| **Deploy (start)**                | [deployment.md](./deployment.md)                                                         |
| **Production playbook (default)** | [production-playbook.md](./production-playbook.md)                                       |
| Env matrix (production)           | [deployment-env.md](./deployment-env.md)                                                 |
| CI (GitHub Actions)               | [ci.md](./ci.md)                                                                         |
| Path A — Vercel web + API         | [deployment-vercel.md](./deployment-vercel.md)                                           |
| Path B — Vercel web + Render API  | [deployment-render.md](./deployment-render.md)                                           |
| Path C — Vercel web + Railway API | [deployment-railway.md](./deployment-railway.md)                                         |
| Commands                          | [commands.md](./commands.md)                                                             |
| Env (local dev)                   | [env.md](./env.md)                                                                       |
| Architecture                      | [architecture.md](./architecture.md)                                                     |
| Troubleshooting                   | [troubleshooting.md](./troubleshooting.md)                                               |
| CLI development                   | [cli-development.md](./cli-development.md)                                               |
| Bootstrap CLI                     | [bootstrap-cli.md](./bootstrap-cli.md)                                                   |
| Portfolio sync                    | [portfolio-sync.md](./portfolio-sync.md)                                                 |
| Rebranding checklist              | [rebranding.md](./rebranding.md)                                                         |
| E2E / monitoring                  | [e2e-testing.md](./e2e-testing.md), [monitoring-debugging.md](./monitoring-debugging.md) |

Historical: [archive/planning/](./archive/planning/), [archive/deployment-platforms.md](./archive/deployment-platforms.md).

## Workspace map

- **`apps/web`** — Next.js App Router; `trpc/client.tsx`, `trpc/server.tsx` (`trpcCaller`), `app/layout.tsx`
- **`apps/server`** — Express; module-first `src/modules/*`; Vercel, Render, or Railway entrypoints
- **`apps/cli`** — `@arche/create` scaffold; see `apps/cli/CLI-SPEC.md`
- **`apps/worker`** — background jobs (Render when using Path B + Redis)
- **`packages/trpc`** — client contract; re-exports `AppRouter` / `createCaller` from server
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
