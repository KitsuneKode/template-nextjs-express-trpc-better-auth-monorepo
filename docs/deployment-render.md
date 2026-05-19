# Deploy API to Render

This guide covers the Express API in `apps/server` on [Render](https://render.com). The web app (`apps/web`) stays on Vercel; point `NEXT_PUBLIC_API_URL` at the Render service URL.

## Recommended: Blueprint (Docker)

Use the root [`render.yaml`](../render.yaml) so Postgres, Key Value (Redis), and the API are provisioned together.

1. **Dashboard → Blueprints → New Blueprint Instance** → connect this repo.
2. After the first deploy, set in **Environment** (sync: false in the blueprint):
   - `FRONTEND_URL` — Vercel URL (e.g. `https://my-app.vercel.app`)
   - `BETTER_AUTH_URL` — public API URL (e.g. `https://arche-template-api.onrender.com`)
3. Redeploy if needed, then verify:

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
