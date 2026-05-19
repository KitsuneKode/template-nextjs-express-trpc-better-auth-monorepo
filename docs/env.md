# Environment variables

**Canonical matrix (Vercel vs Render vs worker):** [deployment-env.md](./deployment-env.md)

## Client (Next.js / Vercel)

- `NEXT_PUBLIC_APP_URL` — frontend URL
- `NEXT_PUBLIC_API_URL` — backend API URL
- `NEXT_PUBLIC_SITE_URL` — metadata / OG base (often same as app URL)
- `NODE_ENV` — `development` | `production`

## Server (Express / Render)

- `DATABASE_URL` — Postgres (required)
- `BETTER_AUTH_SECRET` — 32+ characters (required)
- `BETTER_AUTH_URL` — public API URL (required)
- `FRONTEND_URL` — browser origin for CORS/auth (required)
- `ENABLE_REDIS` — default `true`; set `false` for API-only (no queues, no `/admin/queues`)
- `REDIS_URL` — required when `ENABLE_REDIS=true` (Blueprint wires from Key Value)
- `HOST` — use `0.0.0.0` on Render
- `PORT` — **do not set on Render** (platform injects)

## Optional OAuth

- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`

Examples: `apps/server/.env.example`, `apps/web/.env.example`.
