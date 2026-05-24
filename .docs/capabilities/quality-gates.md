# Quality gates

Stable presets must generate quality gates that are fast enough for daily use
and strict enough to catch drift.

## TypeScript

Default stable TypeScript tooling:

- oxlint
- oxfmt
- TypeScript
- Vitest
- Framework-specific checks only when selected by the preset

## Rust

Default stable Rust tooling:

- pinned `rust-toolchain.toml`
- `cargo fmt --all -- --check`
- `cargo clippy --workspace --all-targets --all-features -- -D warnings`
- `cargo nextest run --workspace --all-features`
- `cargo deny check`
- `cargo build --workspace --release`
- SQLx verification when SQLx/Postgres is enabled

Avoid broad pedantic lint sets by default. Additional hardening can be a
capability, not scaffold noise.

## Stability rule

An option remains `Experimental` until its advertised Bun and pnpm outputs pass
the complete generated-project verification path, plus Cargo, Solana, database,
or deployment gates where those capabilities are selected.
