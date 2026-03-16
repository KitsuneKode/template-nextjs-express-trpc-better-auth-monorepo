---
paths: ["packages/store/**"]
---

Prisma schema at `prisma/schema.prisma`. After schema changes:
1. `bun run db:generate` — regenerate client
2. `bun run db:migrate` — create migration
3. `bun run db:seed` — re-seed if needed

Seed data in `src/scripts/seed.ts` includes demo content. The Prisma client
is re-exported from `src/index.ts` as the `@template/store` package.
