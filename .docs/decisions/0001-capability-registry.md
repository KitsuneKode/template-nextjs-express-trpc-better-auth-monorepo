# 0001 Capability registry over family switchboard

## Status

Accepted.

## Decision

Use a capability registry with verified presets instead of continuing with a
flat family switchboard.

## Context

The existing family-first CLI can scaffold several shapes, but it makes support
status, compatibility, generated docs, CI, and verification drift from one
another. The desired CLI needs to cover TypeScript, Rust, Solana, mobile,
deployment, package-manager differences, and future `arche add` workflows.

## Consequences

- Presets are curated selections of capabilities.
- Advanced mode edits capabilities with compatibility validation.
- Interactive prompts, flags, docs, CI, and verification share one source of
  truth.
- Stable options require generated-project verification across every advertised
  first-class route.
