# Server workspace

Express API, module-first layout (`src/modules/*`).

- `src/app.ts` — routes and middleware
- `src/server.ts` — Render / Docker (`listen` + Redis)
- `src/vercel-handler.ts` — Vercel serverless export
- [AGENTS.md](./AGENTS.md) — architecture map

Deploy hub: [docs/deployment.md](../../docs/deployment.md).

## Path A — Vercel

1. New Vercel project, root directory `apps/server`.
2. Env on **server** project: `DATABASE_URL`, `BETTER_AUTH_*`, `FRONTEND_URL`, `REDIS_URL` (or `ENABLE_REDIS=false`) — [deployment-env.md](../../docs/deployment-env.md).
3. Build: `bun run build:vercel --filter=@template/server`.
4. Web project: `NEXT_PUBLIC_API_URL` = this service URL.
5. `curl https://<api>.vercel.app/health`

Guide: [docs/deployment-vercel.md](../../docs/deployment-vercel.md).

## Path B — Render

1. Blueprint from [render.yaml](../../render.yaml) **or** [render.api-only.yaml](../../render.api-only.yaml) + external DB/Redis URLs.
2. Set `FRONTEND_URL`, `BETTER_AUTH_URL`; Vercel web gets `NEXT_PUBLIC_API_URL`.
3. `bun run db:migrate` with production `DATABASE_URL`.
4. Health check `/health`; do not set `PORT` in dashboard.
5. `curl https://<api>.onrender.com/health`

Guide: [docs/deployment-render.md](../../docs/deployment-render.md).
