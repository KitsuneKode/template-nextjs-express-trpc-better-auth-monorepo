# Arche

Personal project scaffolding for KitsuneKode-style apps.

Arche is a preset-led CLI for starting projects with the boring foundations
already wired: workspace shape, package manager metadata, agent context,
deployment notes, local env examples, and a reproducible `arche.json`.

It began as a full-stack TypeScript template. It is now being shaped into a
personal project vault and CLI for TypeScript, Rust, and Solana products.

## Current status

Implemented foundations:

- TypeScript fullstack monorepo generation.
- Bun-first and pnpm-first-class workspace output.
- Standalone JavaScript package-manager pinning.
- Canonical generated agent context: `AGENTS.md`, `CLAUDE.md -> AGENTS.md`,
  `.docs/`, and `.plans/`.
- Rust API scaffold with module-first Axum/SQLx structure.
- Rust-backed fullstack scaffold with `apps/web`, `services/api`, and a root
  Cargo workspace.
- Preset menu and `--preset=<id>` defaults.

Still validation-gated:

- Solana program/web/mobile/product presets.
- Full generated-project install/build/test matrix for every preset.
- npm trusted publishing and release automation.

No preset is promoted to `Stable` until its generated-project verification
matrix passes.

## Use the CLI

Published package route, once released:

```sh
npx arche create my-app
# or
bunx arche create my-app
```

From this repository while developing:

```sh
bun run dev:cli -- my-app --yes --dir=../projects
```

Always scaffold outside this template repository when writing real output.

## Common create commands

Interactive setup:

```sh
bun run dev:cli -- my-app --dir=../projects
```

Default non-interactive TypeScript fullstack:

```sh
bun run dev:cli -- my-app --yes --preset=typescript-fullstack --dir=../projects
```

Rust API:

```sh
bun run dev:cli -- my-api --yes --preset=rust-api --dir=../projects
```

Rust-backed fullstack:

```sh
bun run dev:cli -- my-product --yes --preset=rust-fullstack --dir=../projects
```

pnpm output:

```sh
bun run dev:cli -- my-app --yes --pm=pnpm --dir=../projects
```

Dry run:

```sh
bun run dev:cli -- my-app --yes --dry-run --dir=../projects
```

## Presets

| Preset                 | Status              | Output today                                 |
| ---------------------- | ------------------- | -------------------------------------------- |
| `typescript-fullstack` | Requires validation | Next.js + TypeScript API monorepo foundation |
| `rust-api`             | Requires validation | Axum API with module-first Rust layout       |
| `rust-fullstack`       | Requires validation | Next.js web + `services/api` Rust API        |
| `solana-program`       | Requires validation | Planned Anchor `programs/core` foundation    |
| `solana-web`           | Requires validation | Planned web dApp + generated Solana client   |
| `solana-mobile`        | Requires validation | Planned mobile dApp + mobile wallet boundary |
| `solana-product`       | Requires validation | Planned web + mobile + program composition   |
| `customize`            | Requires validation | Explicit composition path                    |
| `experiments`          | Experimental        | Proof-gated or unstable routes               |

## Package managers

- Bun is the default.
- pnpm is first-class.
- npm is available as an experimental legacy-compatible route.
- Package manager and runtime are separate decisions. A project can use pnpm as
  the package manager and still keep Bun runtime scripts where selected.

Monorepo outputs use native workspace catalogs:

- Bun: root `package.json` `workspaces.catalog`.
- pnpm: `pnpm-workspace.yaml` `catalog:`.

## Generated project context

Generated projects include:

```text
AGENTS.md
CLAUDE.md -> AGENTS.md
.docs/README.md
.docs/architecture/generated-project.md
.plans/README.md
arche.json
```

`AGENTS.md` is the canonical agent entrypoint. `.docs/` holds durable
architecture context. `.plans/` holds active/completed execution plans.
`arche.json` records the scaffold choices and replay command.

## Repository layout

```text
apps/
  cli/       @arche/create CLI
  web/       documentation/marketing app and design lab
  server/    TypeScript API template source
  worker/    optional worker template source

packages/
  auth/
  backend-common/
  store/
  trpc/
  ui/

toolings/
  scripts/
```

Target generated layouts are documented in
[`.docs/architecture/generated-projects.md`](.docs/architecture/generated-projects.md).

## Development

```sh
bun install
bun run dev:cli -- my-app --yes --dir=/tmp/arche-output
bun test apps/cli/tests
bun run --cwd apps/cli check-types
bun run --cwd apps/cli lint
bun run repo:doctor
```

Useful docs:

- [CLI usage](docs/bootstrap-cli.md)
- [Commands](docs/commands.md)
- [Internal roadmap](.docs/product/implementation-roadmap.md)
- Verification matrix _(to be added in the next slice)_

## Design lab

Private-ish design previews live at:

```text
/__design-lab
```

The route is unlinked, excluded from the sitemap, and marked `noindex`. It is
not authentication; anyone with the URL can view it.

## Release direction

npm publication is intentionally last. Before publishing, Arche needs package
contents checks, generated-project verification, release smoke tests, and
GitHub Actions trusted publishing via OIDC rather than long-lived npm tokens.
