# Template Families

This document replaces the old variant matrix with the new family-first model.

## Families

1. `ts-turbo`
2. `next`
3. `backend`
4. `rust`
5. `solana`
6. `convex`
7. `worker`
8. `lib`
9. `cli`
10. `mobile`
11. `polyglot`

## Shared Rules

- `create` stays the root verb
- Families are the primary entrypoints
- Addons are named overlays, not loose booleans
- Package manager is chosen at the top level of the generated repo
- Smoke tests are required for supported families

## `ts-turbo`

The default TypeScript monorepo family.

- Core tree: `apps/web`, `apps/server`, `packages/*`
- Default bundle: `product`
- Optional extras: `worker`, `docs`, `examples`
- Addon groups: `product`, `realtime`, `growth`, `infra`, `AI`

## `next`

Clean Next.js app family.

- Default: frontend-only
- Presets: `auth`, `docs`, `analytics`, `storage`

## `backend`

API-first service family.

- Default: API-only
- Default bundle: `product`

## `convex`

Next.js + Convex family.

- Default: Next.js + Convex + auth

## `rust`

Rust service family.

- Default: Rust API service
- Presets: `axum`, `actix`

## `solana`

Solana program family.

- Default: Anchor program

## `worker`

Standalone worker family.

- Default: BullMQ + Redis
- Optional: Inngest

## `lib`

Generic package family.

- Default: TypeScript package
- Optional: shadcn/ui, Storybook

## `cli`

CLI package family.

- Default: TypeScript package
- Default release config and Changesets

## `mobile`

Expo family.

- Default: Expo Router + TypeScript
- Optional: auth, data, docs presets

## `polyglot`

Separate first-class family for mixed-language repos.

- Service-centric monorepo
- Rust + TS support service default
- Go and Python are advanced opt-ins
- Separate roots only

## Addon Bundles

### `product`

- auth
- DB
- API

### `realtime`

- WebSocket
- worker
- docs

### `growth`

- analytics
- feature flags
- A/B docs

### `infra`

- monitoring
- storage
- CI/deploy docs

### `AI`

- examples
- helpers
- docs
