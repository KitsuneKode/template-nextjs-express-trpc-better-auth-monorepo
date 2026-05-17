# Bootstrap CLI

`@kitsu/create` scaffolds family-first repositories from this template.
Each **family** produces a different project structure and uses its own
template source. Additive **bundles** layer optional features on top.

For CLI development documentation, see [cli-development.md](./cli-development.md).

## Quick Start

```bash
# Using npm/npx
npx @kitsu/create my-app

# Using Bun
bunx @kitsu/create my-app

# Using pnpm
pnpm create @kitsu my-app
```

## Usage

```text
@kitsu/create [project-name] [options]
```

### Options

| Flag                           | Description                                   | Default          |
| ------------------------------ | --------------------------------------------- | ---------------- |
| `--family=<name>`              | Project family (see table below)              | `ts-turbo`       |
| `--bundles=<name>`             | Additive bundles: `product`, `realtime`, etc. | `product`        |
| `--package-manager=<pm>`       | Package manager: `bun`, `pnpm`, `npm`         | `bun`            |
| `--yes`                        | Skip prompts, use defaults                    | `false`          |
| `--git` / `--no-git`           | Initialize git repository                     | `true`           |
| `--install` / `--no-install`   | Install dependencies after scaffolding        | `true`           |
| `--showcase` / `--no-showcase` | Keep landing/demo content (ts-turbo only)     | `false`          |
| `--worker` / `--no-worker`     | Keep background worker workspace              | `false`          |
| `--docker` / `--no-docker`     | Generate `docker-compose.yml`                 | `true`           |
| `--ci` / `--no-ci`             | Generate GitHub Actions workflow              | `true`           |
| `--tests=<mode>`               | Testing setup: `bun` or `none`                | `bun`            |
| `--deployment=<mode>`          | Deployment guide: `vercel-railway` or `none`  | `vercel-railway` |
| `--backend=<name>`             | Backend framework (ts-turbo/backend only)     | `express-bun`    |
| `--database=<name>`            | Database (ts-turbo/backend only)              | `postgres`       |
| `--orm=<name>`                 | ORM (ts-turbo/backend only)                   | `prisma`         |
| `--presets=<name>`             | Next.js presets (next only)                   | —                |
| `-v`, `--version`              | Show CLI version                              |                  |
| `-h`, `--help`                 | Show help                                     |                  |

### Families

| Family     | Description                    | Template Source           | Transforms                   |
| ---------- | ------------------------------ | ------------------------- | ---------------------------- |
| `ts-turbo` | Full-stack TypeScript monorepo | Repo root (full template) | Backend, DB, ORM             |
| `next`     | Standalone Next.js app         | `templates/next/`         | Strips server                |
| `backend`  | API-only service               | `templates/backend/`      | Backend, DB, ORM, strips web |
| `rust`     | Rust API service               | `templates/rust/`         | None                         |
| `solana`   | Solana program (Anchor)        | `templates/solana/`       | None                         |
| `convex`   | Next.js + Convex backend       | `templates/convex/`       | Strips server                |
| `worker`   | Background job worker          | `templates/worker/`       | None                         |
| `lib`      | Generic TypeScript package     | `templates/lib/`          | None                         |
| `cli`      | CLI package                    | `templates/cli/`          | None                         |
| `mobile`   | Expo mobile app                | `templates/mobile/`       | Strips server                |
| `polyglot` | Multi-language monorepo        | `templates/polyglot/`     | None                         |

### Bundles

Additive bundles layer optional cross-cutting features:

| Bundle     | Features                                |
| ---------- | --------------------------------------- |
| `product`  | Auth + DB + API (default)               |
| `realtime` | WebSocket + Worker + Docs               |
| `growth`   | Analytics + Feature Flags + A/B testing |
| `infra`    | Monitoring + Storage + CI/Deploy        |
| `ai`       | AI examples + Helpers + Docs            |

### Examples

```bash
# Interactive mode (prompts for all options)
npx @kitsu/create my-app

# Minimal Next.js app
npx @kitsu/create my-app --family=next

# API-only service with Hono and SQLite
npx @kitsu/create my-api --family=backend --backend=hono-bun --database=sqlite

# Solana program
npx @kitsu/create my-program --family=solana

# Non-interactive with all defaults
npx @kitsu/create my-app --yes

# Skip Docker and CI generation
npx @kitsu/create my-app --no-docker --no-ci

# Keep showcase content and worker (ts-turbo only)
npx @kitsu/create my-app --showcase --worker

# Minimal setup (no tests, no deployment guide)
npx @kitsu/create my-app --tests=none --deployment=none
```

## What Gets Generated

This depends on the selected family. All families get:

- Project-specific `README.md`
- `AGENTS.md`, `CONTEXT.md`, `CLAUDE.md` for AI-assisted development
- `.claude/rules/` directory with path-scoped agent rules

### Family-Specific Files

| Family     | env        | Docker   | CI       | Deployment | Showcase |
| ---------- | ---------- | -------- | -------- | ---------- | -------- |
| `ts-turbo` | Server+Web | Yes      | Yes      | Yes        | Optional |
| `next`     | Web        | Yes      | Yes      | Yes        | No       |
| `backend`  | Server     | Yes      | Yes      | Yes        | No       |
| Other      | Generated  | Optional | Optional | Optional   | No       |

Always generated for ts-turbo and backend:

- `apps/server/.env.example` — Express server environment template
- `docker-compose.yml` — Local PostgreSQL and Redis
- `.github/workflows/ci.yml` — CI pipeline

## Default Behaviors

When using `--yes` or accepting prompts defaults:

- **Family**: `ts-turbo` (full-stack TypeScript monorepo)
- **Backend**: Express (Bun)
- **Database**: PostgreSQL with Prisma ORM
- **Strip showcase**: Removes landing pages and demo content
- **Remove worker**: Removes background job workspace
- **Keep tests**: Keeps the Bun tests workspace
- **Generate Docker**: Creates `docker-compose.yml` with PostgreSQL and Redis
- **Generate CI**: Creates GitHub Actions workflow
- **Generate deployment guide**: Creates Vercel + Railway deployment docs
- **Initialize git**: Creates fresh git repository
- **Install dependencies**: Runs `bun install`

## Generated Project Structure

### ts-turbo family (default)

```text
my-app/
├── apps/
│   ├── web/              # Next.js frontend
│   └── server/           # Express + tRPC backend
├── packages/
│   ├── auth/             # Better Auth configuration
│   ├── common/           # Shared utilities
│   ├── store/            # Prisma schema and client
│   ├── trpc/             # tRPC routers and context
│   └── ui/               # Shared UI components
├── toolings/             # Oxlint, TypeScript configs
├── docker-compose.yml    # Local PostgreSQL + Redis
├── .github/workflows/    # CI pipeline
└── docs/
    └── deployment.md     # Deployment guide
```

### Other families

Each family scaffolds its own minimal structure. For example:

- `next` → standalone Next.js app (no monorepo)
- `backend` → Express API service (no web workspace)
- `rust` → Cargo project with `Cargo.toml` and `src/main.rs`
- `solana` → Anchor project with program skeleton
- `convex` → Next.js + Convex backend
- `polyglot` → Multi-language monorepo (Next.js web + Express API + Bun worker)

## Post-Scaffold Steps

After scaffolding:

```bash
cd my-app

# If you didn't run install
bun install

# Verify setup
bun run repo:doctor

# Start development
bun dev
```

## Environment Variables

Generated `.env.example` files appear in family-specific locations. For
ts-turbo and backend:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

### Server Environment (ts-turbo / backend)

| Variable             | Description                            |
| -------------------- | -------------------------------------- |
| `PORT`               | Server port (default: 8080)            |
| `DATABASE_URL`       | PostgreSQL connection string           |
| `REDIS_URL`          | Redis connection string                |
| `BETTER_AUTH_SECRET` | Auth secret (generate a random string) |
| `BETTER_AUTH_URL`    | Auth callback URL                      |
| `FRONTEND_URL`       | Frontend URL for CORS                  |

### Web Environment (ts-turbo / next / convex / polyglot)

| Variable              | Description     |
| --------------------- | --------------- |
| `NEXT_PUBLIC_APP_URL` | Public app URL  |
| `NEXT_PUBLIC_API_URL` | Backend API URL |

## Troubleshooting

### "Destination directory is not empty"

The CLI won't overwrite existing directories. Either:

- Use a different project name
- Delete the existing directory first

### Bun not found

The CLI requires Bun for post-scaffold operations. Install it:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Git initialization failed

Git must be installed for `--git`. The CLI will continue without git if
it's not available.

## Version Compatibility

| CLI Version | Template Compatibility |
| ----------- | ---------------------- |
| 0.1.x       | Initial release        |

Projects store their CLI version in `kitsu-stack.json` for future compatibility
checks.
