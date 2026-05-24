# CLI capability registry design

The CLI should be a preset-led, capability-aware project initializer. It should
feel like a polished stack configurator while remaining strict about support
status, compatibility, and generated-project verification.

## Product model

```text
arche create <project>
  Guided Setup          verified presets first
  Customize             supported composition with validation
  Experiments           explicit opt-in for unstable or proof-gated routes

arche doctor            verifies generated project invariants
arche add <capability>  future incremental capability addition
```

## Presets

Initial preset candidates:

- TypeScript Fullstack
- Rust API
- Rust Fullstack
- Solana Program
- Solana Web dApp
- Solana Mobile dApp
- Solana Product
- Customize
- Experiments

Every meaningful option should display support status:

- `Stable` - complete verification matrix passes for every advertised
  first-class route.
- `Experimental` - available by explicit opt-in, not promised production-ready.
- `Requires validation` - plausible but blocked on proof or provider/runtime
  validation.

## Recipe

Every generated project writes `arche.json`. The recipe is the source of truth
for replay commands, support docs, generated-project verification, future
migrations, MCP/tool integration, and `arche add`.

Example shape:

```jsonc
{
  "$schema": "https://arche.kitsunekode.dev/schema.json",
  "version": 1,
  "preset": "rust-fullstack",
  "support": "stable",
  "packageManager": "bun",
  "runtime": {
    "web": "node",
    "api": "rust",
  },
  "workspace": {
    "turbo": true,
    "cargo": true,
  },
  "capabilities": {
    "web": { "framework": "next" },
    "api": { "language": "rust", "framework": "axum" },
    "database": { "engine": "postgres", "client": "sqlx", "owner": "rust" },
    "auth": { "provider": "clerk" },
    "deployment": { "target": "vercel-render" },
  },
}
```

## CLI internals

```text
apps/cli/src/
  cli/
    create.ts
    doctor.ts
    add.ts
  registry/
    presets.ts
    capabilities.ts
    compatibility.ts
    support-status.ts
  recipe/
    schema.ts
    normalize.ts
    replay.ts
  render/
    workspace/
      bun.ts
      pnpm.ts
      turbo.ts
      cargo.ts
    docs/
      agents.ts
      docs-index.ts
      plans.ts
    ci/
      github-actions.ts
    presets/
      ts-fullstack.ts
      rust-api.ts
      rust-fullstack.ts
      solana-web.ts
      solana-mobile.ts
      solana-product.ts
  verify/
    generated-project.ts
    commands.ts
    matrix.ts
```

The menu, flags, docs, support matrix, CI generation, and verification matrix
must read from the same capability registry.
