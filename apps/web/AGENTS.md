# Web App Notes

## Purpose

`apps/web` is the Next.js App Router frontend. It contains both real runtime
wiring and a large amount of template showcase UI.

## Read First

- `app/layout.tsx`
- `app/page.tsx`
- `components/providers.tsx`
- `trpc/client.tsx`
- `trpc/server.tsx`
- `utils/config.ts`

## Owns

- App Router pages and layouts
- tRPC client and server-side caller helpers
- theme/providers setup
- template landing, premium landing, demo pages, and blog presentation

## Common Tasks

- Product shell or metadata changes:
  `app/layout.tsx`, `app/page.tsx`
- Data fetching and typed API usage:
  `trpc/*`
- Shared provider setup:
  `components/providers.tsx`
- Marketing/demo edits:
  `components/landing*`, `components/sections`, `components/demos`

## Cleanup Notes

If starting from scratch, review these first:

- `app/demo`
- `app/landing`
- `components/demos`
- `components/landing`
- `components/landing-premium`
- `components/sections`
- `lib/demo-data.ts`
- `public/brand`

## Update When

Update this file when route topology, provider wiring, tRPC client setup, or
the template/demo split changes.
