# CLI capability registry and scaffold cleanup

## Status

Approved design. Implementation not started.

## Objective

Turn this repository into a personal project-vault and scaffold CLI with a
preset-led, capability-aware architecture. The CLI should generate reliable
projects with strong defaults, clear support status, disciplined docs, and
verification-backed stability claims.

## Approved defaults

- Stable presets appear first.
- Customize and Experiments are explicit paths.
- Bun is the default package manager.
- pnpm is first-class support.
- npm and Yarn are not stable defaults.
- Package manager and runtime are separate decisions.
- TypeScript quality gates use oxlint, oxfmt, TypeScript, and Vitest.
- Rust quality gates use rustfmt, strict Clippy, cargo-nextest, cargo-deny,
  release builds, and SQLx verification when selected.
- Deployment output generates config, docs, and env contracts but does not
  provision provider resources initially.
- Stable means every advertised first-class route passes generated-project
  verification.

## Naming standard

```text
apps/web
apps/api
apps/docs
apps/worker

packages/auth
packages/contracts
packages/db
packages/env
packages/ui

services/api
services/indexer
services/worker-*

crates/use-cases
crates/domain
crates/db
crates/contracts
crates/env
crates/auth

programs/core
packages/solana-client
packages/solana-config
tooling/*
```

## Target implementation phases

1. Clean docs/instructions and define capability registry types.
2. Add Bun and pnpm workspace renderers and recipe generation.
3. Add stable TypeScript and Rust preset generation with verification matrix.
4. Add Solana web, mobile, and product preset foundations.
5. Add future `arche add` support for incremental capabilities.

## Non-goals for the first implementation slice

- Provider account/resource provisioning.
- npm or Yarn stable support.
- Native Rust Better Auth adapter as a stable default.
- Generic unverified polyglot scaffolds marked stable.
- Solana indexer/off-chain service as default clutter.

## Implementation evidence

Foundation slice completed on 2026-05-24:

- Added support-status, capability/preset registry, and compatibility
  foundations.
- Added `arche.json` recipe schema and recipe-style replay command support.
- Added Bun and pnpm native workspace/catalog rendering primitives.
- Added generated agent-context rendering primitives for future scaffold
  integration.
- Preset candidates remain `requiresValidation`; no generated route was
  promoted to `Stable` without its full verification matrix.
- Verified `bun test apps/cli/tests`: 250 pass, 1 pre-existing skipped E2E, 0
  fail.
- Verified `bun run --cwd apps/cli check-types`: pass.
- Verified `bun run --cwd apps/cli lint`: pass.

Canonical agent-context slice completed on 2026-05-24:

- Converted this repository's `CLAUDE.md` into a symlink to canonical
  `AGENTS.md`.
- Updated live navigation so `docs/` is public/manual context, `.docs/` is
  internal durable context, and `.plans/` is execution history.
- Updated scaffold and `arche add agent-docs` output to generate `AGENTS.md`,
  `CLAUDE.md -> AGENTS.md`, `.docs/README.md`,
  `.docs/architecture/generated-project.md`, and `.plans/README.md`.
- Removed generated `CONTEXT.md` behavior; detailed Rust architecture now lives
  in its scoped `.docs` topic instead of bloating `AGENTS.md`.
- Verified `bun test apps/cli/tests`: 251 pass, 1 pre-existing skipped E2E, 0
  fail.
- Verified `bun run --cwd apps/cli check-types`: pass.
- Verified `bun run --cwd apps/cli lint`: pass.
- Verified `bun run repo:doctor`: 0 errors, 0 warnings, 0 info.

Still pending:

- Use the registry to drive the interactive preset-led configurator.
- Implement and verify Rust Fullstack and Solana preset output before promoting
  them to `Stable`.

Native workspace/support surface slice completed on 2026-05-24:

- Fullstack Bun scaffolds now emit Bun-native workspace/catalog metadata and
  centralized shared dependency references.
- Fullstack pnpm scaffolds now emit `pnpm-workspace.yaml` catalogs, a pinned
  pnpm package manager, and retain explicit Bun/Node engine support.
- Standalone JavaScript scaffolds now pin the selected Bun/pnpm package manager
  and Node/Bun engines without generating workspace catalog files.
- Generated root scripts normalize legacy Turbo shorthand into `turbo run`
  delegation for filtered apps and database tasks.
- Catalog values use this scaffold's selected dependency baseline; the
  `t3code` reference supplies organization principles, not copied package
  versions.
- Current package-manager prompts and MCP schema now identify Bun as default,
  pnpm as first-class, and npm as experimental.
- Verified `bun test apps/cli/tests`: 255 pass, 1 pre-existing skipped E2E, 0
  fail.
- Verified `bun run --cwd apps/cli check-types`: pass.
- Verified `bun run --cwd apps/cli lint`: pass.
- Verified `bun run repo:doctor`: 0 errors, 0 warnings, 0 info.
