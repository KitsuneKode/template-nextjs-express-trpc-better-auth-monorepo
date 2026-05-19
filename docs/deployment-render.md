# Deploy API to Render

Web on Vercel, API on Render. Env matrix: [deployment-env.md](./deployment-env.md).

## Your error: `Missing required: REDIS_URL`

You are on a **manual Native Bun** service without Redis wired. Fix **one** of these:

1. **Recommended:** Delete that service → **Blueprints → New Blueprint Instance** → this repo → applies [`render.yaml`](../render.yaml) (Postgres + Redis + Docker API).
2. **Keep manual service:** Render Dashboard → **Key Value** → create instance → copy **Internal Redis URL** → Environment → `REDIS_URL` = that value → redeploy.
3. **API only (no queues):** Environment → `ENABLE_REDIS=false` → redeploy (no `/admin/queues`, worker won't work).

Also fix **Start command** to:

```bash
cd apps/server && HOST=0.0.0.0 bun run start
```

Not `bun run apps/server/dist/server.js` from the repo root.

## Recommended: Blueprint (Docker)

Use the root [`render.yaml`](../render.yaml) so Postgres, Key Value (Redis), and the API are provisioned together.

1. **Stop or delete** any old manual Native Bun service so names and env do not conflict.
2. **Dashboard → Blueprints → New Blueprint Instance** → connect this repo.
3. After the first deploy, set in **Environment** (sync: false in the blueprint):
   - `FRONTEND_URL` — Vercel URL (e.g. `https://my-app.vercel.app`)
   - `BETTER_AUTH_URL` — public API URL (e.g. `https://arche-template-api.onrender.com`)
4. Run database migrations against Blueprint Postgres (Render shell or local with copied `DATABASE_URL`):

```bash
bun run db:migrate
```

5. On Vercel (`apps/web`): `NEXT_PUBLIC_API_URL` = same API URL; `NEXT_PUBLIC_APP_URL` = Vercel URL. See [deployment-env.md](./deployment-env.md).

6. Redeploy if needed, then verify:

```bash
curl -sS "https://<your-service>.onrender.com/"
curl -sS "https://<your-service>.onrender.com/health"
```

The blueprint does **not** set `PORT`. Render injects `PORT` at runtime; the server reads `process.env.PORT` (see `apps/server/src/server.ts`).

## Manual Native Bun (no Docker)

| Setting        | Value                                                    |
| -------------- | -------------------------------------------------------- |
| Root directory | `.` (monorepo root)                                      |
| Runtime        | **Bun** (repo `.bun-version` pins 1.2.x)                 |
| Build command  | `bun install && bun run build --filter=@template/server` |
| Start command  | `cd apps/server && HOST=0.0.0.0 bun run start`           |

**Do not use** `bun run apps/server/dist/server.js` from the repo root — wrong working directory and module resolution, process exits before Render sees an open port.

### Required environment variables

| Variable             | Notes                                          |
| -------------------- | ---------------------------------------------- |
| `DATABASE_URL`       | Render Postgres or external                    |
| `REDIS_URL`          | Render Key Value, Upstash, etc. (**required**) |
| `FRONTEND_URL`       | Exact browser origin for CORS                  |
| `BETTER_AUTH_URL`    | Public HTTPS API URL                           |
| `BETTER_AUTH_SECRET` | 32+ characters                                 |
| `HOST`               | `0.0.0.0`                                      |
| `NODE_ENV`           | `production`                                   |
| `PORT`               | **Do not set** — Render assigns automatically  |
| `RENDER`             | Set automatically on Render (`true`)           |

`bun install` at repo root runs `postinstall` → Prisma client generation.

## Failure: "No open ports detected" / Exited with status 1

Render reports this when nothing listens on the injected `PORT` before the deploy health window ends. Common causes:

### 1. Wrong start command

Symptom: immediate exit, little or no app log output.

**Fix:** `cd apps/server && HOST=0.0.0.0 bun run start` (runs `bun ./dist/server.js` with correct cwd).

### 2. Missing `REDIS_URL` or `DATABASE_URL`

Symptom: logs show `Environment validation failed` or `Redis connection failed`.

**Fix:** Set all required variables above, or create a **new Blueprint** stack from `render.yaml` (wires `REDIS_URL` from Key Value and `DATABASE_URL` from Postgres).

### 3. Hardcoded `PORT` in the dashboard

Symptom: app listens on 8080 but Render probes another port.

**Fix:** Remove custom `PORT` from service settings; only use Render’s injected value.

### 4. Redis connect before listen (older builds)

Current `server.ts` calls `app.listen` first, then `connectRedis()`, so port detection succeeds even if Redis is slow. Redis failure still exits the process after listen with a clear stderr message.

### 5. Bun 1.1 default on Render

Use repo [`.bun-version`](../.bun-version) (e.g. `1.2.18`). Older Bun builds lacked APIs the bundle expected.

## Endpoints

| Path          | Purpose                        |
| ------------- | ------------------------------ |
| `GET /`       | Service metadata JSON          |
| `GET /health` | Load balancer health (DB ping) |
| `/api/trpc`   | tRPC                           |
| `/api/auth`   | Better Auth                    |

## Related

- [`apps/server/README.md`](../apps/server/README.md)
- [`docs/deployment-platforms.md`](./deployment-platforms.md)
- Generated scaffold guide: `docs/deployment.md` (from `@arche/create`)
