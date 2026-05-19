# Path C — Vercel web + Railway API

Hub: [deployment.md](./deployment.md). Env matrix: [deployment-env.md](./deployment-env.md). Default stack comparison: [production-playbook.md](./production-playbook.md).

`apps/web` on Vercel (recommended) or Railway. `apps/server` on Railway as **Docker** with **Neon** (`DATABASE_URL`) and **Upstash** (`REDIS_URL`) — same env names as Path A and Path B.

## Prerequisites

1. [Neon](https://neon.tech) Postgres — copy connection string.
2. [Upstash](https://upstash.com) Redis — copy `rediss://` URL, or plan for `ENABLE_REDIS=false`.
3. Vercel project for `apps/web` (see [deployment-vercel.md](./deployment-vercel.md) Project 1).

## Deploy API on Railway

1. **New Project** → **Deploy from GitHub repo** → select this monorepo.
2. Add a **service** for the API:
   - **Builder:** Dockerfile
   - **Dockerfile path:** `apps/server/Dockerfile`
   - **Root directory:** repository root (`.`) — required for `turbo prune` in the Dockerfile
   - Or use root [`railway.toml`](../railway.toml) if Railway detects it automatically
3. **Variables** (service → Variables):

| Key                  | Value                                        |
| -------------------- | -------------------------------------------- |
| `DATABASE_URL`       | Neon connection string                       |
| `REDIS_URL`          | Upstash URL (or omit + `ENABLE_REDIS=false`) |
| `ENABLE_REDIS`       | `true` or `false`                            |
| `BETTER_AUTH_SECRET` | 32+ random characters                        |
| `BETTER_AUTH_URL`    | `https://<your-api>.up.railway.app`          |
| `FRONTEND_URL`       | Vercel web URL                               |
| `NODE_ENV`           | `production`                                 |
| `HOST`               | `0.0.0.0`                                    |

Railway injects `PORT`; do not hardcode it in the dashboard.

4. **Networking** → generate a public domain for the API service.
5. Migrations (local shell with production `DATABASE_URL`):

```bash
bun run db:migrate
```

6. Vercel web: `NEXT_PUBLIC_API_URL` = Railway public API URL (no trailing slash).

## Smoke tests

```bash
curl -sS "https://<your-api>.up.railway.app/health"
curl -sS "https://<your-api>.up.railway.app/"
```

Sign in on the web app; confirm tRPC and Better Auth cookies/CORS.

## Optional worker

Deploy `apps/worker` as a second Railway service (or Render Path B) with the same `REDIS_URL` and `DATABASE_URL` if jobs use Prisma. Not required for API + web only.

## Troubleshooting

### `Missing required: REDIS_URL`

Set `REDIS_URL` from Upstash, or `ENABLE_REDIS=false` (no queues, no `/admin/queues`).

### Health check fails

- Confirm Dockerfile build context is repo root.
- Check logs for `Environment validation failed` (missing `DATABASE_URL` / auth vars).
- Health path: `/health`.

### CORS / auth redirect loops

`FRONTEND_URL` and `BETTER_AUTH_URL` must be exact HTTPS origins for production (no trailing slash on API base for auth).

## Related

- Path A (all Vercel): [deployment-vercel.md](./deployment-vercel.md)
- Path B (Render API): [deployment-render.md](./deployment-render.md)
- [apps/server/README.md](../apps/server/README.md)
