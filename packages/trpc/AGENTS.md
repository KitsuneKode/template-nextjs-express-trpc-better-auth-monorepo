# tRPC Package Notes

## Purpose

`@template/trpc` is the **client-facing API contract** for web and workers.

Implementation lives in `apps/server/src/modules` (module-first). This package re-exports types and callers only.

## Read First

- `src/index.ts` — re-exports from `@template/server/trpc`
- `apps/server/src/modules/trpc/app.router.ts` — router composition
- `apps/server/src/modules/trpc/trpc.ts` — context and procedures

## Boundary

| Layer           | Location                                         |
| --------------- | ------------------------------------------------ |
| Business logic  | `apps/server/src/modules/<feature>/*.service.ts` |
| tRPC procedures | `apps/server/src/modules/<feature>/*.trpc.ts`    |
| App router      | `apps/server/src/modules/trpc/app.router.ts`     |
| Web imports     | `@template/trpc` (`AppRouter`, `createCaller`)   |

## Update When

Exported types, router composition, or re-export paths change.
