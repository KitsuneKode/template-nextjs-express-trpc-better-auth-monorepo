# Implementation Plan

This plan turns the agreed CLI/family design into an implementation sequence.
It is optimized for maintainability, clear boundaries, and fast validation.
Checkboxes track completion status across sessions.

## Non-Negotiables

- [x] `oxfmt` is the formatter standard
- [ ] `oxlint` is the linter standard (currently still ESLint)
- [ ] Fumadocs is the docs standard for the monorepo family
- [ ] Smoke tests are required for every supported family
- [ ] Package manager choice is top-level and applies to the generated repo
- [ ] Family docs are family-first
- [ ] Addons are named presets, not random flags

## Phase 1 — CLI Architecture & Family Dispatch

Status: **Partially complete (schema + entrypoint + scaffold + generators done)**

### Scope

- [x] `ts-turbo`
- [ ] `next`
- [ ] `backend`
- [ ] `convex`
- [ ] `rust`
- [ ] `polyglot`
- [ ] `cli`

### Family Defaults

- [x] `ts-turbo`: current TS monorepo tree + core app + product bundle
- [ ] `next`: clean app + auth/docs/analytics/storage presets
- [ ] `backend`: API-only + product bundle
- [ ] `convex`: Next.js + Convex + auth
- [ ] `rust`: Rust API service
- [ ] `polyglot`: Rust + TS support service, Go/Python advanced opt-ins
- [ ] `cli`: TS CLI package + release config

### Files to Update — CLI Core (DONE)

- [x] `apps/cli/src/index.ts`
- [x] `apps/cli/src/types/schemas.ts`
- [x] `apps/cli/src/lib/scaffold.ts`
- [x] `apps/cli/src/lib/generators/*` (readme.ts, agent-docs.ts — family-aware)
- [ ] `apps/cli/src/lib/templates/*` (per-family template sources — not yet created)

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

- [x] root `package.json` — update scripts for oxfmt
- [ ] `toolings/eslint-config/*` — integrate with oxlint
- [x] repo-level Oxfmt config — `.oxfmtrc.json`
- [x] `lint-staged` — update to use oxfmt
- [ ] `husky` — update pre-commit hooks for oxfmt

### Docs

- [x] `docs/template-variants.md` — updated to family model
- [x] `docs/master-plan.md` — updated to family model
- [ ] `docs/architecture.md` — verify alignment
- [ ] `docs/cli-development.md` — verify alignment
- [x] `docs/IMPLEMENTATION-PLAN.md` — this file, self-referencing

### Validation Gates

- [x] `bun run check-types` — all 10 packages pass
- [x] `bun run build` — CLI builds successfully
- [ ] `bun run repo:doctor --strict` — needs verification
- [x] scaffold smoke test — ts-turbo scaffold verified end-to-end
- [ ] scaffold smoke tests for all phase 1 families

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

## Session 1 — Complete

### Done

- [x] Add `.oxfmtrc.json` with migrated options
- [x] Update `package.json` scripts (format → oxfmt, lint → oxlint)
- [x] Remove Prettier config and dependencies
- [x] Update lint-staged config for oxfmt
- [x] Add smoke test scaffold for ts-turbo
- [x] Add family-aware unit tests for new schema and generators
- [x] All 16 CLI tests passing
- [x] Commits: `b9db2fe`, `b06e243`, `317958c`

### Pending

- [x] Update CI workflow with format:check step
- [x] Harden pre-commit hook (hard check-types requirement)
- [x] Add smoke test scaffold for backend family
- [x] Align architecture.md and cli-development.md to family model
- [x] Verify repo:doctor --strict passes (0 errors, 0 warnings)
- [ ] Oxlint repo-wide linting (currently still ESLint)
- [ ] Build per-family template sources (next, backend, convex, rust, ...)
- [ ] Fumadocs docs structure for monorepo family

## Default Tree

### `ts-turbo`

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
