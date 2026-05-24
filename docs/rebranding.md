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

## Source of truth

| Item                     | Value               | Reason                                                                                              |
| ------------------------ | ------------------- | --------------------------------------------------------------------------------------------------- |
| Root `package.json` name | `arche-template`    | Canonical source-template package name. Generated projects replace it with the chosen project slug. |
| Internal workspace scope | `@arche-template/*` | Source template packages. Generated projects are renamed by the CLI to `@<project-name>/*`.         |
| Public CLI package       | `@arche/create`     | User-facing npm package. Keep this separate from source template workspaces.                        |
| GitHub repo target       | `kitsunekode/arche` | Recommended canonical repo name for docs, package metadata, and site links.                         |

## Package-scope rule

Keep **`@arche-template/*`** inside this source repo. Keep `@arche/create`
reserved for the published CLI. This makes the difference clear:

- `@arche/create` - user-facing npm package.
- `@arche-template/web`, `@arche-template/server`, etc. - source template
  workspaces inside this repo.
- `@my-app/web`, `@my-app/server`, etc. - generated project workspaces after
  `rename-scope` runs.

`rename-scope` defaults to migrating `@arche-template/*` to the root
`package.json` name. It also accepts explicit flags:

```bash
bun toolings/scripts/rename-scope.ts --from @arche-template --to @my-app
```

## Optional follow-ups

1. Rename GitHub repo to `arche` when ready, then update GitHub description,
   topics, homepage URL, and npm trusted-publisher config.
2. Replace `apps/web/public/brand/template-*` with Arche-specific mark assets.
3. Generate or design a proper OG image and icon set for [arche.kitsunelabs.xyz](https://arche.kitsunelabs.xyz).
4. Set production `NEXT_PUBLIC_SITE_*` on Vercel for [arche.kitsunelabs.xyz](https://arche.kitsunelabs.xyz).
5. Replace remaining `template-nextjs` strings in archive docs only when archive
   cleanup becomes worth the noise.

## Verify after edits

```bash
bun run repo:doctor
bun test
bun run format:check
```
