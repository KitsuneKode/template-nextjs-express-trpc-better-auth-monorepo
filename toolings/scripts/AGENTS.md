# Tooling Scripts Notes

## Purpose

`toolings/scripts` holds one-off repo utility scripts.

## Read First

- `README.md`
- `rename-scope.ts`

## Owns

- scope migration from `@template/*` to the root package name
- repo redundancy and drift auditing
- start-fresh cleanup automation
- lint and typecheck coverage for repo maintenance scripts

## Common Tasks

- preview scope replacement:
  `bun run rename-scope:dry`
- apply scope replacement:
  `bun run rename-scope`
- audit stale scaffolding and drift:
  `bun run repo:doctor`
- strip template baggage from a cloned project:
  `bun run template:clean:dry`, `bun run template:clean`
- inspect replacement behavior:
  `rename-scope.ts`, `repo-doctor.ts`, `template-cleanup.ts`

## Notes

- These are bootstrap tools, not runtime dependencies.
- They are especially relevant right after cloning the template.

## Update When

Update this file when repo bootstrap scripts are added, removed, or renamed.
