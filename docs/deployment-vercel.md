# Path A — Vercel (web + API)

Hub: [deployment.md](./deployment.md). Env matrix: [deployment-env.md](./deployment-env.md).

Deploy **two Vercel projects** from this monorepo. Postgres and Redis are **external** (Neon, Vercel Postgres, Upstash, etc.) — paste URLs on the **server** project.

**KitsuneKode reference deploys:** [deployment-vercel-arche.md](./deployment-vercel-arche.md) (`arche` + `arche-api` dashboards, env copy/paste, live URLs).

## Troubleshooting (web build)

**`Invalid URL` / `input: 'undefined'` in `app/layout.tsx` during build**

- Cause: `NEXT_PUBLIC_SITE_URL` missing or set to a placeholder, and `skipValidation` on Vercel skipped Zod defaults.
- Fix: set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_APP_URL` to your production web URL, or rely on the template’s `VERCEL_URL` fallback (see `apps/web/env.ts`). Do not set env values to the literal string `undefined`.

**`/rss.xml` prerender: `Cannot read properties of undefined (reading 'replaceAll')`**

- Cause: optional `NEXT_PUBLIC_SITE_NAME` / `NEXT_PUBLIC_SITE_DESCRIPTION` unset while `CI=1` skips Zod defaults.
- Fix: set those keys on the web project (recommended), or redeploy after `apps/web/env.ts` runtime fallbacks (template main ≥ 2026-05-26).

## Project 1 — Web (`apps/web`)

| Setting        | Value                                                                    |
| -------------- | ------------------------------------------------------------------------ |
| Root Directory | `apps/web`                                                               |
| Framework      | Next.js                                                                  |
| Build Command  | `bun run build` (in app dir; see [vercel.json](../apps/web/vercel.json)) |
| Install        | `cd ../.. && bun install --frozen-lockfile` (monorepo root)              |

### Environment (web project)

| Key                            | Example                                                           |
| ------------------------------ | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`          | `https://my-app.vercel.app`                                       |
| `NEXT_PUBLIC_API_URL`          | `https://my-api.vercel.app` (Project 2 URL)                       |
| `NEXT_PUBLIC_SITE_URL`         | Same as app URL (optional — falls back to `VERCEL_URL` on deploy) |
| `NEXT_PUBLIC_SITE_NAME`        | `My App`                                                          |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Tagline                                                           |

## Project 2 — API (`apps/server`)

| Setting        | Value                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| Root Directory | `apps/server`                                                                                                      |
| Runtime        | Bun 1.x ([vercel.json](../apps/server/vercel.json))                                                                |
| Entry          | [vercel-handler.ts](../apps/server/src/vercel-handler.ts) (see [package.json](../apps/server/package.json) `main`) |

Install/build are defined in `apps/server/vercel.json` (monorepo root install, then `turbo run build:vercel --filter=@arche-template/server`).

Local check:

```bash
bun run build:vercel --filter=@arche-template/server
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
- **Worker / BullMQ**: not supported on Vercel serverless. Use Path B or C ([deployment-render.md](./deployment-render.md), [deployment-railway.md](./deployment-railway.md)) for `apps/worker` and `/admin/queues`, or set `ENABLE_REDIS=false`.

## Related

- [apps/server/README.md](../apps/server/README.md)
- Path B (Render) or Path C (Railway) if you outgrow serverless: [deployment-render.md](./deployment-render.md), [deployment-railway.md](./deployment-railway.md)
