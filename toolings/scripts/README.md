# Tooling Scripts

Utility scripts for bootstrapping, auditing, and cleaning the monorepo.

## Available Scripts

### `rename-scope.ts`

Automatically renames the package scope from `@arche-template` to match your
root package name. The scaffold CLI sets the generated root package name first,
then runs this script so workspaces, imports, Turbo filters, Dockerfiles, and
config files follow the chosen project slug.

```bash
bun run rename-scope:dry
bun run rename-scope
bun run rename-scope:verbose
bun toolings/scripts/rename-scope.ts --from @arche-template --to @acme
```

### `repo-doctor.ts`

Audits the repo for stale scaffolding, broken package exports, placeholder files, and doc drift.

```bash
bun run repo:doctor
bun run repo:doctor:strict
bun toolings/scripts/repo-doctor.ts --json
```

### `template-cleanup.ts`

Strips the template showcase and optional workspaces from a cloned project.

```bash
bun run template:clean:dry
bun run template:clean
bun toolings/scripts/template-cleanup.ts --remove=showcase,seed --yes
```

## Workflow

1. Set the root `package.json` name to the target slug.
2. Run `bun run rename-scope:dry`.
3. Run `bun run rename-scope`.
4. Run `bun run repo:doctor`.
5. Preview cleanup with `bun run template:clean:dry`.
6. Apply cleanup with `bun run template:clean`.
7. Run lint, type checks, and local verification.

## Commit Hygiene

Commit messages are checked by Husky and commitlint.

- Format:
  `type(scope): short imperative summary`
- Example:
  `refactor(web): simplify landing shell`
