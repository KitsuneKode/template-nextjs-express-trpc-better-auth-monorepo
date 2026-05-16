---
paths: ["apps/cli/**", "apps/cli/tests/**"]
---

CLI lives at `apps/cli`. Key entry points and patterns:

- `src/index.ts` — entry point, arg parsing, @clack/prompts
- `src/lib/scaffold.ts` — pipeline orchestrator (copy → transform → generate → cleanup)
- `src/lib/generators/` — per-feature transforms (backend, database, orm, docker, env, ci, deployment)
- `src/types/schemas.ts` — Zod schemas for all CLI options + compatibility checks

Scaffold pipeline order: copy template → update package.json → backend transform → database transform → ORM transform → rename scope → template cleanup → generate env/docker/CI/deployment → git init → bun install.

Run `bun run dev:cli -- <name>` for local testing. Tests use `bun:test` with `makeConfig()` helpers.
