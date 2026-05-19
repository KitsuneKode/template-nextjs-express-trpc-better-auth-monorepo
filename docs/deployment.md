# Deployment hub

Production setup for this template: **Next.js on Vercel** plus **Express API** on Vercel, Render, or Railway. **Postgres and Redis are always external connection URLs** on the API host (Neon + Upstash recommended).

**Start here**, then the [production playbook](./production-playbook.md) (KitsuneKode default) or a path guide, plus the env matrix.

| Doc                                                | Purpose                                            |
| -------------------------------------------------- | -------------------------------------------------- |
| [production-playbook.md](./production-playbook.md) | **Default ops** — Vercel + Render + Neon + Upstash |
| [deployment-env.md](./deployment-env.md)           | Production env matrix (all projects)               |
| [deployment-vercel.md](./deployment-vercel.md)     | **Path A** — web + API on Vercel                   |
| [deployment-render.md](./deployment-render.md)     | **Path B** — web on Vercel, API on Render          |
| [deployment-railway.md](./deployment-railway.md)   | **Path C** — web on Vercel, API on Railway         |
| [env.md](./env.md)                                 | Local development only                             |

## Architecture

```text
apps/web (Vercel)  --NEXT_PUBLIC_API_URL-->  apps/server (Vercel | Render | Railway)
                                                    |
                                    DATABASE_URL, REDIS_URL (Neon, Upstash, etc.)
```

Optional: `apps/worker` on Render or Railway when using BullMQ (`REDIS_URL` required).

## Choose a path

| Question                                    | Path                                                              |
| ------------------------------------------- | ----------------------------------------------------------------- |
| KitsuneKode product default?                | **B** — follow [production-playbook.md](./production-playbook.md) |
| Want API + DB env on Vercel, minimal hosts? | **A** — [deployment-vercel.md](./deployment-vercel.md)            |
| Prefer Render Docker + Blueprint?           | **B** — [deployment-render.md](./deployment-render.md)            |
| Prefer Railway Docker?                      | **C** — [deployment-railway.md](./deployment-railway.md)          |
| Already use Neon + Upstash?                 | Any path — paste the same URLs on the API host                    |

|                  | Path A (Vercel)           | Path B (Render)                               | Path C (Railway)                                 |
| ---------------- | ------------------------- | --------------------------------------------- | ------------------------------------------------ |
| `apps/web`       | Vercel                    | Vercel (recommended)                          | Vercel or Railway                                |
| `apps/server`    | Vercel (`vercel-handler`) | Render Docker ([render.yaml](../render.yaml)) | Railway Docker ([railway.toml](../railway.toml)) |
| Postgres / Redis | Neon + Upstash URLs       | Neon + Upstash URLs                           | Neon + Upstash URLs                              |
| `apps/worker`    | Not on Vercel             | Optional Render service                       | Optional Railway service                         |
| Tradeoffs        | Serverless limits         | Blueprint, free tier cold starts              | Simple Docker deploy, usage billing              |

Do **not** provision Render Postgres or Render Key Value for this template — use Neon and Upstash (or any URL-based provider).

## Rollout order (all paths)

1. Provision **Neon** (Postgres) and **Upstash** (Redis), or set `ENABLE_REDIS=false` on the API.
2. Deploy API; set `DATABASE_URL`, auth vars, `FRONTEND_URL` / `BETTER_AUTH_URL` — see [deployment-env.md](./deployment-env.md).
3. Run migrations: `bun run db:migrate` with production `DATABASE_URL`.
4. Verify API: `curl https://<api-host>/health`.
5. Deploy web; set `NEXT_PUBLIC_API_URL` to the API host.
6. Smoke: sign-in, one tRPC call, check CORS if the browser blocks requests.

## Code entrypoints

| Host                      | File                                                                      | Role                               |
| ------------------------- | ------------------------------------------------------------------------- | ---------------------------------- |
| Vercel                    | [apps/server/src/vercel-handler.ts](../apps/server/src/vercel-handler.ts) | Export Express `app` (no `listen`) |
| Render / Railway / Docker | [apps/server/src/server.ts](../apps/server/src/server.ts)                 | `listen`, then Redis               |

Same [apps/server/src/app.ts](../apps/server/src/app.ts) for routes, auth, and tRPC.

## Historical platform guides

Multi-platform comparisons live in [archive/deployment-platforms.md](./archive/deployment-platforms.md) — not maintained for this template’s three paths.
