# Bootstrap CLI (@kitsu/create)

## Purpose

Bootstrap CLI for scaffolding full-stack TypeScript monorepos from this template.

## Read First

- `src/index.ts` — entry, arg parsing, prompts
- `src/lib/scaffold.ts` — pipeline orchestrator
- `src/lib/generators/` — per-feature transforms
- `src/types/schemas.ts` — Zod schemas + compatibility checks

## Scaffold Pipeline

Copy template → update package.json → backend transform → database transform (skipped for Drizzle) → ORM transform → rename scope → template cleanup → generate env/docker/CI/deployment/agent-docs → git init → bun install

## Owns

- CLI prompts and arg parsing
- Template copy and customization
- Backend transforms (Express, Hono)
- Database transforms (Postgres, SQLite, MongoDB)
- ORM transforms (Prisma, Drizzle)
- Generated files (Docker, CI, env, deployment, agent-docs, showcase)

## Quick Commands

- `bun run dev:cli -- my-app` — dev mode
- `bun run build` — build for npm
- `bun test` — run tests

## When to Update

New options, changed pipeline, or modified generated output. Full reference: `docs/cli-development.md`.
