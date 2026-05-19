# Production environment matrix

Canonical list for deploy targets. Step-by-step setup: [deployment.md](./deployment.md).

Legend: **R** = required, **O** = optional, **—** = do not set, **auto** = platform sets.

| Variable                       | Web (Vercel)        | API (Vercel)       | API (Render)           | Worker (Render)      |
| ------------------------------ | ------------------- | ------------------ | ---------------------- | -------------------- |
| `NEXT_PUBLIC_APP_URL`          | R                   | —                  | —                      | —                    |
| `NEXT_PUBLIC_API_URL`          | R                   | —                  | —                      | —                    |
| `NEXT_PUBLIC_SITE_URL`         | O                   | —                  | —                      | —                    |
| `NEXT_PUBLIC_SITE_NAME`        | O                   | —                  | —                      | —                    |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | O                   | —                  | —                      | —                    |
| `DATABASE_URL`                 | —                   | R                  | R                      | R if jobs use Prisma |
| `REDIS_URL`                    | —                   | R if queues        | R if queues            | R                    |
| `ENABLE_REDIS`                 | —                   | O (default `true`) | O (default `true`)     | —                    |
| `BETTER_AUTH_SECRET`           | —                   | R (32+ chars)      | R                      | —                    |
| `BETTER_AUTH_URL`              | —                   | R (public API URL) | R                      | —                    |
| `FRONTEND_URL`                 | —                   | R (Vercel web URL) | R                      | —                    |
| `NODE_ENV`                     | auto / `production` | `production`       | `production`           | `production`         |
| `HOST`                         | —                   | —                  | R (`0.0.0.0`)          | —                    |
| `PORT`                         | —                   | —                  | **—** (Render injects) | —                    |
| `RENDER`                       | —                   | —                  | auto                   | O                    |
| `VERCEL`                       | auto on web         | auto on API        | —                      | —                    |

## Notes

- **Web project** must not receive `DATABASE_URL` or `BETTER_AUTH_SECRET` unless you also deploy the API on Vercel (Path A puts secrets on the **server** project only).
- **`NEXT_PUBLIC_API_URL`** must match the public API origin (Path A: `*.vercel.app`; Path B: `*.onrender.com`).
- **`ENABLE_REDIS=false`**: API-only, no `/admin/queues`, no worker. Omit `REDIS_URL` when disabled.
- **OAuth** (optional on API): `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — both IDs required if either is set.

## Local development

- `apps/web/.env.example` → `apps/web/.env.local`
- `apps/server/.env.example` → `apps/server/.env`

See [env.md](./env.md).
