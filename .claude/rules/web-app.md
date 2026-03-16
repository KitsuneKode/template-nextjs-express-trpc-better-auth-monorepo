---
paths: ["apps/web/**"]
---

Next.js App Router. Server components do `prefetch()` with tRPC query options
and wrap children in `<HydrateClient>`. Client components use `useTRPC()` hook
from `trpc/client.tsx`.

This app mixes real wiring with template showcase content. Real runtime:
`app/layout.tsx`, `components/providers.tsx`, `trpc/client.tsx`,
`trpc/server.tsx`. Template-only: `app/demo/`, `app/landing/`,
`components/demos/`, `components/landing*/`, `components/sections/`.

See `docs/start-fresh.md` before removing template surfaces.
