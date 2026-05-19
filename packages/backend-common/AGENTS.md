# Backend Common Notes

Shared backend utilities for `apps/server` and `apps/worker`.

## Read first

- `src/env.ts` — `serverEnv` (t3-env)
- `src/utils/validate-env.ts` — startup validation
- `src/utils/redis-enabled.ts` — `ENABLE_REDIS`, `resolveRedisUrl`
- `src/redis/index.ts` — ioredis client
- `package.json` — subpath exports

## Owns

- Backend env schema and validation
- Redis (ioredis) and Bull connection helpers
- Winston logger factory

## Common tasks

- New env keys: `src/env.ts` + `validate-env.ts` + `apps/server/.env.example`
- Redis behavior: `src/redis/index.ts`, `redis-enabled.ts`

## Update when

Env schemas, Redis wiring, logger, or exports change.
