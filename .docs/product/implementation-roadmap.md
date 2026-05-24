# Arche implementation roadmap

## Purpose

Arche is a personal project-initialization CLI that should generate dependable
starting points for TypeScript, Rust, and Solana products. The target is not a
menu of unverified possibilities: every first-class route must generate a
coherent workspace, useful agent context, and a verification story before it
can be called stable.

This roadmap continues the approved capability registry design in
[`cli-capability-registry.md`](./cli-capability-registry.md) and generated
architecture rules in
[`../architecture/generated-projects.md`](../architecture/generated-projects.md).

## Agreed execution model

- Work in complete feature slices with scoped commits.
- Add focused behavior tests during a slice, using failures to establish the
  missing behavior before implementation.
- Run broad verification gates after a coherent slice is ready to commit, not
  after every small edit.
- Do not label a preset `Stable` until its generated-project matrix passes for
  every advertised Bun/pnpm/runtime route.
- Keep npm package publication and trusted publishing setup until the CLI
  surface and generated outputs are reliable.

## Slice order

### 1. Hidden design lab and public docs

The website keeps design explorations available under an intentionally
unlinked, non-sensitive route:

```text
/__design-lab
/__design-lab/mockup-1
...
```

Requirements:

- Do not link the route from public navigation or public documentation.
- Exclude it from sitemap output.
- Disallow it in `robots.txt`.
- Add page metadata using `noindex, nofollow`.
- Treat this as obscurity for personal previews, not authentication.

The root README and public CLI docs then describe the real current feature
surface: Bun default, pnpm first-class support, preset-led creation, generated
agent context, Rust-backed fullstack support, and Solana work still in
progress.

### 2. Verification matrix

Add a durable internal matrix that records generated-project proof by preset
and package manager. It should separate:

- structure/snapshot tests;
- install and command smoke tests;
- lint, typecheck, test, and build gates;
- Rust-specific `cargo fmt`, Clippy, and tests;
- Solana/Anchor-specific generation and test gates;
- deployment and publication readiness.

Current implemented proof includes TypeScript fullstack workspace generation,
standalone JavaScript package-manager output, Rust API generation, and the
Rust-backed fullstack workspace shape. This is not yet enough to promote the
target presets to `Stable`.

### 3. Solana preset foundations

Implement from the smallest reusable base outward:

1. `solana-program`: `programs/core` with Anchor configuration and IDL output
   contract.
2. `solana-web`: add a Next.js web app plus `packages/solana-client` and
   `packages/solana-config`, with a web-wallet boundary.
3. `solana-mobile`: add Expo/mobile output with a Solana Mobile Wallet Adapter
   boundary.
4. `solana-product`: compose web, mobile, program, shared client, and shared
   Solana config output.

The generated client package owns IDL-driven protocol access only. Product
business logic remains in apps/services. Indexers and off-chain APIs remain
explicit optional capabilities rather than default output.

### 4. Generated-project hardening

After the preset shapes exist, expand checks to execute generated outputs:

- Bun and pnpm install/build/test routes for TypeScript scaffolds.
- Rust API and Rust-backed fullstack Cargo workspace checks.
- Solana program/client/web/mobile checks appropriate to each generated route.
- CI and deployment file checks against the generated shape, especially
  service-backed projects.

Only then should support labels be reconsidered.

### 5. npm distribution and trusted publishing

Publication is the final slice. It includes:

- package contents audit and `npm pack`/publish dry-run validation;
- executable/bin and package metadata checks;
- clean versioning and changelog/release policy;
- npm trusted publishing using GitHub Actions OIDC rather than long-lived npm
  tokens, once the package and workflow are ready;
- release smoke tests that run before publishing.

No publish workflow should be treated as complete before generated-project
hardening is complete.

## Decisions that still require user approval

Implementation can continue without per-file approval. Ask before:

- changing any preset support label to `Stable`;
- selecting a final production auth provider/default for Rust or Solana;
- adding provider-specific paid deployment defaults;
- changing the CLI interaction model beyond the approved preset-led flow.
