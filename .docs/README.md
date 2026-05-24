# Internal docs

This directory is for durable maintainer and agent context. It explains how this
repository works and why major design choices exist.

Use `docs/` for user-facing CLI documentation. Use `.plans/` for active,
completed, and archived work plans.

## Reading order

1. Start with the root `AGENTS.md`.
2. Read the nearest local `AGENTS.md` for files you will edit.
3. Read one relevant `.docs` topic.
4. Read one matching `.plans/active` file only when continuing approved work.

Do not load this whole tree by default.

## Sections

- `architecture/` - repository structure, generated-project architecture, and
  dependency boundaries.
- `product/` - CLI UX, presets, recipe model, and support matrix.
- `capabilities/` - capability-specific guidance for package managers, Rust,
  TypeScript, Solana, deployment, and agent context.
- `reference/` - external inspirations and ecosystem notes.
- `decisions/` - durable architecture decision records.
