# KitsuneKode Vercel projects (Path A reference)

Dashboard:

- Web: [template-web](https://vercel.com/kitsunekode/template-web)
- API: [template-server](https://vercel.com/kitsunekode/template-server)

Production URLs (team alias `kitsunekode`):

| Project           | URL                                              |
| ----------------- | ------------------------------------------------ |
| `template-web`    | `https://template-web-kitsunekode.vercel.app`    |
| `template-server` | `https://template-server-kitsunekode.vercel.app` |

Repo config: [apps/web/vercel.json](../apps/web/vercel.json), [apps/server/vercel.json](../apps/server/vercel.json). General Path A guide: [deployment-vercel.md](./deployment-vercel.md).

## Project settings (confirm in dashboard)

### template-web

| Setting        | Value          |
| -------------- | -------------- |
| Root Directory | `apps/web`     |
| Framework      | Next.js        |
| Node           | 24.x (default) |

`vercel.json` runs `bun install` from the monorepo root, then `bun run build` in `apps/web`.

### template-server

| Setting        | Value         |
| -------------- | ------------- |
| Root Directory | `apps/server` |
| Runtime        | Bun 1.x       |

Entry: [apps/server/src/vercel-handler.ts](../apps/server/src/vercel-handler.ts) (`package.json` `main`). Build: `turbo run build:vercel --filter=@arche-template/server`.

## Environment — copy/paste matrix

Set on **template-web** (Production + Preview):

```env
NEXT_PUBLIC_APP_URL=https://template-web-kitsunekode.vercel.app
NEXT_PUBLIC_SITE_URL=https://template-web-kitsunekode.vercel.app
NEXT_PUBLIC_API_URL=https://template-server-kitsunekode.vercel.app
NEXT_PUBLIC_SITE_NAME=Arche
NEXT_PUBLIC_SITE_DESCRIPTION=Full-stack TypeScript monorepo template — auth, database, API, and frontend wired and ready.
```

Set on **template-server** (Production + Preview):

```env
NODE_ENV=production
DATABASE_URL=<neon-postgres-url>
BETTER_AUTH_SECRET=<32+-char-secret>
BETTER_AUTH_URL=https://template-server-kitsunekode.vercel.app
FRONTEND_URL=https://template-web-kitsunekode.vercel.app
ENABLE_REDIS=false
```

When enabling queues: `ENABLE_REDIS=true`, `REDIS_URL=<upstash-rediss-url>`. Do not deploy `apps/worker` on Vercel.

Secrets (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `REDIS_URL`) belong only on **template-server**, never on template-web.

## Deployment protection

`template-server` may return **401** for unauthenticated requests when Vercel Deployment Protection is on. For smoke tests, add `VERCEL_PROTECTION_BYPASS` in CI or disable protection for the API project. See [deploy-smoke.md](./deploy-smoke.md).

## Smoke tests

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://template-web-kitsunekode.vercel.app/
curl -sS -o /dev/null -w "%{http_code}\n" https://template-server-kitsunekode.vercel.app/health
```

Expect `200` when the API is deployed, env is valid, and protection allows access.

## Related

- [deployment-env.md](./deployment-env.md) — full variable matrix
- [production-playbook.md](./production-playbook.md) — migrations and auth checklist
