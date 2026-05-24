# Complete Arche Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the agreed Arche scaffold CLI implementation from hidden design previews through Solana foundations and generated-project hardening.

**Architecture:** Work in coherent slices with scoped commits. Keep `AGENTS.md` short and canonical, durable implementation context in `.docs/`, and execution evidence in `.plans/`. Use focused tests while changing behavior, then run broad verification only at meaningful slice boundaries.

**Tech Stack:** Next.js App Router, Bun, pnpm catalogs, Turborepo, TypeScript, Oxlint/Oxfmt, Bun test, Rust/Cargo, Anchor/Solana scaffolding.

---

## Files and Responsibilities

- `apps/web/app/__design-lab/**` - hidden design preview route.
- `apps/web/app/robots.ts` and `apps/web/app/sitemap.ts` - discovery controls.
- `README.md`, `docs/README.md`, `docs/bootstrap-cli.md`, `docs/commands.md` - public CLI usage docs.
- `.docs/product/verification-matrix.md` - generated-project proof status.
- `apps/cli/src/registry/*` - preset/capability support status and defaults.
- `apps/cli/src/templates/solana/**` - Solana program/client/mobile/web template roots.
- `apps/cli/src/lib/generators/**` - generated files for README, docs, CI, Solana transforms, and workspace metadata.
- `apps/cli/tests/**` - behavior and generated-output tests.
- `.plans/active/2026-05-24-cli-capability-registry.md` - running implementation evidence.

## Task 1: Hidden design lab route

- [x] Move current `apps/web/app/mockups/**` routes to `apps/web/app/__design-lab/**`.
- [x] Add route-level metadata with `robots: { index: false, follow: false }` on the design lab index and pages.
- [x] Update `apps/web/app/robots.ts` to disallow `/__design-lab/`.
- [x] Confirm `apps/web/app/sitemap.ts` does not include the route.
- [x] Add focused route-discovery tests if the app already has sitemap/robots tests; otherwise add a small web test for robot/sitemap behavior.
- [x] Commit only the design-lab and `.gitignore` cleanup files.

Evidence: `bun test apps/web/app/route-discovery.test.ts`, `bun run --cwd apps/web check-types`, and `bun run --cwd apps/web lint` pass.

## Task 2: Public usage documentation

- [x] Rewrite `README.md` around Arche as the personal scaffold CLI.
- [x] Document interactive create, `--preset`, `--pm`, `create-json`, `validate`, `add`, `history`, and MCP usage where implemented.
- [x] Document Bun default, pnpm first-class support, npm experimental support, and the distinction between package manager and runtime.
- [x] Document generated agent context: `AGENTS.md`, `CLAUDE.md` symlink, `.docs/`, `.plans/`, and `arche.json`.
- [x] Document current support status honestly: TypeScript fullstack and Rust routes have foundations; Solana is in progress until the next slices land.
- [x] Update `docs/README.md`, `docs/bootstrap-cli.md`, and `docs/commands.md` when their current wording drifts from the CLI.
- [x] Commit public documentation changes separately.

Evidence: `bun run repo:doctor` passes with 0 errors, 0 warnings, 0 info.

## Task 3: Verification matrix

- [x] Create `.docs/product/verification-matrix.md`.
- [x] Track every preset against structure tests, install, lint, typecheck, test, build, Rust gates, Solana gates, deployment checks, and package-manager coverage.
- [x] Add a lightweight exported matrix or test fixture only if the CLI needs to expose this status programmatically.
- [x] Add tests that prevent target presets from being marked `Stable` without matrix evidence.
- [x] Update `.plans/active/2026-05-24-cli-capability-registry.md` with evidence.
- [x] Commit matrix and guard tests separately.

Evidence: `bun test apps/cli/tests/verification-matrix.test.ts`, `bun run --cwd apps/cli check-types`, and `bun run --cwd apps/cli lint` pass.

## Task 4: Solana program foundation

- [x] Reshape the Solana template to use `programs/core` instead of a root `src/lib.rs`.
- [x] Generate or template `Anchor.toml`, root `Cargo.toml`, and `programs/core/Cargo.toml`.
- [x] Ensure generated package/program names derive from the project slug.
- [x] Generate `packages/solana-config` for shared cluster/program constants.
- [x] Generate `packages/solana-client` as the IDL/protocol client boundary.
- [x] Add tests for the `solana-program` preset output shape.
- [x] Commit the Solana program foundation.

Evidence: `bun test apps/cli/tests/solana-preset.test.ts` passes.

## Task 5: Solana web and mobile foundations

- [x] Extend `solana-web` to include a Next.js app plus wallet-adapter boundary.
- [x] Extend `solana-mobile` to include an Expo/mobile app plus Solana Mobile Wallet Adapter boundary.
- [x] Extend `solana-product` to compose web, mobile, program, client, and config output.
- [x] Keep off-chain indexers and APIs out of default output unless selected later as explicit capabilities.
- [x] Add generated-output tests for each Solana preset.
- [x] Commit each meaningful Solana route slice separately.

Evidence: `bun test apps/cli/tests/solana-preset.test.ts apps/cli/tests/preset-config.test.ts apps/cli/tests/templates.test.ts apps/cli/tests/verification-matrix.test.ts`, `bun run --cwd apps/cli check-types`, `bun run --cwd apps/cli lint`, and `bun run repo:doctor` pass.

## Task 6: Generated-project hardening

- [ ] Add generated-project verification helpers that can run selected install/build/test commands in temporary output directories.
- [ ] Keep slow install/build checks separated from fast unit tests.
- [ ] Verify Bun and pnpm generated TypeScript routes.
- [ ] Verify Rust API and Rust-backed fullstack Cargo workspaces where local Rust tooling is available.
- [ ] Verify Solana structure and run Anchor/Cargo checks only when local tooling is available.
- [ ] Keep preset support status as `requiresValidation` until evidence is complete.
- [ ] Commit verification harness and evidence updates.

## Task 7: npm/OIDC publication readiness

- [ ] Audit `apps/cli/package.json` metadata, `bin`, files, and package contents.
- [ ] Add `npm pack --dry-run`/package smoke guidance or scripts.
- [ ] Add GitHub Actions trusted publishing design using OIDC, not a long-lived npm token.
- [ ] Do not enable live publishing until the generated-project matrix is reliable.
- [ ] Commit release-readiness docs/config as the final slice.

## Milestone Verification Policy

During a slice, run focused tests tied to the behavior being changed. At the end of a coherent slice, run the appropriate broad gates:

```bash
bun test apps/cli/tests
bun run --cwd apps/cli check-types
bun run --cwd apps/cli lint
bun run repo:doctor
```

For web-only slices, add `bun run check-types --filter=@template/web` or the repo's matching web check if the changed files are not covered by CLI tests.
