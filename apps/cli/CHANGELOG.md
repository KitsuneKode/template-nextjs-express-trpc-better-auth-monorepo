# Changelog

## 0.2.0 (unreleased)

### Added

- Security middleware: rate limiting, Helmet, compression, request tracing, cache headers, body size limits
- Health endpoint now checks database connectivity
- Request ID tracing middleware for log correlation
- Prisma query logging in development mode
- Agent documentation generation (AGENTS.md, CONTEXT.md, CLAUDE.md) for scaffolded projects
- SHOWCASE.mdx generator for portfolio-ready scaffolding
- Project README generation with stack summary and portfolio webhook note
- Config file support (`~/.arche`, `arche.json`)
- `arche` bin with `create` subcommand; `--dir` / `--family` flags
- Product bundle, portfolio SHOWCASE.mdx v2, family-gated transforms
- Portfolio metadata in scaffolded `package.json`
- Template CI workflow (`.github/workflows/ci.yml`)
- Integration tests for auth, post CRUD, and server health
- Scaffolded projects use root `AGENTS.md` only (no `.cursor/rules/` or `.claude/rules/`)
- `database=none` now properly strips Prisma artifacts

### Fixed

- `.env` files no longer leak into scaffolded output
- `@template/auth` package.json `module` field pointing to non-existent file
- `@template/backend-common` had empty main export
- `@template/trpc` listed unused `@template/common` dependency
- Server build/start script mismatch (`dist/app.js` vs `dist/server.js`)
- Hardcoded Bun version in CI generator
- `JWT_SECRET` leftover in generated env files (Better Auth uses `BETTER_AUTH_SECRET`)
- Prisma schema used `@@unique([email])` instead of `@unique`
- `autoSignIn` comment was misleading
- ORM generator pipeline ran database transform unnecessarily when ORM was Drizzle
- Stale test references in `docs/cli-development.md`

### Changed

- Added AGENTS.md for `packages/ui`
- `.claude/settings.local.json` removed from git tracking
- `docs/cli-development.md` file tree and test structure updated to match actual source
- Helped text marks experimental backends (Rust, Go, Python)

## 0.1.0

- Initial release
- Express and Hono backend support
- PostgreSQL, SQLite, MongoDB database support
- Prisma and Drizzle ORM support
- Better Auth integration
- Docker Compose generation
- GitHub Actions CI generation
- Deployment guide generation
