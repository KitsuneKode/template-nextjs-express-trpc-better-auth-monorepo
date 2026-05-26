# Web App Notes

## Purpose

Next.js App Router frontend: runtime wiring + template showcase UI. Deploy on Vercel; `NEXT_PUBLIC_API_URL` may point to Path A (`*.vercel.app`), Path B (`*.onrender.com`), or Path C (`*.up.railway.app`).

- Production default: [docs/production-playbook.md](../../docs/production-playbook.md)
- Deploy hub: [docs/deployment.md](../../docs/deployment.md)
- Build: `bun run build --filter=@arche-template/web` (Vercel uses app root `apps/web`)

## Read first

- [`../../PRODUCT.md`](../../PRODUCT.md) - product voice, truthful-claim rules, and accessibility bar
- [`.docs/product/web-brand-ui-brief.md`](../../.docs/product/web-brand-ui-brief.md) - public-site direction and current web work slices
- [`.docs/product/verification-matrix.md`](../../.docs/product/verification-matrix.md) - only source for public preset support claims
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

## Public content map

- **Hybrid docs:** TSX hubs under `app/docs/*`; MDX guides under `content/docs/guides/` rendered at `/docs/guides/*` via `lib/source.ts` + `.source/server.ts` (generated: `bun run mdx:generate` / `postinstall`; required before `check-types` in CI).
- **Blog:** MDX in `content/blog/` (author template: `BLOG-AUTHORING.md`); Fumadocs via `lib/blog-source.ts`; SEO helpers in `lib/blog.ts`; RSS at `/rss.xml`; post OG at `/blog/og?title=…`; list uses Suspense for `?category=` (Cache Components).
- **Presets table:** `lib/presets-public.ts` (keep aligned with `apps/cli/src/registry/presets.ts`).
- **Syntax highlighting:** `lib/highlight.ts` + Shiki; examples page calls `connection()` before highlight (Cache Components).
- **Showcase:** `/showcase` returns 404 in production (`NODE_ENV === 'production'`).
- **Design lab:** `/__design-lab` stays noindex; reference mockups 1, 5, 7, 10, 14 for brand direction.

## Template cleanup

If starting fresh: `app/demo`, `app/landing`, `components/demos`, `components/landing*`, `lib/demo-data.ts`.

## Update when

Routes, providers, tRPC wiring, or env names change.
