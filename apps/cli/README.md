# create-kitsu-stack

Bootstrap a new project from this template with an interactive Bun-native CLI.

## Local Usage

```sh
bun run dev:cli -- my-app
```

## Planned Published Usage

```sh
bunx create-kitsu-stack my-app
```

## What It Does

- copies the current template without repo-local noise such as `.git`,
  `node_modules`, editor folders, or local `.env` files
- renames the internal package scope from `@template/*` to match your project
- optionally strips the showcase routes and demo data
- optionally keeps or removes the worker and tests workspaces
- can generate Docker services, GitHub Actions CI, and deployment notes
