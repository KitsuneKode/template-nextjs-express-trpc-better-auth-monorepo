# Claude Navigation

Use `AGENTS.md` as the canonical repo map. Read the nearest local `AGENTS.md`
first, then `docs/README.md` for commands and env vars.

@import { path: ".claude/rules/\*.md" }

## Rules

- Prefer `AGENTS.md` over package/app `README.md` files.
- When architecture or commands change, update the nearest `AGENTS.md` and any
  affected doc in `docs/`.
- Use `bun run repo:doctor` before release or after large cleanup passes.

## Portfolio Ecosystem Integration

This CLI is part of KitsuneKode's developer ecosystem. See `apps/cli/CLI-SPEC.md` for the full spec on portfolio-aware scaffolding.

**Key context:**

- The portfolio at `kitsunekode.in` syncs project content from `SHOWCASE.mdx` files in GitHub repos
- Every scaffolded project should include a `SHOWCASE.mdx` template (fullstack family only)
- The portfolio uses Supabase as source of truth, with MDX files as one input source
- Projects are categorized by type: fullstack, web3, ai, mobile, infra
- See `apps/cli/CLI-SPEC.md` for implementation details on the portfolio-ready scaffolding extension
