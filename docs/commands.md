# Commands

## Development

- `bun install` — Install workspace dependencies and trigger Prisma generate via `postinstall`.
- `bun dev` — Run all workspace dev tasks through Turbo.
- `bun run dev:web` — Run only the Next.js app.
- `bun run dev:server` — Run only the Express server.
- `bun run dev:worker` — Run only the worker.

## Build & Check

- `bun run build` — Build the workspace.
- `bun run lint` — Lint code and markdown.
- `bun run check-types` — Run workspace type checks.
- `bun run test:deploy` — Live API smoke (default Render). See [deploy-smoke.md](./deploy-smoke.md).
- `bun run test:deploy:all` — Smoke Render + Vercel template URLs (Vercel skipped when deployment protection is on).

## Database

- `bun run db:generate` — Generate Prisma client.
- `bun run db:migrate` — Run Prisma migrate dev via Turbo.
- `bun run db:seed` — Seed the database.
- `bun run db:studio` — Open Prisma Studio.

## Template Operations

- `bun run rename-scope:dry` — Preview replacing package names with the current root package name.
- `bun run rename-scope` — Apply the scope rename across the repo.
- `bun run repo:doctor` — Audit the repo for stale scaffolding, broken exports, placeholder files, and doc drift.
- `bun run repo:doctor:strict` — Fail on warnings and errors for CI or pre-release checks.
- `bun run template:clean:dry` — Preview the cleanup plan for removing showcase code and optional workspaces.
- `bun run template:clean` — Apply the recommended cleanup plan.

## Commit Validation

- `bun run commit:check` — Validate the most recent commit message against the repo commit convention.

## Commit Convention

Preferred format: `type(scope): short imperative summary`

Common types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `build`, `ci`

Example: `feat(auth): add GitHub provider configuration`
