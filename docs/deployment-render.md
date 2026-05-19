# Path B — Vercel web + Render API

Hub: [deployment.md](./deployment.md). Env matrix: [deployment-env.md](./deployment-env.md).

`apps/web` stays on Vercel. `apps/server` runs on Render as **Docker** (recommended). Postgres and Redis can be Render-managed (Blueprint) or **external URLs** (Neon, Upstash).

## Variant B1 — Blueprint (demo / one-click)

Root [`render.yaml`](../render.yaml) provisions API + Postgres + Key Value.

1. Stop or delete any old manual Native Bun service that conflicts.
2. **Dashboard → Blueprints → New Blueprint Instance** → connect repo.
3. After deploy, set **Environment** (sync: false in blueprint):
   - `FRONTEND_URL` — Vercel web URL
   - `BETTER_AUTH_URL` — `https://<arche-template-api>.onrender.com`
4. Migrate: `bun run db:migrate` with Blueprint `DATABASE_URL`.
5. Vercel web: `NEXT_PUBLIC_API_URL` = same API URL — [deployment-env.md](./deployment-env.md).

```bash
curl -sS "https://<your-service>.onrender.com/"
curl -sS "https://<your-service>.onrender.com/health"
```

Do **not** set `PORT` manually. Health check path: `/health`.

Docker builds pin Bun to [`.bun-version`](../.bun-version). If build fails with `lockfile had changes, but lockfile is frozen`, pull latest `main` (pinned `oven/bun:1.3.12` in [Dockerfile](../apps/server/Dockerfile)).

## Variant B2 — API-only on Render (external DB/Redis)

Use [`render.api-only.yaml`](../render.api-only.yaml): Docker web service only. Set in dashboard:

- `DATABASE_URL` — Neon / Supabase / etc.
- `REDIS_URL` — Upstash / etc., or `ENABLE_REDIS=false`
- `FRONTEND_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`

Same env names as Path A Vercel server — [deployment-vercel.md](./deployment-vercel.md).

| Setting      | Value                    |
| ------------ | ------------------------ |
| Runtime      | Docker                   |
| Dockerfile   | `apps/server/Dockerfile` |
| Context      | repo root `.`            |
| Health check | `/health`                |

## Optional worker

Deploy `apps/worker` as a second Render service with `REDIS_URL` (+ `DATABASE_URL` if jobs use Prisma). Not required for basic API + web.

## Troubleshooting

### `Missing required: REDIS_URL`

Manual service without Redis. Fix one of:

1. **Blueprint** from `render.yaml` (wires `REDIS_URL`).
2. Add **Key Value** → paste internal URL as `REDIS_URL`.
3. `ENABLE_REDIS=false` (no queues, no `/admin/queues`).

Wrong start command for Native Bun (discouraged):

```bash
cd apps/server && HOST=0.0.0.0 bun run start
```

Not `bun run apps/server/dist/server.js` from repo root.

### "No open ports detected"

- Wrong start command or crash before `listen()` — see [server.ts](../apps/server/src/server.ts) (listen first, then Redis).
- Missing `DATABASE_URL` / `REDIS_URL` — check logs for `Environment validation failed`.
- Custom `PORT` in dashboard — remove; Render injects `PORT`.

### Manual Native Bun (discouraged vs Docker)

| Setting        | Value                                                    |
| -------------- | -------------------------------------------------------- |
| Root directory | `.`                                                      |
| Build          | `bun install && bun run build --filter=@template/server` |
| Start          | `cd apps/server && HOST=0.0.0.0 bun run start`           |

Prefer Docker blueprint or B2.

## Endpoints

| Path          | Purpose          |
| ------------- | ---------------- |
| `GET /`       | Service metadata |
| `GET /health` | Health (DB ping) |
| `/api/trpc`   | tRPC             |
| `/api/auth`   | Better Auth      |

## Related

- [apps/server/README.md](../apps/server/README.md)
- Path A (all Vercel): [deployment-vercel.md](./deployment-vercel.md)
