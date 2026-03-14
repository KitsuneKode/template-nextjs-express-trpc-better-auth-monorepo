# Start Fresh

Use this file when turning the template into a real product and you do not want
to preserve the marketing/demo experience.

## Recommended Order

1. Choose the final root package name in `package.json`.
2. Run `bun run rename-scope:dry`.
3. Run `bun run rename-scope` once the preview looks correct.
4. Run `bun run template:clean:dry` to preview the recommended cleanup.
5. Run `bun run template:clean` if the planned removals match your intent.
6. Decide whether to keep or restore any optional surfaces after cleanup.
7. Replace branding, metadata, seeded demo content, and auth provider settings.
8. Remove unused scaffolds such as the worker or tests package if they are not
   part of the product plan.
9. Run install, lint, type checks, Prisma generate, and the app locally.

## Safe-To-Review Removal Targets

Remove these if you want a clean product baseline instead of the template
showcase:

- `apps/web/app/demo`
- `apps/web/app/landing`
- `apps/web/components/demos`
- `apps/web/components/landing`
- `apps/web/components/landing-premium`
- `apps/web/components/sections`
- `apps/web/lib/demo-data.ts`
- `apps/web/public/brand`

Review and replace these even if you keep part of the showcase:

- `apps/web/app/layout.tsx` metadata and social image branding
- `apps/web/app/page.tsx` homepage messaging
- `README.md` template branding and install instructions
- `packages/store/src/scripts/seed.ts` demo posts and demo user content
- `packages/auth/src/index.ts` social provider placeholders
- `apps/web/components/shell/navbar-switcher.tsx` design switching behavior

## Core Surfaces Worth Keeping

These are the actual reusable platform pieces:

- `packages/auth`
- `packages/trpc`
- `packages/store`
- `packages/common`
- `packages/backend-common`
- `packages/ui`
- `apps/server`
- the provider and tRPC wiring in `apps/web`

## Common Product Decisions

- Keep or remove clustered Express startup in `apps/server/src/server.ts`.
- Keep or remove Redis-backed worker support.
- Keep or replace seeded blog and chat demos.
- Keep or remove shadcn generator support in `packages/ui`.

## Verification After Cleanup

Run these once the template-specific surfaces are removed or replaced:

- `bun install`
- `bun run lint`
- `bun run check-types`
- `bun run db:generate`
- `bun dev`

If you changed schema or seed data, also run the appropriate Prisma workflow.
