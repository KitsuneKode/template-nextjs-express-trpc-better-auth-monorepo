# Claude Navigation

Use `AGENTS.md` as the canonical repo map.

## Read Order

1. Open the nearest local `AGENTS.md`.
2. Open `docs/README.md` for the global map.
3. Open `docs/architecture.md` for cross-workspace flow.
4. Open `docs/start-fresh.md` before removing template/demo surfaces.

## Important Notes

- `apps/web` mixes real app wiring with showcase content.
- `apps/worker` is still a scaffold.
- `tests` now covers repo tooling, but not the full app surface yet.
- Prefer `AGENTS.md` over the existing package and app `README.md` files.
- When architecture or commands change, update the nearest local `AGENTS.md`
  and any affected shared doc in `docs/`.
- Use `bun run repo:doctor` before release or after large cleanup passes.
