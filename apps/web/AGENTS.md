# Web App Notes

## Purpose

Next.js App Router frontend: runtime wiring + template showcase UI. Deploy on Vercel; `NEXT_PUBLIC_API_URL` may point to Path A (`*.vercel.app`), Path B (`*.onrender.com`), or Path C (`*.up.railway.app`).

- Production default: [docs/production-playbook.md](../../docs/production-playbook.md)
- Deploy hub: [docs/deployment.md](../../docs/deployment.md)
- Build: `bun run build --filter=@template/web` (Vercel uses app root `apps/web`)

## Read first

- `app/layout.tsx` — metadata (`metadataBase` from `NEXT_PUBLIC_SITE_URL`)
- `trpc/server.tsx` — `trpcCaller` for RSC; HTTP `trpc` proxy for client components
- `trpc/client.tsx` — browser client
- `components/providers.tsx`
- `env.ts`

## Data fetching (tRPC)

- **Server Components / server actions:** `const api = await trpcCaller()` then `api.<router>.<proc>()`. Uses `createCaller` in-process (session + Prisma)—no HTTP loopback to the API.
- **Client components:** hooks via `trpc` from `@/trpc/client` (HTTP to `NEXT_PUBLIC_API_URL`).
- **Prefetch + hydrate:** `prefetch()` + `HydrateClient` for client-bound queries.

## Owns

- App Router pages, marketing/demo routes, providers, public assets

## Template cleanup

If starting fresh: `app/demo`, `app/landing`, `components/demos`, `components/landing*`, `lib/demo-data.ts`.

## Update when

Routes, providers, tRPC wiring, or env names change.
