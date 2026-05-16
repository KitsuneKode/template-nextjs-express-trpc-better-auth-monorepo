# Kitsune Stack — Master Rebuild Plan

This document is the single source of truth for everything this template/CLI
needs to become. It merges the bug-fix plan, the architectural decisions, and
the newly discovered gaps into one actionable document.

All 8 architectural branches have been resolved. All production patterns have
been audited. Everything below is ready for execution.

---

## ARCHITECTURAL DECISIONS (Resolved)

| Branch | Decision |
|--------|----------|
| 9 — Template engine | Keep "copy+rewrite". Extract large strings to files. No Handlebars. |
| 10 — CLI name | `@kitsu/create` / `create-kitsu-stack`. Stay. |
| 11 — Convex | Separate template type. NOT a backend option. |
| 12 — Auth | Better Auth = deep integration. Clerk = shallow, secondary. |
| 13 — Polyglot backends | TS = shipped. Rust/Go/Python = experimental, v3. |
| 14 — DB URLs | All providers as commented options in .env.example. No API fetching. |
| 15 — Docker | Dev compose + Prod compose + per-service Dockerfiles + Nginx. |
| 16 — shadcn | Shared UI for monorepo. Direct for standalone. ~/.kitsurc controls dir. |
| 17 — Priority | v1: ship + security + portfolio. v2: worker + config + docker. v3: expand. |

---

## PHASE 0 — IMMEDIATE FIXES

Safe, no-brainer fixes. Do these first.

### 0.1 Strip .env files from scaffold output
`apps/cli/src/lib/scaffold.ts`
- Add ALL .env files to EXCLUDED_FILES (not just non-.example)
- Rationale: template .env values leak into every scaffolded project

### 0.2 Fix stale docs and test references
`docs/cli-development.md`
- Remove `tests/args.test.ts` and `tests/integration.test.ts` references (don't exist)
- Update file tree to match actual structure
- Correct test listing to actual files

### 0.3 Add AGENTS.md for packages/ui
`packages/ui/AGENTS.md` (new)
- Standard template: purpose, read-first, owns, common tasks, cleanup notes

### 0.4 Fix @template/auth "module" field typo
`packages/auth/package.json`
- `"module": "src/app.ts"` → `"module": "src/index.ts"` (app.ts doesn't exist)

### 0.5 Remove settings.local.json from git
`.gitignore` + `git rm --cached .claude/settings.local.json`
- Local Claude Desktop config. Shouldn't be in repo.

### 0.6 Add .claude/rules/ for CLI and tests workspaces
`.claude/rules/cli-work.md` (new)
`.claude/rules/tests-work.md` (new)
- Path-scoped agent docs for workspaces that don't have them

---

## PHASE 1 — CORE HARDENING

Fixes structural issues in the codebase.

### 1.1 Fix Prisma @@unique convention
`packages/store/prisma/schema.prisma`
`apps/cli/src/lib/generators/database.ts` (SQLite + MongoDB schemas)
- `@@unique([email])` → `email String @unique`
- Drizzle schemas already correct (`.unique()`) — no change needed

### 1.2 Fix backend-common empty main export
`packages/backend-common/src/index.ts`
- Currently empty file. Add barrel export or remove to prevent silent no-op imports.

### 1.3 Fix server build/start mismatch
`apps/server/package.json`
- `"module": "src/server.ts"` but build outputs `dist/app.js` and start runs `dist/server.js`
- Align: either build from server.ts or fix start command

### 1.4 Remove unused @template/common dep from trpc
`packages/trpc/package.json`
- `@template/common` listed but never imported directly (only transitively)

### 1.5 Fix hardcoded Bun version in CI generator
`apps/cli/src/lib/generators/ci.ts`
- `bun-version: 1.3.9` hardcoded — read from root package.json or use `latest`

### 1.6 Fix database=none generator
`apps/cli/src/lib/generators/database.ts`
- Currently no-op. After "no database" selection, Prisma files remain and break builds.
- Must: strip Prisma from store, remove store dep from apps that use it

### 1.7 Remove JWT_SECRET leftover from generated env
`apps/cli/src/lib/generators/env.ts`
- `JWT_SECRET=replace-me` is dead — Better Auth uses `BETTER_AUTH_SECRET`

### 1.8 Fix auth autoSignIn default
`packages/auth/src/index.ts`
- `autoSignIn: false` with comment saying "defaults to true" — verify intent

### 1.9 Add request ID / tracing middleware
`apps/server/src/middlewares/tracing-middleware.ts` (new)
- UUID per request, injected into req object
- Passed to tRPC context for log correlation
- Essential for debugging production request chains

### 1.10 Fix Prisma query logging
`packages/store/src/index.ts`
- Add `log: ['query', 'info', 'warn', 'error']` to PrismaClient constructor
- Conditionally enable in development only

### 1.11 Fix health endpoint to check DB
`apps/server/src/app.ts`
- `/health` should ping Prisma: `await db.$queryRaw\`SELECT 1\``
- Also check Redis connectivity if REDIS_URL is configured

---

## PHASE 2 — QUALITY & TESTING

Build the safety net so every change is validated.

### 2.1 Add template CI workflow
`.github/workflows/ci.yml` (new)
- lint → check-types → test (CLI + tests workspace) → repo:doctor (not strict)

### 2.2 Add runtime integration tests
`tests/src/integration/` (new directory)
- Auth flow: register → login → session → protected procedure → logout
- Post CRUD: create → read → update → delete via tRPC
- Server health: GET /health → 200 with DB ping
- Schema validation: Zod rejects invalid inputs

### 2.3 Add scaffold output E2E tests
`tests/src/scaffold-output/` (new directory)
- For each "tested" combo, scaffold to /tmp → bun install → check-types passes
- Prevents template changes from silently breaking scaffolded output

### 2.4 Fix ORM generator pipeline waste
`apps/cli/src/lib/scaffold.ts`
- When orm=drizzle, skip database transform entirely (Drizzle generates its own schema)
- Current: runs SQLite transform then Drizzle deletes it — wasted work

### 2.5 Add pre-commit type checking
`lint-staged.config.mjs`
- Add `tsc --noEmit` or `bun run check-types` to pre-commit hooks
- Current: only eslint + prettier + markdownlint run

---

## PHASE 3 — SECURITY LAYER

Every production app needs these. All currently MISSING.

### 3.1 Rate limiting middleware
`apps/server/src/middlewares/rate-limit-middleware.ts` (new)
- Express-rate-limit on `/api/auth/*` routes (prevent brute force)
- Stricter limits for login/register endpoints
- Configurable via env vars

### 3.2 Security headers (Helmet)
`apps/server/src/app.ts`
- Add `helmet()` middleware
- Sets CSP, HSTS, X-Frame-Options, XSS-Protection headers

### 3.3 Body size limit
`apps/server/src/app.ts`
- `express.json({ limit: '1mb' })` — currently unlimited

### 3.4 CSRF protection for non-tRPC routes
`apps/server/src/middlewares/csrf-middleware.ts` (new)
- For routes outside tRPC (webhooks, etc.)
- Double-submit cookie pattern or SameSite cookie enforcement

### 3.5 Compression middleware
`apps/server/src/app.ts`
- Add `compression()` for gzip/brotli on Express responses

### 3.6 Cache header middleware
`apps/server/src/middlewares/cache-middleware.ts` (new)
- Static assets: long cache with content hash
- API responses: no-cache or short TTL

---

## PHASE 4 — CLI PUBLISH & POLISH

### 4.1 Publish @kitsu/create to npm
`apps/cli/package.json`
- Bump to 0.2.0
- CHANGELOG.md
- npm publish --access public
- Update root README with npx path as primary

### 4.2 Add --help clarity on experimental options
`apps/cli/src/index.ts`
- Mark Rust/Go/Python as `(experimental)` in help text
- Mark Mongoose, Drizzle+MongoDB as limited

### 4.3 Config file support
`apps/cli/src/lib/config.ts` (new)
- Read `~/.kitsurc` (JSONC) for personal defaults
- Read `kitsu.jsonc` for project-level overrides
- Merge order: flags > project config > user config > hardcoded defaults

### 4.4 Trim CLI AGENTS.md
`apps/cli/AGENTS.md`
- 156 → <50 lines. Move combo table, tree, test structure to docs/cli-development.md

### 4.5 Generate AGENTS.md + .claude/ in scaffolded projects
`apps/cli/src/lib/generators/agent-docs.ts` (new)
- Scaffolded projects currently get ZERO agent docs (.claude/ is excluded)
- Generate: root AGENTS.md with project map, CLAUDE.md pointer, .claude/rules/ with path-scoped rules for their specific stack choices
- This is the biggest AI-DX gap: the template has excellent agent docs but produces projects with none

### 4.6 Generate CONTEXT.md
`apps/cli/src/lib/generators/agent-docs.ts`
- Every scaffolded project gets a CONTEXT.md documenting:
  - Stack choices made during scaffolding
  - Architecture overview
  - Key entry points
  - Environment variables and their purpose

---

## PHASE 5 — PORTFOLIO-READY

The distinguishing feature — what makes this YOUR tool.

### 5.1 SHOWCASE.mdx generator
`apps/cli/src/lib/generators/showcase.ts` (new)
- Frontmatter with project name, type, tags, GitHub URL
- Sections: Why I Built This, Architecture, Key Decisions
- CLI prompt after project name

### 5.2 Portfolio metadata in root package.json
`apps/cli/src/lib/scaffold.ts`
- Add `"portfolio": { "type": "...", "tags": [...], "featured": false }`
- Type maps from template selection

### 5.3 GitHub webhook note in scaffolded README
`apps/cli/src/lib/generators/readme.ts` (new)
- Auto-sync note + optional GitHub Actions workflow

### 5.4 Design tokens export
`packages/ui/src/tokens/` (new directory)
- Color palette, typography, spacing, shadows — all from your portfolio branding
- Scaffolded projects inherit these as defaults

### 5.5 SEO metadata utility
`apps/web/lib/seo.ts` (new) + generated in scaffolded projects
- `buildMetadata()` helper that generates OG images, Twitter cards, JSON-LD schema
- Reusable across all pages instead of each page defining metadata inline

---

## PHASE 6 — WORKER (MAKE IT REAL)

### 6.1 BullMQ queue implementation
`apps/worker/src/queue.ts` (new)
`apps/worker/src/jobs/` (new directory)
- BullMQ worker + queue definitions
- Job stubs with typed job data

### 6.2 Bull Board dashboard
`apps/worker/src/dashboard.ts` (new) or mounted in server
- Queue visibility UI
- Job retry, failure inspection, metrics

### 6.3 Worker turbo.json + root pipeline
`apps/worker/turbo.json`, `turbo.json`
- Wire worker into dev pipeline

---

## PHASE 7 — DOCKER & DEPLOYMENT

### 7.1 Per-service Dockerfiles
`apps/server/Dockerfile` (new generator)
`apps/worker/Dockerfile` (new generator)
- Multi-stage builds
- Production-optimized

### 7.2 Production Docker Compose
`apps/cli/src/lib/generators/docker.ts`
- Extend with `docker-compose.prod.yml`
- Nginx reverse proxy, TLS, separate network

### 7.3 Nginx config generation
`apps/cli/src/lib/generators/nginx.ts` (new)
- Generated `nginx/nginx.conf` with reverse proxy, WebSocket support, SSL, rate limiting

### 7.4 Environment nesting in .env.example
`apps/cli/src/lib/generators/env.ts`
- Commented Supabase/Neon URLs alongside docker-local defaults
- Production checklist comments

### 7.5 Local SSL for OAuth development
`apps/cli/src/lib/generators/env.ts` or separate setup script
- mkcert or Caddy integration
- OAuth providers require HTTPS on localhost

---

## PHASE 8 — PRODUCT PAGES & PATTERNS

The boring-but-required pages every real product needs.

### 8.1 Starter pages
`apps/web/app/about/page.tsx` (generated)
`apps/web/app/contact/page.tsx` (generated)
`apps/web/app/privacy/page.tsx` (generated — policy stub)
`apps/web/app/terms/page.tsx` (generated — policy stub)
- Clean, minimal starter content
- Contact page wired with email addon when selected

### 8.2 Cookie consent component
`packages/ui/src/components/cookie-consent.tsx` (new)
- GDPR-compliant cookie banner
- Toggle-able via config

### 8.3 Session management page
`apps/web/app/settings/sessions/page.tsx` (generated)
- List active sessions
- Revoke individual sessions
- Uses existing auth router

### 8.4 API error standard
`packages/common/src/types/errors.ts` (new)
- ErrorCode enum
- APIError class
- Consistent error response format used by all tRPC procedures

---

## PHASE 9 — ADDON ECOSYSTEM

Each addon is a `--addon=<name>` CLI option that generates files and adds deps.

### 9.1 File upload addon
- Uploadthing integration or S3/R2 direct
- Upload component + API route
- Image optimization pipeline

### 9.2 Email addon
- Resend integration
- Transactional email template
- Contact form wired to email

### 9.3 Webhook addon
- Webhook receiver middleware with signature verification
- Stripe webhook handler stub
- GitHub webhook handler stub

### 9.4 Analytics addon
`packages/ui/src/components/analytics-provider.tsx` (generated)
- PostHog or Plausible provider component
- Ready to configure with env var
- Wired into root layout

### 9.5 Storybook for shared UI
`.storybook/` (config generated for scaffolded projects)
`packages/ui/src/**/*.stories.tsx`
- Component playground for shared UI package
- Auto-detected by the CLI during scaffolding

---

## PHASE 10 — TEMPLATE TYPE EXPANSION

### 10.1 Template type architecture
`apps/cli/src/lib/templates/` (new directory)
`apps/cli/src/types/schemas.ts`
- Define `TemplateType` enum
- Each type has: sourceDir, cleanupTargets, compatibleBackends, generators
- Currently only monorepo shipped

### 10.2 Convex + Next.js template
`apps/cli/src/templates/convex-nextjs/` (new)
- apps/web/ + convex/ — no server, no tRPC, no auth package
- Convex handles everything

### 10.3 Standalone Next.js template
`apps/cli/src/templates/standalone-nextjs/` (new)
- Single app, no monorepo
- API routes instead of separate server

### 10.4 Backend-only template
`apps/cli/src/templates/backend-only/` (new)
- No UI, just Express/Hono + auth + DB
- CLI-first interaction

---

## DELIVERY ORDER

Safe to ambitious. Each block builds on the previous.

```
Sprint 1 (now):   P0 + P1 (1-7, 9-11)     — safety fixes
Sprint 2:         P2 + P3                   — tests + security
Sprint 3:         P4                        — CLI publish + config
Sprint 4:         P5                        — portfolio-ready
Sprint 5:         P6 + P7                   — worker + docker
Sprint 6:         P8 + P9                   — product pages + addons
Sprint 7+:        P10                       — template expansion
```

---

## SUMMARY STATS

| Category | Items |
|----------|-------|
| Bug fixes / cleanup | 12 items (P0 + P1) |
| Testing & CI | 5 items (P2) |
| Security | 6 items (P3) |
| CLI polish & AI-DX | 6 items (P4) |
| Portfolio integration | 5 items (P5) |
| Worker | 3 items (P6) |
| Docker & deployment | 5 items (P7) |
| Product pages & patterns | 4 items (P8) |
| Addon ecosystem | 5 items (P9) |
| Template expansion | 4 items (P10) |

**Total: 55 items**

---

## NEXT STEP

Pick the first sprint to start executing. I can begin with Sprint 1 (P0 + P1)
or jump to whatever area matters most to you right now.
