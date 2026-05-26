# Web App Notes

## Purpose

Next.js App Router frontend: runtime wiring + template showcase UI. Deploy on Vercel; `NEXT_PUBLIC_API_URL` may point to Path A (`*.vercel.app`), Path B (`*.onrender.com`), or Path C (`*.up.railway.app`).

- Production default: [docs/production-playbook.md](../../docs/production-playbook.md)
- Deploy hub: [docs/deployment.md](../../docs/deployment.md)
- Build: `bun run build --filter=@arche-template/web` (Vercel uses app root `apps/web`)

## Before push (web changes)

Web-only shortcuts are **not** enough for pushes to `main` / `prod` — CI runs **full-monorepo** `lint` and `check-types`. From repo root, always run:

```bash
bun run ci
```

When iterating on `apps/web` only, use this **fast loop** (then still run full `bun run ci` before push):

```bash
bun run format:check          # or bun run format to fix
bun run --cwd apps/web mdx:generate   # after content/docs or content/blog MDX edits
bunx turbo run lint check-types --filter=@arche-template/web
bun test apps/web
bun run build --filter=@arche-template/web
```

If you touched `packages/registry`, `packages/ui`, or shared toolings, run step 2 **without** `--filter` (or use full `bun run ci`).

## Read first

- [`../../PRODUCT.md`](../../PRODUCT.md) - product voice, truthful-claim rules, and accessibility bar
- [`.docs/product/web-brand-ui-brief.md`](../../.docs/product/web-brand-ui-brief.md) - public-site direction and current web work slices
- [`.docs/product/verification-matrix.md`](../../.docs/product/verification-matrix.md) - only source for public preset support claims
- `app/layout.tsx` — metadata (`metadataBase` from `NEXT_PUBLIC_SITE_URL`)
- `trpc/server.tsx` — `trpcCaller` for RSC; HTTP `trpc` proxy for client components
- `trpc/client.tsx` — browser client
- `components/providers.tsx` — theme only (no root `TRPCReactProvider`; use `trpc/client` when a route needs hooks)
- `env.ts`

## Data fetching (tRPC)

- **Server Components / server actions:** `const api = await trpcCaller()` then `api.<router>.<proc>()`. Uses `createCaller` in-process (session + Prisma)—no HTTP loopback to the API.
- **Client components:** hooks via `trpc` from `@/trpc/client` (HTTP to `NEXT_PUBLIC_API_URL`).
- **Prefetch + hydrate:** `prefetch()` + `HydrateClient` for client-bound queries.

## Owns

- App Router pages, marketing/demo routes, providers, public assets

## Public content map

- **Docs (Fumadocs MDX):** All public docs live in `content/docs/**` (~34 pages), rendered at `/docs/*` via `app/docs/[[...slug]]/page.tsx`, `lib/source.ts`, and `.source/server.ts` (run `bun run mdx:generate` / `postinstall` before `check-types`). IA in `content/docs/meta.json` + `components/docs/docs-sidebar.tsx` (walkthroughs, polyglot architecture, operations depth). Reading UX: `DocsTocRail`, `PackageManagerTabs`, `Mermaid` MDX component. `/docs` redirects to `/docs/getting-started` in `next.config.js`. Legacy paths (`/docs/auth`, `/docs/deploy`, …) redirect to `packages/*` and `operations/*` MDX routes. Tests: `app/docs-links.test.ts`.
- **Blog:** MDX in `content/blog/` (author template: `BLOG-AUTHORING.md`); Fumadocs via `lib/blog-source.ts`; SEO helpers in `lib/blog.ts`; RSS at `/rss.xml`; static index at `/blog` and `/blog/category/[category]`; per-post OG at `/blog/[slug]/opengraph-image`; favicon `app/icon.svg` must match `public/brand/arche-mark.svg`. Tests: `app/blog-seo.test.ts`.
- **Presets table:** `lib/presets-public.ts` (re-exports `packages/registry` display data).
- **Syntax highlighting:** `lib/highlight.ts` + Shiki; examples page calls `connection()` before highlight (Cache Components).
- **Showcase:** `/showcase` returns 404 in production (`NODE_ENV === 'production'`).
- **Design lab:** `/__design-lab` stays noindex; reference mockups 1, 5, 7, 10, 14 for brand direction.

## Template cleanup

If starting fresh: `app/demo`, `app/landing`, `components/demos`, `components/landing*`, `lib/demo-data.ts`.

## Update when

Routes, providers, tRPC wiring, or env names change.
