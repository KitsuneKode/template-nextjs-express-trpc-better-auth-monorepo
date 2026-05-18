# CLI Development Guide

This document is for developers working on the `@arche/create` CLI itself, not for
users bootstrapping projects with the CLI.

## Overview

The CLI lives in `apps/cli` and is designed to:

1. Prompt for the **project family** (fullstack, next, backend, etc.)
2. Prompt for family-specific options (backend/database/orm for fullstack, presets for next)
3. Prompt for **feature bundles** (product, realtime, growth, infra, AI)
4. Copy the template source for the selected family
5. Apply family-specific transforms
6. Generate additional files (Docker, CI, env examples, deployment docs)
7. Optionally initialize git and install dependencies

### Family Model

The CLI uses a family-first approach. Each family represents a distinct project
archetype with its own template source, defaults, and transforms:

| Family      | Description                    | Transform Pipeline              |
| ----------- | ------------------------------ | ------------------------------- |
| `fullstack` | Full-stack TypeScript monorepo | Full (backend + database + ORM) |
| `next`      | Standalone Next.js app         | Minimal (presets only)          |
| `backend`   | API-only service               | Full (backend + database + ORM) |
| `rust`      | Rust API service               | Minimal (stub)                  |
| `solana`    | Solana program                 | Minimal (stub)                  |
| `convex`    | Next.js + Convex               | Minimal (stub)                  |
| `worker`    | Background job worker          | Minimal (stub)                  |
| `lib`       | Generic TypeScript package     | Minimal (stub)                  |
| `cli`       | CLI package                    | Minimal (stub)                  |
| `mobile`    | Expo mobile app                | Minimal (stub)                  |
| `polyglot`  | Multi-language monorepo        | Minimal (stub)                  |

## Local Development

### Running the CLI in Development

```bash
# From repository root
bun run dev:cli -- my-test-app

# Or directly from apps/cli
cd apps/cli
bun run dev -- my-test-app
```

### Building the CLI

```bash
cd apps/cli
bun run build

# Output: apps/cli/dist/index.js
```

### Testing with `bun link`

```bash
cd apps/cli
bun run link    # Builds and links globally

# Test from anywhere
cd /tmp
create-arche test-project

# Or using npx-style
npx @arche/create test-project
```

To unlink:

```bash
cd apps/cli
bun unlink
```

## Architecture

### File Structure

```text
apps/cli/
├── src/
│   ├── index.ts              # Entry point, family dispatch, prompts
│   ├── lib/
│   │   ├── scaffold.ts       # Core scaffolding logic (family-aware)
│   │   ├── spawn.ts          # Cross-platform subprocess execution
│   │   └── generators/
│   │       ├── index.ts      # Barrel export
│   │       ├── backend.ts    # Backend transforms (Express, Hono)
│   │       ├── database.ts   # Database transforms (SQLite, MongoDB)
│   │       ├── orm.ts        # ORM transforms (Prisma, Drizzle)
│   │       ├── docker.ts     # Config-aware Docker Compose
│   │       ├── env.ts        # Config-aware .env files
│   │       ├── ci.ts         # Config-aware GitHub Actions CI
│   │       ├── deployment.ts # Config-aware deployment guide
│   │       ├── readme.ts     # Family-aware README generator
│   │       ├── agent-docs.ts # Family-aware AGENTS.md, CONTEXT.md
│   │       └── showcase.ts   # SHOWCASE.mdx (fullstack only)
│   ├── types/
│   │   └── schemas.ts        # Zod schemas, family/bundle types, validators
│   └── templates/            # Per-family template sources (future)
│       └── fullstack/         # (defaults to repo root)
├── tests/
│   ├── scaffold.test.ts      # Scaffold + file-generation tests
│   ├── schemas.test.ts       # Schema validation + compatibility tests
│   ├── backend.test.ts       # Backend transform tests
│   ├── database.test.ts      # Database transform tests
│   ├── orm.test.ts           # ORM transform tests
│   └── spawn.test.ts         # Spawn utility tests
├── dist/                     # Built output
├── package.json
└── tsconfig.json
```

### Key Design Decisions

1. **Node.js Compatible**: The CLI targets Node.js for maximum npm compatibility.
   Uses `child_process.spawnSync` instead of `Bun.spawnSync`.

2. **Single-File Bundle**: Dependencies are bundled into `dist/index.js` for
   faster installs and no version conflicts.

3. **Family-First Schema**: Zod schemas in `src/types/schemas.ts` define the
   family model, bundles, addons, and per-family options.

4. **Template-Based**: Copies the parent monorepo (or a family-specific template
   directory) and customizes via transforms and cleanup scripts.

5. **Oxfmt Formatting**: All source files are formatted with oxfmt. Run
   `bun run format` to format, `bun run format:check` to verify.

## Adding a New Family

1. Add the family name to `FamilySchema` in `src/types/schemas.ts`
2. Add labels and helper functions (`hasBackendOptions`, etc.)
3. Add the family to the prompt options in `src/index.ts`
4. Add template source (directory in `apps/cli/templates/{family}/`) or
   implement transforms in the scaffold pipeline
5. Add family-specific generator content in `readme.ts` and `agent-docs.ts`
6. Add a cleanup target if needed
7. Add a scaffold smoke test in `tests/src/cli/create-arche.test.ts`

## Adding a New Feature Bundle

1. Add the bundle name to `BundleSchema` in `src/types/schemas.ts`
2. Add labels to `BUNDLE_LABELS`
3. Add bundle-specific transforms in the scaffold pipeline
4. Add bundle-specific generated content in generators

## Testing

```bash
cd tests
bun test

# Run just the CLI tests
bun test src/cli/create-arche.test.ts
```

### Test Structure

- `src/cli/create-arche.test.ts` — Schema tests, family-aware generator
  output tests, and scaffold smoke tests (fullstack + backend)
- `src/toolings/` — Repo tooling script tests
- `src/integration/` — Runtime integration tests (in progress)

## Publishing to npm

### Prerequisites

1. npm account with access to `@arche` scope
2. Logged in: `npm login`

### Publishing

```bash
cd apps/cli

# Build and test
bun run build
cd ../../tests && bun test

# Publish
cd ../apps/cli
npm publish --access public

# Or dry-run first
npm publish --access public --dry-run
```

### Version Strategy

- **Patch** (0.1.x): Bug fixes, documentation
- **Minor** (0.x.0): New features, new families, new options
- **Major** (x.0.0): Breaking changes to CLI interface or generated output

## Debugging

```bash
# See what files would be generated
bun run dev -- my-app --yes 2>&1 | head -50
```

### Common Issues

1. **"Destination directory is not empty"**: The CLI refuses to overwrite
   existing directories. Delete or use a new name.

2. **"Command failed: bun install"**: Bun must be installed in the target
   environment for post-scaffold install.

3. **Path resolution errors**: Ensure you're running from the monorepo root
   or the `apps/cli` directory.

## Roadmap

### Current (2026)

- [x] Family-first CLI architecture (11 families defined)
- [x] Family-aware README, AGENTS.md, CONTEXT.md generators
- [x] Feature bundle system (product, realtime, growth, infra, AI)
- [x] Oxfmt formatting standard
- [x] Scaffold smoke tests (fullstack + backend)
- [ ] Per-family template sources
- [ ] CI + pre-commit fully migrated to oxfmt

### Next

- [ ] Oxlint linting standard (replace ESLint)
- [ ] Fumadocs docs for monorepo family
- [ ] Example templates (todo, chat, game)
- [ ] `arche add` command for augmenting existing projects

## Related Documentation

- [template-variants.md](./template-variants.md) — Family definitions
- [architecture.md](./architecture.md) — Cross-workspace dependencies
- [master-plan.md](./master-plan.md) — Current build direction
- [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) — Progress tracking
