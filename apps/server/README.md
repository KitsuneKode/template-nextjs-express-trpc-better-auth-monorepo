# Server Workspace

Express API with module-first layout (`src/modules/*`).

- `src/app.ts` — middleware + route mounts
- `src/server.ts` — listen on `HOST` (default `0.0.0.0`) and `PORT` for Render/Railway
- `AGENTS.md` — architecture map

## Render

1. Provision **Postgres** + **Redis** (or Upstash) on Render.
2. Deploy via root `render.yaml` or Docker (`apps/server/Dockerfile`, context = repo root).
3. Set `FRONTEND_URL`, `BETTER_AUTH_URL` (public API URL), `BETTER_AUTH_SECRET`, `DATABASE_URL`, `REDIS_URL`.
4. Verify: `curl https://<service>.onrender.com/health`

See generated `docs/deployment.md` after scaffold, or `../../docs/deployment-platforms.md`.
