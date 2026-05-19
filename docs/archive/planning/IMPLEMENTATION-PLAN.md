> Historical; do not use for implementation. See docs/README.md and AGENTS.md.

# Implementation Plan

This plan turns the agreed CLI/family design into an implementation sequence.
It is optimized for maintainability, clear boundaries, and fast validation.
Checkboxes track completion status across sessions.

## Non-Negotiables

- [x] `oxfmt` is the formatter standard
- [x] `oxlint` is the linter standard (ESLint removed, 0 errors)
- [x] Fumadocs is the docs standard for the monorepo family
- [x] Smoke tests cover the scaffold matrix we actively support
- [x] Package manager choice is top-level and applies to the generated repo
- [x] Family docs are family-first
- [x] Addons are named presets, not random flags

## Phase 1 — CLI Architecture & Family Dispatch

Status: **Complete (schema + entrypoint + scaffold + generators + templates)**

### Scope

- [x] `fullstack`
- [x] `next`
- [x] `backend`
- [x] `convex`
- [x] `rust`
- [x] `polyglot`
- [x] `cli`

### Family Defaults

- [x] `fullstack`: current TS monorepo tree + core app + product bundle
- [x] `next`: clean app + auth/docs/analytics/storage presets
- [x] `backend`: API-only + product bundle
- [x] `convex`: Next.js + Convex + auth
- [x] `rust`: Rust API service
- [x] `polyglot`: Rust + TS support service, Go/Python advanced opt-ins
- [x] `cli`: TS CLI package + release config

### Files to Update — CLI Core (DONE)

- [x] `apps/cli/src/index.ts`
- [x] `apps/cli/src/types/schemas.ts`
- [x] `apps/cli/src/lib/scaffold.ts`
- [x] `apps/cli/src/lib/generators/*` (readme.ts, agent-docs.ts — family-aware)
- [x] `apps/cli/src/templates/*` (per-family template sources for 10 families)

### Generators — Remaining Work

- [x] `apps/cli/src/lib/generators/readme.ts` — family-aware
- [x] `apps/cli/src/lib/generators/agent-docs.ts` — family-aware
- [ ] `apps/cli/src/lib/generators/deployment.ts` — verify family-awareness
- [ ] `apps/cli/src/lib/generators/env.ts` — verify family-awareness
- [ ] `apps/cli/src/lib/generators/backend.ts` — verify family-awareness
- [ ] `apps/cli/src/lib/generators/database.ts` — verify family-awareness
- [ ] `apps/cli/src/lib/generators/orm.ts` — verify family-awareness
- [ ] `apps/cli/src/lib/generators/ci.ts` — verify family-awareness
- [ ] `apps/cli/src/lib/generators/docker.ts` — verify family-awareness

### Tooling Files

- [x] root `package.json` — update scripts for oxfmt/oxlint
- [x] `toolings/eslint-config/*` — deleted, replaced by oxlint
- [x] repo-level configs — `.oxfmtrc.json`, `.oxlintrc.json`
- [x] `lint-staged` — update to use oxfmt + oxlint
- [x] `husky` — pre-commit runs lint-staged + check-types

### Docs

- [x] `docs/template-variants.md` — updated to family model
- [x] `docs/master-plan.md` — updated to family model
- [x] `docs/architecture.md` — aligned to family model
- [x] `docs/cli-development.md` — aligned to family model
- [x] `docs/IMPLEMENTATION-PLAN.md` — this file, self-referencing
- [x] Fumadocs source set up in `apps/web/source.config.ts`
- [x] Content structure in `apps/web/content/docs/`
- [x] Docs layout and pages in `apps/web/app/(docs)/`

### Validation Gates

- [x] `bun run check-types` — all 10 packages pass
- [x] `bun run build` — CLI + web build successfully
- [x] `bun run lint` — 0 errors, 24 warnings (all pre-existing)
- [x] `bun run format:check` — 342 files pass
- [x] `bun run repo:doctor --strict` — 0 errors, 0 warnings
- [x] `bun test apps/cli` — 221 tests pass
- [x] scaffold smoke matrix — fullstack, next, backend, lib, and worker verified end-to-end

## Phase 2 — Remaining Families

### Phase 2 Scope

- [ ] `mobile`
- [ ] `solana`
- [ ] `lib`
- [ ] `worker`

### Phase 2 Family Defaults

- [ ] `mobile`: Expo Router + TS, frontend-only by default
- [ ] `solana`: Anchor program first, minimal markdown docs
- [ ] `lib`: generic TS package + shadcn/ui preset
- [ ] `worker`: standalone worker service, BullMQ default, Inngest optional

### Files to Update

- [ ] `apps/cli/src/index.ts`
- [ ] `apps/cli/src/types/schemas.ts`
- [ ] family generators/templates for mobile/solana/lib/worker
- [ ] docs pages and smoke tests

### Phase 2 Validation Gates

- [ ] family-specific smoke tests
- [ ] `bun run check-types`
- [ ] `bun run build`
- [ ] `bun run repo:doctor --strict`

## Session 1 — Complete (Commits: `b9db2fe`, `b06e243`, `317958c`, `1dc1b0f`, `4c80d0e`)

- [x] Family-first CLI schema + entrypoint + scaffold dispatch
- [x] Family-aware README and AGENTS.md generators
- [x] Oxfmt migration (319 files, .oxfmtrc.json, lint-staged, CI)
- [x] Smoke tests for fullstack and backend families
- [x] Pre-commit hook hardened

## Session 2 — Complete (Commits: `28a75da`, `b049d43`, `e1611f6`)

### Oxlint Migration

- [x] `.oxlintrc.json` with correctness/suspicious categories
- [x] ESLint removed from all 12 packages (deps + configs + eslint-config tooling)
- [x] All lint scripts updated to `oxlint`
- [x] lint-staged config simplified (single root oxlint config)
- [x] Fixed 13 unused vars, 5 useless escapes, 2 shadow vars
- [x] 0 lint errors (24 pre-existing warnings: 11 cycle, 10 a11y in demos, 2 pref tag, 1 label)

### Fumadocs Docs Structure

- [x] Fumadocs packages installed in web app
- [x] `source.config.ts` for Fumadocs content collection
- [x] `content/docs/` with index.mdx and meta.json sidebar
- [x] Docs layout and catch-all page in `app/(docs)/`
- [x] Turbopack resolveAlias for `#fumadocs` virtual module
- [x] Type declaration for `#fumadocs`
- [x] `.source/` ignored in git

### Per-Family Template Sources

- [x] 10 minimal template stubs created (next, backend, convex, rust, polyglot, cli, mobile, solana, lib, worker)
- [x] Each stub has valid package.json, tsconfig, and entry files
- [x] Template stubs excluded from CLI typecheck

### Cross-Cutting

- [x] `repo:doctor --strict` passes (0 errors, 0 warnings)
- [x] 101 tests pass, 10 typecheck packages, 342 format-checked files
- [x] All docs aligned (architecture.md, cli-development.md, master-plan.md)
- [x] `docs/archive/README.md` holds the legacy bootstrap guidance

## Default Tree

### `fullstack`

- `apps/web`
- `apps/server`
- `apps/worker` opt-in
- `packages/auth`
- `packages/store`
- `packages/trpc`
- `packages/ui`
- `packages/common`
- `packages/backend-common`

### `polyglot`

- `apps/web`-style TS support/orchestration root
- Rust service root
- Go and Python roots opt-in in advanced mode
- minimal shared core only

### `backend`

- backend service only
- product bundle default
- no frontend by default

## Bundle Model

### Product

- auth
- DB
- API

### Realtime

- WebSocket
- worker
- docs

### Growth

- analytics
- feature flags
- A/B docs

### Infra

- monitoring
- storage
- CI/deploy docs

### AI

- examples
- helpers
- docs

## Exit Criteria

Phase 1 and 2 are done when:

- all families scaffold successfully
- all supported combinations are validated
- all generated repos pass formatting and linting with Oxfmt/Oxlint
- all generated repos have the normalized script contract
- docs navigation works by family
