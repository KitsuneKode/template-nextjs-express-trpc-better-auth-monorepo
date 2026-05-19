# @arche/create

Arche bootstrap CLI — scaffold production-ready monorepos from this template.

**Site:** [arche.kitsunelabs.xyz](https://arche.kitsunelabs.xyz)

## Usage

```sh
npx arche create my-app
npx arche create my-app fullstack --yes --dir=/tmp/projects
bunx create-arche my-app          # alias
npx @arche/create my-app          # scoped alias
```

## Subcommands

| Command               | Description                               |
| --------------------- | ----------------------------------------- |
| `create`              | Scaffold a project (default when omitted) |
| `mcp`                 | MCP server for AI agents                  |
| `create-json <json>`  | Non-interactive JSON config               |
| `validate <json>`     | Validate config only                      |
| `add <feature> [dir]` | Add docker, ci, websocket, …              |
| `history`             | Recent scaffolds (`~/.arche`)             |

## Families

`fullstack` (default), `next`, `backend`, `rust`, `solana`, `convex`, `worker`, `lib`, `cli`, `mobile`, `polyglot`

Backend / database / ORM transforms apply to **fullstack** only.

## Development

```sh
cd apps/cli
bun run dev -- my-app --yes --dir=/tmp/test
bun test
bun run build
```

See [docs/cli-development.md](../../docs/cli-development.md) in the repo root.
