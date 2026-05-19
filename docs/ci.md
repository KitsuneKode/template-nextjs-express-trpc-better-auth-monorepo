# CI

GitHub Actions workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

Runs on `push` to `main` and on pull requests.

| Step                        | Command                                          | Purpose                |
| --------------------------- | ------------------------------------------------ | ---------------------- |
| Install                     | `bun install --frozen-lockfile`                  | Reproducible deps      |
| Format                      | `bun run format:check`                           | Oxfmt                  |
| Lint                        | `bun run lint`                                   | Oxlint                 |
| Types                       | `bun run check-types`                            | TypeScript             |
| Test                        | `bun test`                                       | Unit/integration       |
| Build server (Docker paths) | `bun run build --filter=@template/server`        | Render / Railway image |
| Build server (Vercel)       | `bun run build:vercel --filter=@template/server` | Path A bundle          |
| Repo doctor                 | `bun run repo:doctor`                            | Doc/path drift         |
| Docker smoke                | `docker build -f apps/server/Dockerfile .`       | API image builds       |

Local parity before push:

```bash
bun run format:check && bun run lint && bun run check-types && bun test && bun run repo:doctor
```
