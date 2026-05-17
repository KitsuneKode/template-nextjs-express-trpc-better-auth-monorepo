# Kitsune Stack - Master Plan

This document tracks the current build direction for the template and CLI.
The old single-variant matrix is retired in favor of a family-first model.

## Current Direction

- Root verb: `create`
- Families first, then bundles/addons
- Copy + rewrite remains the generation strategy
- Better Auth stays deeply integrated
- Convex remains a separate family
- `oxfmt` + `oxlint` are the repo standards
- Fumadocs is the docs standard for the monorepo family

## Families

- `ts-turbo`
- `next`
- `backend`
- `rust`
- `solana`
- `convex`
- `worker`
- `lib`
- `cli`
- `mobile`
- `polyglot`

## Bundles

- `product`
- `realtime`
- `growth`
- `infra`
- `AI`

## Execution Order

1. Rebuild the CLI entrypoint around family subcommands
2. Replace the old flag schema with family/bundle/addon config
3. Update generators for family-aware output
4. Switch repo formatting/linting to `oxfmt` and `oxlint`
5. Add smoke tests for supported families
6. Align docs and cleanup scripts with the new layout

## Validation Gates

- `bun run check-types`
- `bun run build`
- `bun run repo:doctor --strict`
- scaffold smoke tests for supported families
