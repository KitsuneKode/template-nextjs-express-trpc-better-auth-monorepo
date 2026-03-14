# tRPC Package Notes

## Purpose

`packages/trpc` centralizes the real API contract for the repo.

## Read First

- `src/index.ts`
- `src/trpc.ts`
- `src/routers/_app.ts`
- `src/routers/auth.ts`
- `src/routers/post.ts`
- `src/routers/chat.ts`

## Owns

- tRPC context creation
- public and protected procedures
- Express middleware export
- server-side caller factory
- app router composition

## Common Tasks

- add or edit API procedures:
  `src/routers/*`
- change auth/session context:
  `src/trpc.ts`
- change exported middleware or types:
  `src/index.ts`

## Notes

- Routers currently call Prisma directly through `@template/store`.

## Update When

Update this file when router composition, context shape, auth guarding, or
exported API helpers change.
