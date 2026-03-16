---
paths: ["packages/trpc/**", "apps/server/src/app.ts"]
---

tRPC routers live in `packages/trpc/src/routers/`. Each router is a separate
file exporting a plain object `satisfies TRPCRouterRecord` (not wrapped in
`createTRPCRouter`). Import and register in `src/routers/_app.ts`.

Context resolves in `src/trpc.ts` from Better Auth session + Prisma. Access
user via `ctx.session.user.id`, database via `ctx.db`.

Use `protectedProcedure` for authenticated endpoints, `publicProcedure` for
open ones. Validation uses Zod.
