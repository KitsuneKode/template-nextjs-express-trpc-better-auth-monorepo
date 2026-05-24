# CI

GitHub Actions workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

Runs on `push` to `main`, `prod`, and `develop`, and on pull requests.

| Job         | Command                        | Purpose                                |
| ----------- | ------------------------------ | -------------------------------------- |
| Format      | `bun run format:check`         | Oxfmt repo formatting                  |
| Lint        | `bun run lint:affected`        | Turbo affected lint                    |
| Typecheck   | `bun run check-types:affected` | Turbo affected TypeScript checks       |
| Tests       | `bun run test:ci`              | CLI/tooling/unit tests                 |
| Build       | `bun run build:affected`       | Build changed packages and dependents  |
| Docs        | `bun run build:docs`           | Build the web/docs app                 |
| Package     | `bun run pkg:check`            | Build and dry-run pack `@arche/create` |
| Repo doctor | `bun run repo:doctor`          | Doc/path drift                         |

The workflow uses `TURBO_SCM_BASE` for pull-request affected runs and accepts
`TURBO_TEAM`/`TURBO_TOKEN` for remote caching. The token is only passed on
`push` to `main`.

Local parity before push:

```bash
bun run ci
bun run build:docs
bun run pkg:check
```
