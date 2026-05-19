# Environment variables by platform

One place to see what goes where. Avoid copying the entire backend `.env` onto Vercel.

## Vercel (`apps/web` only)

| Variable                       | Example                       |
| ------------------------------ | ----------------------------- |
| `NEXT_PUBLIC_APP_URL`          | `https://my-app.vercel.app`   |
| `NEXT_PUBLIC_API_URL`          | `https://my-api.onrender.com` |
| `NEXT_PUBLIC_SITE_URL`         | Same as app URL               |
| `NEXT_PUBLIC_SITE_NAME`        | `My App`                      |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Short tagline                 |

No `DATABASE_URL`, `REDIS_URL`, or `BETTER_AUTH_SECRET` on the frontend project unless you also deploy the API on Vercel.

## Render / Railway / Docker (`apps/server`)

| Variable             | Required       | Notes                                                                    |
| -------------------- | -------------- | ------------------------------------------------------------------------ |
| `DATABASE_URL`       | Yes            | Postgres connection string                                               |
| `REDIS_URL`          | If queues      | From Key Value / Redis plugin, or omit with `ENABLE_REDIS=false`         |
| `ENABLE_REDIS`       | No             | Default `true`. Set `false` for API-only (no worker, no `/admin/queues`) |
| `BETTER_AUTH_SECRET` | Yes            | 32+ random characters                                                    |
| `BETTER_AUTH_URL`    | Yes            | Public API URL (`https://…`)                                             |
| `FRONTEND_URL`       | Yes            | Vercel URL (CORS + auth)                                                 |
| `HOST`               | Yes            | `0.0.0.0`                                                                |
| `PORT`               | **Do not set** | Platform injects                                                         |
| `NODE_ENV`           | Yes            | `production`                                                             |

## Worker (`apps/worker` — second service)

| Variable       | Required           |
| -------------- | ------------------ |
| `REDIS_URL`    | Yes                |
| `DATABASE_URL` | If jobs use Prisma |

## Local development

Copy:

- `apps/web/.env.example` → `apps/web/.env.local`
- `apps/server/.env.example` → `apps/server/.env`

Run Postgres + Redis via `docker compose` (from CLI scaffold) or local installs.

See [deployment-render.md](./deployment-render.md) for Render Blueprint steps.
