# Bootstrap CLI (@kitsu/create)

## Context Distinction

This workspace serves **two different contexts**:

1. **CLI Development**: Working on the CLI tool itself (this file is for you)
2. **Template Usage**: Using the CLI to bootstrap new projects

| Context            | Documentation                         |
| ------------------ | ------------------------------------- |
| Developing the CLI | This file + `docs/cli-development.md` |
| Using the CLI      | `docs/bootstrap-cli.md` + `README.md` |

## Purpose

`apps/cli` contains `@kitsu/create`, a CLI for bootstrapping production-ready
full-stack TypeScript monorepos from this template.

## Read First

1. `docs/cli-development.md` - Development workflow, testing, publishing
2. `src/index.ts` - Entry point, argument parsing, prompts
3. `src/lib/scaffold.ts` - Core scaffolding logic
4. `src/lib/spawn.ts` - Cross-platform subprocess execution
5. `src/types/schemas.ts` - Zod schemas for CLI options

## File Structure

```text
apps/cli/
├── src/
│   ├── index.ts              # Entry, --help/--version, prompts
│   ├── lib/
│   │   ├── scaffold.ts       # Orchestrator: copy, transform, generate
│   │   ├── spawn.ts          # Node.js compatible subprocess
│   │   └── generators/
│   │       ├── index.ts      # Barrel export
│   │       ├── backend.ts    # Backend transforms (Hono, future Go/Rust)
│   │       ├── database.ts   # Database transforms (SQLite, future Mongo)
│   │       ├── docker.ts     # Config-aware Docker Compose
│   │       ├── env.ts        # Config-aware .env files
│   │       ├── ci.ts         # Config-aware GitHub Actions CI
│   │       └── deployment.ts # Config-aware deployment guide
│   └── types/
│       └── schemas.ts        # Zod schemas, compatibility checks
├── tests/
│   ├── scaffold.test.ts      # Scaffold + file-generation tests
│   ├── schemas.test.ts       # Schema validation + compatibility tests
│   ├── backend.test.ts       # Backend transform tests (fs-based)
│   ├── database.test.ts      # Database transform tests (fs-based)
│   └── spawn.test.ts         # Spawn utility tests
├── dist/                     # Built output (Node.js compatible)
├── package.json              # @kitsu/create package
└── tsconfig.json
```

## Scaffold Pipeline Order

1. Copy template to destination
2. Update root package.json name
3. Apply backend transform (rewrites server/tRPC for non-Express backends)
4. Apply database transform (rewrites store/auth/schema for non-Postgres DBs)
5. Rename scope (`@template` -> `@project-name`)
6. Template cleanup (remove showcase, worker, etc.)
7. Generate env, Docker, CI, deployment files
8. Git init + bun install

Backend and database transforms write `@template/` scope references so the
rename-scope script catches them in step 5.

## Owns

- CLI prompts and argument parsing
- Template copy and customization flow
- Backend transforms: Hono on Bun (express-bun is default, no transform)
- Database transforms: SQLite via Prisma (postgres is default, no transform)
- Generated files: Docker, CI, env examples, deployment docs
- Zod schemas and compatibility validation for all CLI options

## Common Tasks

| Task                   | Location                                         |
| ---------------------- | ------------------------------------------------ |
| Add new CLI option     | `src/types/schemas.ts` then `src/index.ts`       |
| Change prompts/UX      | `src/index.ts`                                   |
| Change scaffold flow   | `src/lib/scaffold.ts`                            |
| Add new backend        | `src/lib/generators/backend.ts`                  |
| Add new database       | `src/lib/generators/database.ts`                 |
| Add new file generator | `src/lib/generators/*.ts` + export from index.ts |
| Add compatibility rule | `src/types/schemas.ts` → `checkCompatibility()`  |
| Add tests              | `tests/*.test.ts`                                |

## Local Development

```bash
# Run in dev mode
bun run dev -- my-app

# Build and link globally
bun run link

# Test the linked CLI
create-kitsu-stack test-project
```

## Design Principles

1. **Node.js Compatible**: Target Node.js for npm/npx compatibility. Bun can
   also run the output.

2. **Schema-First**: All options defined as Zod schemas. Add new databases,
   addons, or backends by extending schemas first.

3. **Single Bundle**: Dependencies bundled into `dist/index.js` for fast
   installs.

4. **Extensible Architecture**: Designed for future polyglot backends (Go,
   Rust, Python), vector databases, and example templates.

## Update When

- New CLI options or prompts added
- Generated file templates changed
- Build or publishing process modified
- New feature categories added (databases, addons, examples)
