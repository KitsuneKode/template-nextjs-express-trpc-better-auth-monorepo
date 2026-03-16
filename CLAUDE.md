# Claude Navigation

Use `AGENTS.md` as the canonical repo map. Read the nearest local `AGENTS.md`
first, then `docs/README.md` for commands and env vars.

## Rules

- Prefer `AGENTS.md` over package/app `README.md` files.
- When architecture or commands change, update the nearest `AGENTS.md` and any
  affected doc in `docs/`.
- Use `bun run repo:doctor` before release or after large cleanup passes.
