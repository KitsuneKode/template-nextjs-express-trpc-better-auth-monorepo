# Path A — Vercel (web + API)

Hub: [deployment.md](./deployment.md). Env matrix: [deployment-env.md](./deployment-env.md).

Deploy **two Vercel projects** from this monorepo. Postgres and Redis are **external** (Neon, Vercel Postgres, Upstash, etc.) — paste URLs on the **server** project.

## Project 1 — Web (`apps/web`)

| Setting        | Value                                        |
| -------------- | -------------------------------------------- |
| Root Directory | `apps/web` (or monorepo preset with web app) |
| Framework      | Next.js                                      |
| Build Command  | `bun run build` (or default)                 |
| Install        | `bun install` at repo root if using monorepo |

### Environment (web project)

| Key                            | Example                                     |
| ------------------------------ | ------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`          | `https://my-app.vercel.app`                 |
| `NEXT_PUBLIC_API_URL`          | `https://my-api.vercel.app` (Project 2 URL) |
| `NEXT_PUBLIC_SITE_URL`         | Same as app URL                             |
| `NEXT_PUBLIC_SITE_NAME`        | `My App`                                    |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Tagline                                     |

## Project 2 — API (`apps/server`)

| Setting                                   | Value                                                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Root Directory                            | `apps/server`                                                                                                      |
| Entry                                     | [vercel-handler.ts](../apps/server/src/vercel-handler.ts) (see [package.json](../apps/server/package.json) `main`) |
| [vercel.json](../apps/server/vercel.json) | Bun runtime                                                                                                        |

Build uses `build:vercel` via monorepo:

```bash
# From repo root (CI / local check)
bun run build:vercel --filter=@template/server
```

In Vercel project settings, if you set a custom build from monorepo root:

```bash
cd ../.. && bun install && bun run build:vercel --filter=@template/server
```

### Environment (server project)

| Key                  | Example                                            |
| -------------------- | -------------------------------------------------- |
| `DATABASE_URL`       | `postgresql://...` (Neon / Vercel Postgres / etc.) |
| `BETTER_AUTH_SECRET` | 32+ random characters                              |
| `BETTER_AUTH_URL`    | `https://my-api.vercel.app`                        |
| `FRONTEND_URL`       | `https://my-app.vercel.app`                        |
| `REDIS_URL`          | `rediss://...` (Upstash) — or `ENABLE_REDIS=false` |
| `NODE_ENV`           | `production`                                       |

Do **not** set `HOST` / `PORT` for Vercel serverless.

## Database migrations

With production `DATABASE_URL` in your shell:

```bash
bun run db:migrate
```

## Smoke tests

```bash
curl -sS "https://my-api.vercel.app/health"
curl -sS "https://my-api.vercel.app/"
```

Open the web URL; confirm auth and API calls. `BETTER_AUTH_URL` and `FRONTEND_URL` must be exact HTTPS origins (no trailing slash on API URL for auth base).

## Limits

- Serverless timeouts and cold starts apply to Express on Vercel.
- **Worker / BullMQ**: not supported on Vercel serverless. Use Path B ([deployment-render.md](./deployment-render.md)) for `apps/worker` and `/admin/queues`, or set `ENABLE_REDIS=false`.

## Related

- [apps/server/README.md](../apps/server/README.md)
- Path B if you outgrow serverless: [deployment-render.md](./deployment-render.md)
