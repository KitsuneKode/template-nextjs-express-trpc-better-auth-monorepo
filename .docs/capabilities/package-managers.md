# Package managers and runtimes

Bun is the default package manager. pnpm is first-class support. npm and Yarn are
not stable defaults.

Package manager and runtime are separate decisions. A generated project may use
pnpm for installation/workspaces while running TypeScript apps on Node.js, Bun,
or a provider-specific runtime. Rust is owned by Cargo.

## Bun output

- Root `package.json` owns workspace globs and catalogs.
- Root `packageManager` pins Bun.
- Internal dependencies use `workspace:*`.
- Shared dependency versions use `catalog:`.
- Generated commands use Bun for package-manager operations.

## pnpm output

- `pnpm-workspace.yaml` owns workspace globs and catalogs.
- Root `packageManager` pins pnpm.
- Internal dependencies use `workspace:*`.
- Shared dependency versions use `catalog:`.
- Generated commands use pnpm for package-manager operations.

Do not emit Bun-shaped workspace metadata and call it native pnpm output.

## Turborepo commands

Root scripts should delegate through `turbo run <task>`. Package scripts own the
actual task implementations. Avoid ambiguous shorthand in generated package
scripts and CI.

## Transit nodes (generated monorepos)

Generated `turbo.json` files use a `transit` task with `dependsOn: ["^transit"]`
so lint and typecheck invalidate when upstream package sources change, without
waiting for upstream lint/typecheck to finish.

`lint`, `lint:fix`, and `check-types` depend on `transit` only (not `^lint`).

When adding a new package script:

1. Add the script in that package's `package.json`.
2. Register the task in root `turbo.json` (outputs, `dependsOn`, `env` as needed).
3. For web docs (Fumadocs), keep `mdx:generate` in `apps/web` and wire
   `check-types` → `mdx:generate` in `apps/web/turbo.json`.

The CLI renders root `turbo.json` from `apps/cli/src/render/turbo/render-turbo-json.ts`
using options from the scaffold recipe (db tasks, mdx, extra build outputs).
