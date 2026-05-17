import type { ProjectConfig } from '../../types/schemas'
import { sanitizeProjectName } from '../scaffold'

function hasServer(family: string): boolean {
  return family === 'ts-turbo' || family === 'backend' || family === 'rust'
}

function keyDirs(config: ProjectConfig): string[] {
  const { family, includeWorker } = config
  const dirs: string[] = []

  if (family === 'ts-turbo') {
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
    dirs.push('`src` — Rust source')
    dirs.push('`Cargo.toml` — Rust dependencies')
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

  if (family === 'ts-turbo' || family === 'backend') {
    cmds.push(`- \`${run} db:generate\` — Generate database client`)
    cmds.push(`- \`${run} db:migrate\` — Run database migrations`)
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

  if (family === 'ts-turbo') {
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
  generator: '@kitsu/create@0.2.0'
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
    'ts-turbo': `A full-stack TypeScript monorepo scaffolded with @kitsu/create.

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
- tRPC context and procedures: \`packages/trpc/src/trpc.ts\`
- Database schema: \`packages/store/prisma/schema.prisma\`${config.orm === 'drizzle' ? '\n- Database schema: `packages/store/src/schema.ts`' : ''}
- Auth configuration: \`packages/auth/src/index.ts\`
- Frontend providers: \`apps/web/components/providers.tsx\`
- tRPC client setup: \`apps/web/trpc/client.tsx\`

## Environment Variables

See \`apps/server/.env.example\` and \`apps/web/.env.example\` for required variables.`,
    next: `A standalone Next.js application scaffolded with @kitsu/create.

## Architecture

- **Frontend**: Next.js (App Router)
${config.presets.includes('auth') ? '- **Auth**: Better Auth\n' : ''}${config.presets.includes('docs') ? '- **Docs**: Fumadocs\n' : ''}- **Runtime**: Bun

## Key Entry Points

- App layout: \`app/layout.tsx\`
- App pages: \`app/\` (App Router directories)
${config.presets.includes('auth') ? '- Auth config: `lib/auth`\n' : ''}
## Environment Variables

See \`.env.example\` at the project root.`,
    backend: `An API service scaffolded with @kitsu/create.

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
    convex: `A Next.js + Convex application scaffolded with @kitsu/create.

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

  const description = descriptions[family] ?? `A ${family} project scaffolded with @kitsu/create.`

  return `# ${name} — Context

${description}
`
}

export function buildClaudeMd(): string {
  return `# Navigation

Read \`AGENTS.md\` first for the project map and commands.
Use \`CONTEXT.md\` for architecture decisions and stack details.
SHOWCASE.mdx is the portfolio-facing description — keep it in sync.
`
}

export function buildStoreRulesMd(config: ProjectConfig): string {
  if (!hasServer(config.family)) {
    return `# store

Database configuration lives here.`
  }

  if (config.orm === 'drizzle') {
    return `---
paths: ["packages/store/**"]
---

Drizzle schema at \`packages/store/src/schema.ts\`. After schema changes:
1. \`bunx drizzle-kit generate\` — generate migration
2. \`bunx drizzle-kit migrate\` — apply migration

The Drizzle client is re-exported from \`src/index.ts\` as the store package.
`
  }

  return `---
paths: ["packages/store/**"]
---

Prisma schema at \`prisma/schema.prisma\`. After schema changes:
1. \`bun run db:generate\` — regenerate client
2. \`bun run db:migrate\` — create migration

Seed data in \`src/scripts/seed.ts\`. The Prisma client is re-exported from \`src/index.ts\`.
`
}

export function buildWebRulesMd(): string {
  return `---
paths: ["apps/web/**"]
---

Next.js App Router. Server components use prefetch with tRPC query options
and wrap children in HydrateClient. Client components use the tRPC React hooks.

Key files:
- \`app/layout.tsx\` — root layout and providers
- \`components/providers.tsx\` — theme + tRPC provider
- \`trpc/client.tsx\` — browser tRPC client
- \`trpc/server.tsx\` — server-side tRPC caller
`
}

export function buildTrpcRulesMd(): string {
  return `---
paths: ["packages/trpc/**", "apps/server/src/app.ts"]
---

tRPC routers live in \`packages/trpc/src/routers/\`. Each router is a separate
file exporting a plain object \`satisfies TRPCRouterRecord\`. Import and register
in \`src/routers/_app.ts\`.

Context resolves in \`src/trpc.ts\` from Better Auth session + database access.
Use \`protectedProcedure\` for authenticated endpoints, \`publicProcedure\` for open ones.
`
}
