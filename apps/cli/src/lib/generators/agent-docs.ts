import type { ProjectConfig } from '../../types/schemas'
import { sanitizeProjectName } from '../slug'

function keyDirs(config: ProjectConfig): string[] {
  const { family, includeWorker } = config
  const dirs: string[] = []

  if (family === 'fullstack') {
    dirs.push('`apps/web` — Next.js frontend')
    dirs.push('`apps/server` — Express API server')
    if (includeWorker) dirs.push('`apps/worker` — Background job processing')
    dirs.push('`packages/auth` — Better Auth configuration')
    dirs.push('`packages/store` — Database schema and client')
    dirs.push('`packages/trpc` — tRPC routers and context')
    dirs.push('`packages/ui` — Shared UI components')
  } else if (family === 'next') {
    dirs.push('`app` — Next.js App Router pages')
    dirs.push('`components` — React components')
    if (config.presets.includes('auth')) dirs.push('`lib/auth` — Auth configuration')
  } else if (family === 'backend') {
    dirs.push('`src` — API source')
    dirs.push('`prisma` — Database schema')
    dirs.push('`packages/auth` — Auth configuration')
  } else if (family === 'convex') {
    dirs.push('`app` — Next.js App Router pages')
    dirs.push('`convex` — Convex functions and schema')
  } else if (family === 'rust') {
    dirs.push('`src/app.rs` — Axum router composition')
    dirs.push(
      '`src/modules/<feature>/` — routes, handler, service, repository, dto, mapper, policy',
    )
    dirs.push('`src/common` patterns live in `error.rs`, `config.rs`, `state.rs`, `middleware/`')
    dirs.push('`migrations/` — SQL migrations (when sqlx enabled)')
  } else if (family === 'worker') {
    dirs.push('`src` — Worker source')
    dirs.push('`src/queue.ts` — Queue definitions')
  } else if (family === 'lib') {
    dirs.push('`src` — Package source')
  } else if (family === 'cli') {
    dirs.push('`src` — CLI source')
    dirs.push('`CHANGELOG.md` — Release notes')
  } else if (family === 'solana') {
    dirs.push('`programs` — Anchor programs')
    dirs.push('`tests` — Program tests')
  } else if (family === 'mobile') {
    dirs.push('`app` — Expo Router screens')
    dirs.push('`components` — Reusable components')
  }

  return dirs
}

function commandsForFamily(family: string, pm: string): string[] {
  const run = pm === 'bun' ? 'bun run' : pm === 'pnpm' ? 'pnpm' : 'npm run'

  const cmds: string[] = [
    `- \`${pm} dev\` — Start development`,
    `- \`${run} build\` — Build all packages`,
    `- \`${run} lint\` — Lint all packages`,
    `- \`${run} check-types\` — Type check all packages`,
  ]

  if (family === 'fullstack' || family === 'backend') {
    cmds.push(`- \`${run} db:generate\` — Generate database client`)
    cmds.push(`- \`${run} db:migrate\` — Run database migrations`)
  }

  if (family === 'rust') {
    return [
      '- `cargo run` — Start API',
      '- `cargo test` — Tests',
      '- `cargo fmt` — Format',
      '- `cargo clippy -- -D warnings` — Lint',
      '- `sqlx migrate run` — Apply migrations (when database enabled)',
    ]
  }

  return cmds
}

function agentPrompt(family: string): string[] {
  const prompts: string[] = [
    'Before making changes, read the relevant files listed under Key Directories.',
    'Update CONTEXT.md and this AGENTS.md when adding new endpoints, packages, or auth flows.',
    'Run `bun run repo:doctor` after structural changes to verify consistency.',
    'Update SHOWCASE.mdx when adding significant features.',
  ]

  if (family === 'rust') {
    prompts.push(
      'New features: add `src/modules/<name>/` with routes → handler → service → repository; keep handlers thin.',
    )
    prompts.push('Never return `model` structs from handlers — map to DTOs in `mapper.rs`.')
    prompts.push('PATCH DTOs use `Option` fields; reject empty patches in the service layer.')
  }

  if (family === 'fullstack') {
    prompts.push(
      'When adding a new tRPC procedure: create the router, add to _app.ts, update trpc.md rule.',
    )
    prompts.push(
      'When modifying the Prisma schema: run db:generate and db:migrate, update the store rule.',
    )
  }

  return prompts
}

export function buildRootAgentsMd(config: ProjectConfig): string {
  const name = sanitizeProjectName(config.projectName)
  const dirs = keyDirs(config)
  const cmds = commandsForFamily(config.family, config.packageManager ?? 'bun')
  const prompts = agentPrompt(config.family)
  const pm = config.packageManager ?? 'bun'

  return `---
navigation:
  entry: AGENTS.md
  version: generated
  generator: '@arche/create@0.2.0'
  stack:
    family: ${config.family}
    backend: ${config.backend}
    database: ${config.database}
    orm: ${config.orm}
    pm: ${pm}
---

# ${name}

## Quick Start

\`\`\`bash
${pm} install
${pm} dev
\`\`\`

## Stack

- **Family**: ${config.family}
- **Runtime**: ${config.runtime}
${config.backend !== 'none' ? `- **Backend**: ${config.backend}\n` : ''}${config.database !== 'none' ? `- **Database**: ${config.database}\n` : ''}${config.orm !== 'none' ? `- **ORM**: ${config.orm}\n` : ''}${config.presets.length > 0 ? `- **Presets**: ${config.presets.join(', ')}\n` : ''}
## Key Directories

${dirs.map((d) => `- ${d}`).join('\n')}

## Commands

${cmds.join('\n')}

## Agent Protocol

{/* These instructions are for AI agents modifying this project. */}

- Use this file and the nearest workspace \`AGENTS.md\` — do not add \`.cursor/rules/\` or \`.claude/rules/\`.

${prompts.map((p) => `- ${p}`).join('\n')}

## Maintenance

When modifying this project as an agent:
1. Read the relevant file first — don't guess
2. Run lint + typecheck after changes
3. Update this file if directory structure changes
4. Keep SHOWCASE.mdx in sync with the project's actual state
`
}

export function buildContextMd(config: ProjectConfig): string {
  const name = sanitizeProjectName(config.projectName)
  const family = config.family

  const descriptions: Record<string, string> = {
    fullstack: `A full-stack TypeScript monorepo scaffolded with @arche/create.

## Architecture

- **Frontend**: Next.js (App Router) in \`apps/web\`
- **Backend**: ${config.backend} in \`apps/server\`
- **Database**: ${config.database} via ${config.orm}
- **Auth**: Better Auth with session-based authentication
- **API Layer**: tRPC for end-to-end type safety
- **UI**: Shared component library at \`packages/ui\`
- **Monorepo**: Turborepo with Bun as package manager

## Key Entry Points

- Server app setup: \`apps/server/src/app.ts\`
- tRPC context and procedures: \`apps/server/src/modules/trpc/trpc.ts\`
- Database schema: \`packages/store/prisma/schema.prisma\`${config.orm === 'drizzle' ? '\n- Database schema: `packages/store/src/schema.ts`' : ''}
- Auth configuration: \`packages/auth/src/index.ts\`
- Frontend providers: \`apps/web/components/providers.tsx\`
- tRPC client setup: \`apps/web/trpc/client.tsx\`

## Environment Variables

See \`apps/server/.env.example\` and \`apps/web/.env.example\` for required variables.`,
    next: `A standalone Next.js application scaffolded with @arche/create.

## Architecture

- **Frontend**: Next.js (App Router)
${config.presets.includes('auth') ? '- **Auth**: Better Auth\n' : ''}${config.presets.includes('docs') ? '- **Docs**: Fumadocs\n' : ''}- **Runtime**: Bun

## Key Entry Points

- App layout: \`app/layout.tsx\`
- App pages: \`app/\` (App Router directories)
${config.presets.includes('auth') ? '- Auth config: `lib/auth`\n' : ''}
## Environment Variables

See \`.env.example\` at the project root.`,
    backend: `An API service scaffolded with @arche/create.

## Architecture

- **Backend**: ${config.backend}
- **Database**: ${config.database} via ${config.orm}
- **Auth**: Better Auth
- **Runtime**: Bun

## Key Entry Points

- Server setup: \`src/app.ts\`
- Database schema: \`prisma/schema.prisma\`
- Auth configuration: \`packages/auth/src/index.ts\`

## Environment Variables

See \`.env.example\` for required variables.`,
    rust: `A Rust API service scaffolded with @arche/create.

## Architecture

Layered modules under \`src/modules/<feature>/\`:

\`\`\`
routes → handler → service → repository → db
              ↓         ↓
            dto      policy / mapper
\`\`\`

- **routes.rs** — URL + HTTP method wiring only (no DB, no business rules)
- **handler.rs** — HTTP extraction/response (Axum types allowed here only)
- **service.rs** — business logic; framework-agnostic inputs
- **repository.rs** — sqlx queries only
- **dto.rs** — API request/response shapes (serde)
- **model.rs** — internal/DB records (never return directly)
- **mapper.rs** — model → response DTO
- **policy.rs** — pure permission checks

## HTTP semantics

- POST create, GET read/list, PATCH partial update, DELETE remove
- Do not use PUT unless implementing full replacement

## Errors

Use \`AppError\` and consistent JSON: \`{ "error": { "code", "message" } }\`

## Key entry points

- \`src/main.rs\` — startup
- \`src/app.rs\` — router + middleware
- \`src/state.rs\` — shared AppState (pool + config)
- \`src/modules/health\` — health check
${config.example === 'posts' ? '- `src/modules/posts` — example CRUD module\n' : ''}
## Environment

See \`.env.example\` (\`PORT\`, \`DATABASE_URL\`, \`RUST_LOG\`).`,
    convex: `A Next.js + Convex application scaffolded with @arche/create.

## Architecture

- **Frontend**: Next.js (App Router)
- **Backend**: Convex (serverless)
- **Auth**: Better Auth with Convex integration
- **Real-time**: Built-in Convex subscriptions

## Key Entry Points

- Convex functions: \`convex/\`
- Convex schema: \`convex/schema.ts\`
- App pages: \`app/\``,
  }

  const description = descriptions[family] ?? `A ${family} project scaffolded with @arche/create.`

  return `# ${name} — Context

${description}
`
}

export function buildClaudeMd(): string {
  return `# Claude Code

Read **[AGENTS.md](./AGENTS.md)** — canonical agent map, stack, and commands.

Use the nearest workspace \`AGENTS.md\` when editing a specific app or package. Use \`CONTEXT.md\` for architecture notes. Do not add \`.cursor/rules/\` or \`.claude/rules/\`.
`
}
