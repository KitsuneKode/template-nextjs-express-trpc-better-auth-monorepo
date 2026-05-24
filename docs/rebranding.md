# Rebranding checklist (Arche / KitsuneKode)

Use this when aligning display branding without breaking workspace package names.

## Brand (canonical)

| Item        | Value                                                  |
| ----------- | ------------------------------------------------------ |
| Product     | **Arche** — "The beginning of every project"           |
| CLI         | `npx arche create` / `@arche/create`                   |
| Site        | [arche.kitsunelabs.xyz](https://arche.kitsunelabs.xyz) |
| Portfolio   | [kitsunekode.in](https://kitsunekode.in)               |
| GitHub repo | Recommended rename: `arche` or `arche-cli`             |

## Recommendation

Rename the repository to **`arche`** if it will be the canonical product home.
Use **`arche-cli`** only if the web/docs app later moves into a separate repo.

Suggested GitHub description:

> Personal project-vault and scaffold CLI for TypeScript monorepos, Rust
> services, Solana apps, and agent-ready project context.

Suggested topics:

```text
cli, scaffolding, turborepo, bun, pnpm, nextjs, rust, solana, better-auth, trpc, project-template
```

## Safe to change (done or ongoing)

- [x] README title and tagline
- [x] `apps/web` metadata (`app/layout.tsx`), landing copy, navbar
- [x] CLI help (`apps/cli/src/index.ts`), `package.json` description for `@arche/create`
- [x] Deployment hub and three-path guides
- [x] `apps/server` root JSON title (`Arche API`)
- [x] Generated scaffold README / deployment text via CLI generators
- [x] `docs/README.md` intro

## Intentionally unchanged (high risk)

| Item                                    | Reason                                                                             |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| `@template/*` internal workspace scopes | They describe template source packages. Generated projects are renamed by the CLI. |
| Root `package.json` name `template`     | Turborepo filter scripts (`@template/web`, etc.) still depend on it.               |

## Future package-scope option

If the internal source scopes are renamed, prefer **`@arche-template/*`** over
`@arche/*`. Keep `@arche/create` reserved for the published CLI. This makes the
difference clear:

- `@arche/create` - user-facing npm package.
- `@arche-template/web`, `@arche-template/server`, etc. - source template
  workspaces inside this repo.

Do this only as a dedicated migration because it touches imports, Turborepo
filters, docs, generated output tests, and deployment references.

## Optional follow-ups

1. Run `bun run rename-scope -- --to @my-org/*` only inside a **new** scaffold, not this template repo.
2. Rename GitHub repo to `arche` when ready, then update README, package
   repository URLs, docs links, navbar links, and npm trusted-publisher config.
3. Replace `apps/web/public/brand/template-*` with Arche-specific mark assets.
4. Generate or design a proper OG image and icon set for `arche.kitsunelabs.xyz`.
5. Set production `NEXT_PUBLIC_SITE_*` on Vercel for [arche.kitsunelabs.xyz](https://arche.kitsunelabs.xyz).
6. Replace remaining `template-nextjs` strings in archive docs only when archive
   cleanup becomes worth the noise.

## Verify after edits

```bash
bun run repo:doctor
bun test
bun run format:check
```
