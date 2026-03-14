# Bootstrap CLI

`@kitsu/create` is the bootstrap CLI for this template. It scaffolds
production-ready full-stack TypeScript monorepos with customizable options.

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

| Flag                           | Description                                  | Default          |
| ------------------------------ | -------------------------------------------- | ---------------- |
| `--yes`                        | Skip prompts, use defaults                   | `false`          |
| `--git` / `--no-git`           | Initialize git repository                    | `true`           |
| `--install` / `--no-install`   | Run `bun install` after scaffolding          | `true`           |
| `--showcase` / `--no-showcase` | Keep landing/demo content                    | `false`          |
| `--worker` / `--no-worker`     | Keep background worker workspace             | `false`          |
| `--docker` / `--no-docker`     | Generate `docker-compose.yml`                | `true`           |
| `--ci` / `--no-ci`             | Generate GitHub Actions workflow             | `true`           |
| `--tests=<mode>`               | Testing setup: `bun` or `none`               | `bun`            |
| `--deployment=<mode>`          | Deployment guide: `vercel-railway` or `none` | `vercel-railway` |
| `-v`, `--version`              | Show CLI version                             |                  |
| `-h`, `--help`                 | Show help                                    |                  |

### Examples

```bash
# Interactive mode (prompts for all options)
npx @kitsu/create my-app

# Non-interactive with all defaults
npx @kitsu/create my-app --yes

# Skip Docker and CI generation
npx @kitsu/create my-app --no-docker --no-ci

# Keep showcase content and worker
npx @kitsu/create my-app --showcase --worker

# Minimal setup (no tests, no deployment guide)
npx @kitsu/create my-app --tests=none --deployment=none
```

## What Gets Generated

### Always Generated

| File                       | Description                         |
| -------------------------- | ----------------------------------- |
| `apps/web/.env.example`    | Next.js environment template        |
| `apps/server/.env.example` | Express server environment template |

### Conditional Files

| File                       | Condition                               |
| -------------------------- | --------------------------------------- |
| `docker-compose.yml`       | `--docker` (default: yes)               |
| `.github/workflows/ci.yml` | `--ci` (default: yes)                   |
| `docs/deployment.md`       | `--deployment=vercel-railway` (default) |

## Default Behaviors

When using `--yes` or accepting prompts defaults:

- **Strip showcase**: Removes landing pages and demo content
- **Remove worker**: Removes background job workspace
- **Keep tests**: Keeps the Bun tests workspace
- **Generate Docker**: Creates `docker-compose.yml` with PostgreSQL and Redis
- **Generate CI**: Creates GitHub Actions workflow
- **Generate deployment guide**: Creates Vercel + Railway deployment docs
- **Initialize git**: Creates fresh git repository
- **Install dependencies**: Runs `bun install`

## Generated Project Structure

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
├── toolings/             # ESLint, TypeScript configs
├── docker-compose.yml    # Local PostgreSQL + Redis
├── .github/workflows/    # CI pipeline
└── docs/
    └── deployment.md     # Deployment guide
```

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

Copy the generated `.env.example` files:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

### Server Environment

| Variable             | Description                            |
| -------------------- | -------------------------------------- |
| `PORT`               | Server port (default: 8080)            |
| `DATABASE_URL`       | PostgreSQL connection string           |
| `REDIS_URL`          | Redis connection string                |
| `BETTER_AUTH_SECRET` | Auth secret (generate a random string) |
| `BETTER_AUTH_URL`    | Auth callback URL                      |
| `FRONTEND_URL`       | Frontend URL for CORS                  |

### Web Environment

| Variable              | Description     |
| --------------------- | --------------- |
| `NEXT_PUBLIC_APP_URL` | Public app URL  |
| `NEXT_PUBLIC_API_URL` | Backend API URL |

## Local Development with Docker

If you generated Docker services:

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Your DATABASE_URL will be:
# postgresql://postgres:postgres@localhost:5432/<project_name>
```

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
