# Deployment hub

Production setup for this template: **Next.js on Vercel** plus **Express API** on Vercel or Render. Postgres and Redis are always **connection URLs** on the API service (Neon, Upstash, Render-managed, etc.).

**Start here**, then open one path guide and the env matrix.

| Doc                                            | Purpose                                   |
| ---------------------------------------------- | ----------------------------------------- |
| [deployment-env.md](./deployment-env.md)       | Production env matrix (all projects)      |
| [deployment-vercel.md](./deployment-vercel.md) | **Path A** — web + API on Vercel          |
| [deployment-render.md](./deployment-render.md) | **Path B** — web on Vercel, API on Render |
| [env.md](./env.md)                             | Local development only                    |

## Architecture

```text
apps/web (Vercel)  --NEXT_PUBLIC_API_URL-->  apps/server (Vercel OR Render)
                                                    |
                                    DATABASE_URL, REDIS_URL (any provider)
```

Optional: `apps/worker` on Render (Path B) when using BullMQ queues.

## Choose a path

| Question                                            | Path                                                   |
| --------------------------------------------------- | ------------------------------------------------------ |
| Want API + DB env on Vercel, minimal hosts?         | **A** — [deployment-vercel.md](./deployment-vercel.md) |
| Need background worker, Bull Board, long-lived API? | **B** — [deployment-render.md](./deployment-render.md) |
| Already use Neon + Upstash?                         | Either path — paste the same URLs on API host          |

|                  | Path A (Vercel native)              | Path B (Render API)                           |
| ---------------- | ----------------------------------- | --------------------------------------------- |
| `apps/web`       | Vercel                              | Vercel                                        |
| `apps/server`    | Vercel (`vercel-handler`)           | Render Docker ([render.yaml](../render.yaml)) |
| Postgres / Redis | External URLs on **server** project | Blueprint-managed **or** external URLs        |
| `apps/worker`    | Not on Vercel                       | Optional Render service                       |
| Tradeoffs        | Serverless limits, cold starts      | Better for queues and 24/7 API                |

Render Postgres/Redis in the Blueprint are **convenience**, not a requirement. Path B also supports Docker-only + Neon/Upstash (same env names as Path A).

## Rollout order (both paths)

1. Provision Postgres (and Redis if `ENABLE_REDIS=true`).
2. Deploy API; set `DATABASE_URL`, auth vars, `FRONTEND_URL` / `BETTER_AUTH_URL` — see [deployment-env.md](./deployment-env.md).
3. Run migrations: `bun run db:migrate` with production `DATABASE_URL`.
4. Verify API: `curl https://<api-host>/health`.
5. Deploy web on Vercel; set `NEXT_PUBLIC_API_URL` to the API host.
6. Smoke: sign-in, one tRPC call, check CORS if the browser blocks requests.

## Code entrypoints

| Host            | File                                                                      | Role                               |
| --------------- | ------------------------------------------------------------------------- | ---------------------------------- |
| Vercel          | [apps/server/src/vercel-handler.ts](../apps/server/src/vercel-handler.ts) | Export Express `app` (no `listen`) |
| Render / Docker | [apps/server/src/server.ts](../apps/server/src/server.ts)                 | `listen`, then Redis               |

Same [apps/server/src/app.ts](../apps/server/src/app.ts) for routes, auth, and tRPC.

## Optional: API-only on Render

Use [render.api-only.yaml](../render.api-only.yaml) when Postgres and Redis live outside Render (Neon, Upstash). Details in [deployment-render.md](./deployment-render.md).

## Historical platform guides

Multi-platform comparisons live in [archive/deployment-platforms.md](./archive/deployment-platforms.md) — not maintained for this template’s two paths.
