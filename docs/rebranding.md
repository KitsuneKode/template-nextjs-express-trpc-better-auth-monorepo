# Rebranding checklist (Arche / KitsuneKode)

Use this when aligning display branding without breaking workspace package names (`@template/*`).

## Brand (canonical)

| Item        | Value                                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Product     | **Arche** — "The beginning of every project"                                                                                            |
| CLI         | `npx arche create` / `@arche/create`                                                                                                    |
| Site        | [arche.kitsunelabs.xyz](https://arche.kitsunelabs.xyz)                                                                                  |
| Portfolio   | [kitsunekode.in](https://kitsunekode.in)                                                                                                |
| GitHub repo | [template-nextjs-express-trpc-bettera-auth-monorepo](https://github.com/KitsuneKode/template-nextjs-express-trpc-bettera-auth-monorepo) |

## Safe to change (done or ongoing)

- [x] README title and tagline
- [x] `apps/web` metadata (`app/layout.tsx`), landing copy, navbar
- [x] CLI help (`apps/cli/src/index.ts`), `package.json` description for `@arche/create`
- [x] Deployment hub and three-path guides
- [x] `apps/server` root JSON title (`Arche API`)
- [x] Generated scaffold README / deployment text via CLI generators
- [x] `docs/README.md` intro

## Intentionally unchanged (high risk)

| Item                                | Reason                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| `@template/*` workspace scopes      | Hundreds of imports; use `bun run rename-scope` in **scaffolded** projects only |
| Root `package.json` name `template` | Turborepo filter scripts (`@template/web`, etc.)                                |
| GitHub repo slug                    | Links, clones, and `bun create turbo --example` URL                             |

## Optional follow-ups

1. Run `bun run rename-scope -- --to @my-org/*` only inside a **new** scaffold, not this template repo.
2. Rename GitHub repo to `arche` when ready (update README, navbar, CLI generator URLs).
3. Set production `NEXT_PUBLIC_SITE_*` on Vercel for [arche.kitsunelabs.xyz](https://arche.kitsunelabs.xyz).
4. Replace remaining `template-nextjs` strings in archive docs (low priority).

## Verify after edits

```bash
bun run repo:doctor
bun test
bun run format:check
```
