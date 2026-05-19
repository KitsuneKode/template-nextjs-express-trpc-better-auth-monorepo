# Environment variables (local)

Production matrix (all deploy targets): [deployment-env.md](./deployment-env.md).

## Local setup

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env
```

Run Postgres + Redis via `docker compose` (from CLI scaffold) or local installs.

## Quick reference (development)

**Web** (`apps/web/.env.local`): `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`.

**Server** (`apps/server/.env`): `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_URL`, `ENABLE_REDIS`, `REDIS_URL`, `PORT`, `HOST`.

See `apps/server/.env.example` and `packages/backend-common/src/env.ts` for validation rules.
