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

- [ ] Move current `apps/web/app/mockups/**` routes to `apps/web/app/__design-lab/**`.
- [ ] Add route-level metadata with `robots: { index: false, follow: false }` on the design lab index and pages.
- [ ] Update `apps/web/app/robots.ts` to disallow `/__design-lab/`.
- [ ] Confirm `apps/web/app/sitemap.ts` does not include the route.
- [ ] Add focused route-discovery tests if the app already has sitemap/robots tests; otherwise add a small web test for robot/sitemap behavior.
- [ ] Commit only the design-lab and `.gitignore` cleanup files.

## Task 2: Public usage documentation

- [ ] Rewrite `README.md` around Arche as the personal scaffold CLI.
- [ ] Document interactive create, `--preset`, `--pm`, `create-json`, `validate`, `add`, `history`, and MCP usage where implemented.
- [ ] Document Bun default, pnpm first-class support, npm experimental support, and the distinction between package manager and runtime.
- [ ] Document generated agent context: `AGENTS.md`, `CLAUDE.md` symlink, `.docs/`, `.plans/`, and `arche.json`.
- [ ] Document current support status honestly: TypeScript fullstack and Rust routes have foundations; Solana is in progress until the next slices land.
- [ ] Update `docs/README.md`, `docs/bootstrap-cli.md`, and `docs/commands.md` when their current wording drifts from the CLI.
- [ ] Commit public documentation changes separately.

## Task 3: Verification matrix

- [ ] Create `.docs/product/verification-matrix.md`.
- [ ] Track every preset against structure tests, install, lint, typecheck, test, build, Rust gates, Solana gates, deployment checks, and package-manager coverage.
- [ ] Add a lightweight exported matrix or test fixture only if the CLI needs to expose this status programmatically.
- [ ] Add tests that prevent target presets from being marked `Stable` without matrix evidence.
- [ ] Update `.plans/active/2026-05-24-cli-capability-registry.md` with evidence.
- [ ] Commit matrix and guard tests separately.

## Task 4: Solana program foundation

- [ ] Reshape the Solana template to use `programs/core` instead of a root `src/lib.rs`.
- [ ] Generate or template `Anchor.toml`, root `Cargo.toml`, and `programs/core/Cargo.toml`.
- [ ] Ensure generated package/program names derive from the project slug.
- [ ] Generate `packages/solana-config` for shared cluster/program constants.
- [ ] Generate `packages/solana-client` as the IDL/protocol client boundary.
- [ ] Add tests for the `solana-program` preset output shape.
- [ ] Commit the Solana program foundation.

## Task 5: Solana web and mobile foundations

- [ ] Extend `solana-web` to include a Next.js app plus wallet-adapter boundary.
- [ ] Extend `solana-mobile` to include an Expo/mobile app plus Solana Mobile Wallet Adapter boundary.
- [ ] Extend `solana-product` to compose web, mobile, program, client, and config output.
- [ ] Keep off-chain indexers and APIs out of default output unless selected later as explicit capabilities.
- [ ] Add generated-output tests for each Solana preset.
- [ ] Commit each meaningful Solana route slice separately.

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
