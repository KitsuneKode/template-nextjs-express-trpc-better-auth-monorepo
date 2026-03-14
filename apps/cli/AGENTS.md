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
│   ├── index.ts          # Entry, --help/--version, prompts
│   ├── lib/
│   │   ├── scaffold.ts   # Template copy, cleanup, generation
│   │   └── spawn.ts      # Node.js compatible subprocess
│   └── types/
│       └── schemas.ts    # Extensible Zod schemas
├── tests/                # Bun test files
├── dist/                 # Built output (Node.js compatible)
├── package.json          # @kitsu/create package
└── tsconfig.json
```

## Owns

- CLI prompts and argument parsing
- Template copy and customization flow
- Generated files: Docker, CI, env examples, deployment docs
- Zod schemas for all CLI options

## Common Tasks

| Task                   | Location                                   |
| ---------------------- | ------------------------------------------ |
| Add new CLI option     | `src/types/schemas.ts` then `src/index.ts` |
| Change prompts/UX      | `src/index.ts`                             |
| Change file generation | `src/lib/scaffold.ts`                      |
| Add new generator      | `src/lib/generators/*.ts` (future)         |
| Add tests              | `tests/*.test.ts`                          |

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
