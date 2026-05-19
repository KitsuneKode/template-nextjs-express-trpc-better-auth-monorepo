# Server Workspace

Express API with module-first layout (`src/modules/*`).

- `src/app.ts` — middleware + route mounts
- `src/server.ts` — listen on `HOST` (default `0.0.0.0`) and `PORT` for Render/Railway
- `AGENTS.md` — architecture map

## Render

**Full guide:** [docs/deployment-render.md](../../docs/deployment-render.md) (why deploys failed, new Blueprint steps, env checklist).

1. **Recommended:** Dashboard → **New Blueprint Instance** → repo root [`render.yaml`](../../render.yaml) (Docker + Postgres + Key Value).
2. After deploy: set `FRONTEND_URL` (Vercel) and `BETTER_AUTH_URL` (this service’s `https://…onrender.com`).
3. Verify: `curl https://<service>.onrender.com/` and `curl https://<service>.onrender.com/health`

Native Bun is documented in the deployment guide but discouraged vs Docker.
