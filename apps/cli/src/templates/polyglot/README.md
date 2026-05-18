# @acme/polyglot

Multi-language monorepo scaffold.

## Services

| Service      | Path          | Language   | Framework         |
| ------------ | ------------- | ---------- | ----------------- |
| Web Frontend | `apps/web`    | TypeScript | Next.js           |
| API          | `apps/api`    | TypeScript | Express (default) |
| Worker       | `apps/worker` | TypeScript | Bun               |

## Getting Started

```sh
bun install
bun dev
```

## Adding Services

To add a Rust service:

```sh
cargo init services/my-service
```

To add a Go service:

```sh
mkdir -p services/my-service && cd services/my-service && go mod init my-service
```

Update `turbo.json` and `docker-compose.yml` as needed.
