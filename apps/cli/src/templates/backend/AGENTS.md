# API

## Purpose

Express API with module-first layout.

## Structure

```
src/
  app.ts
  server.ts
  common/          # errors, validate, env, shared middleware
  db/              # database client (add when using an ORM)
  modules/
    <feature>/
      <feature>.routes.ts
      <feature>.controller.ts
      <feature>.service.ts
      <feature>.repository.ts   # optional
      <feature>.dto.ts          # optional (Zod)
```

Dependency direction: `routes → controllers → services → repositories → db`

## Read First

- `src/app.ts` — mounts module routers
- `src/modules/health/` — example module
- `src/common/middleware/error-handler.ts`

## Owns

- REST route handlers and HTTP wiring
- Business logic in `*.service.ts`
- Data access in `*.repository.ts`
