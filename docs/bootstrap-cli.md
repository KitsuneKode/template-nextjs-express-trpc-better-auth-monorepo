# Arche CLI (bootstrap)

The bootstrap CLI lives in `apps/cli` and publishes as `@arche/create` with the `arche` binary.

## Quick start

```sh
# Published (after npm publish)
npx arche create my-app

# From this monorepo
bun run dev:cli -- my-app --yes --dir=../projects
```

Use `--dir` when scaffolding **outside** the template repository (required if your cwd is inside the monorepo).

## Common flags

| Flag                  | Description                                |
| --------------------- | ------------------------------------------ |
| `--yes`               | Non-interactive defaults                   |
| `--dir=<path>`        | Parent output directory                    |
| `--family=<name>`     | Project family (or second positional arg)  |
| `--showcase`          | Keep demo routes + generate `SHOWCASE.mdx` |
| `--worker`            | Keep `apps/worker`                         |
| `--pm=bun\|pnpm\|npm` | Package manager                            |
| `--dry-run`           | Plan files without writing                 |

## Families

`fullstack`, `next`, `backend`, `rust`, `solana`, `convex`, `worker`, `lib`, `cli`, `mobile`, `polyglot`

Only **fullstack** runs backend/database/ORM transforms and monorepo bundles.

## More

- Developer guide: [cli-development.md](./cli-development.md)
- Portfolio sync: [portfolio-sync.md](./portfolio-sync.md)
- Site: [arche.kitsunelabs.xyz](https://arche.kitsunelabs.xyz)
