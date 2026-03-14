# CLI Development Guide

This document is for developers working on the `@kitsu/create` CLI itself, not for
users bootstrapping projects with the CLI.

For usage documentation, see [bootstrap-cli.md](./bootstrap-cli.md).

## Overview

The CLI lives in `apps/cli` and is designed to:

1. Copy the monorepo template to a new directory
2. Customize it based on user selections (prompts or flags)
3. Generate additional files (Docker, CI, env examples, deployment docs)
4. Optionally initialize git and install dependencies

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
# Build for distribution (Node.js compatible)
cd apps/cli
bun run build

# Output: apps/cli/dist/index.js
```

### Testing with `bun link`

To test the CLI as if it were installed globally:

```bash
cd apps/cli
bun run link    # Builds and links globally

# Now test from anywhere
cd /tmp
create-kitsu-stack test-project

# Or using npx-style
npx @kitsu/create test-project
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
│   ├── index.ts          # Entry point, --help/--version handling
│   ├── lib/
│   │   ├── scaffold.ts   # Core scaffolding logic
│   │   └── spawn.ts      # Cross-platform subprocess execution
│   ├── types/
│   │   └── schemas.ts    # Zod schemas (extensible for future features)
│   └── utils/
│       └── paths.ts      # Portable path resolution
├── tests/
│   └── *.test.ts         # Bun test files
├── dist/                 # Built output (git-ignored)
├── package.json
└── tsconfig.json
```

### Key Design Decisions

1. **Node.js Compatible**: The CLI targets Node.js for maximum npm compatibility.
   Bun can also run the built output. Uses `child_process.spawnSync` instead of
   `Bun.spawnSync`.

2. **Single-File Bundle**: Dependencies are bundled into `dist/index.js` for
   faster installs and no version conflicts.

3. **Schema-First Types**: Zod schemas in `src/types/schemas.ts` define all CLI
   options. This enables future extensibility (databases, addons, polyglot backends)
   without refactoring.

4. **Template-Based**: Currently copies the parent monorepo and customizes via
   cleanup scripts. Future phases may add composable template fragments.

## Adding New Features

### Adding a New CLI Option

1. Add the schema in `src/types/schemas.ts`:

```typescript
export const StorageSchema = z.enum(['s3', 'r2', 'none'])
export type StorageMode = z.infer<typeof StorageSchema>
```

1. Update `BootstrapOptions` interface in `src/lib/scaffold.ts`

2. Add the prompt in `src/index.ts`

3. Implement the generation logic in `src/lib/scaffold.ts`

### Adding a New Example Template

Future structure for example templates:

```text
apps/cli/src/templates/examples/
├── todo/           # Files for todo example
├── chat/           # Files for chat example
└── game/           # Files for game example
```

Each example is a set of files to copy/generate when selected.

## Testing

```bash
cd apps/cli

# Run all tests
bun test

# Run specific test
bun test tests/scaffold.test.ts

# Watch mode
bun test --watch
```

### Test Structure

- `tests/args.test.ts` - Argument parsing
- `tests/scaffold.test.ts` - File generation (uses temp directories)
- `tests/integration.test.ts` - End-to-end CLI execution

## Publishing to npm

### Prerequisites

1. npm account with access to `@kitsu` scope
2. Logged in: `npm login`

### Publishing

```bash
cd apps/cli

# 1. Update version in package.json
# 2. Build and test
bun run build
bun test

# 3. Publish
npm publish --access public

# Or dry-run first
npm publish --access public --dry-run
```

### Version Strategy

- **Patch** (0.1.x): Bug fixes, documentation
- **Minor** (0.x.0): New features, new options
- **Major** (x.0.0): Breaking changes to CLI interface or generated output

## Debugging

### Verbose Output

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

### Phase 1 (Current)

- [x] Node.js compatibility
- [x] `--help` and `--version` flags
- [x] `bun link` for local testing
- [x] npm publishing setup

### Phase 2 (Planned)

- [ ] Example templates (todo, chat, game)
- [ ] MongoDB support
- [ ] Vector database (pgvector)
- [ ] Object storage (S3/R2)
- [ ] WebSocket server option

### Phase 3 (Future)

- [ ] Polyglot backends (Go, Rust, Python)
- [ ] Microfrontend scaffolding
- [ ] React Native support
- [ ] `kitsu add` command for augmenting existing projects

## Related Documentation

- [bootstrap-cli.md](./bootstrap-cli.md) - User-facing CLI documentation
- [architecture.md](./architecture.md) - Cross-workspace dependencies
- [start-fresh.md](./start-fresh.md) - Template cleanup guide
