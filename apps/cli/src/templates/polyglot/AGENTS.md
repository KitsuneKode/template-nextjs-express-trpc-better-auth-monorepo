# Polyglot Monorepo

## Purpose

Multi-language monorepo with services in TypeScript, Rust, Go, Python, or others.

## Read First

- Root `turbo.json` for task orchestration
- `apps/web` — Next.js frontend
- `apps/api` or `services/api` — API service (language depends on selection)
- `apps/worker` — Background job worker (TypeScript)

## Structure

```
.
├── apps/
│   ├── api/       # API service (TypeScript by default, replaceable)
│   ├── web/       # Next.js frontend
│   └── worker/    # Background worker
├── services/      # Non-JS services (Rust, Go, Python, etc.)
└── turbo.json     # Task orchestration
```

## Common Commands

- `bun dev` — Start all services
- `bun run build` — Build all services
- `bun run lint` — Lint all services
- `bun run check-types` — Typecheck TypeScript services

## Adding a New Language Service

1. Create a directory under `services/` (e.g., `services/ml-pipeline/`)
2. Add language-specific tooling (cargo, go.mod, pyproject.toml, etc.)
3. Add a `turbo.json` task entry if needed
4. Update `docker-compose.yml` to include the new service
