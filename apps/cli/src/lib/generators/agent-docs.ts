/**
 * Agent docs generator
 *
 * Generates AGENTS.md, CLAUDE.md, CONTEXT.md, and .claude/rules/ in
 * scaffolded projects so every new project is AI-development-ready
 * from day one.
 */

import type { ProjectConfig } from '../../types/schemas'
import { sanitizeProjectName } from '../scaffold'

export function buildRootAgentsMd(config: ProjectConfig): string {
  const name = sanitizeProjectName(config.projectName)

  return `# ${name}

## Quick Start

\`\`\`bash
bun install
bun dev
\`\`\`

## Stack

- **Backend**: ${config.backend}
- **Database**: ${config.database}
- **ORM**: ${config.orm}
- **Auth**: Better Auth
- **API**: tRPC
- **Runtime**: ${config.runtime}

## Key Directories

- \`apps/web\` — Next.js frontend
- \`apps/server\` — ${config.backend} API server
${config.includeWorker ? "- `apps/worker` — Background job processing\n" : ""}- \`packages/auth\` — Better Auth configuration
- \`packages/store\` — Database schema and client
- \`packages/trpc\` — tRPC routers and context
- \`packages/ui\` — Shared UI components

## Commands

- \`bun dev\` — Start development
- \`bun run build\` — Build all packages
- \`bun run lint\` — Lint all packages
- \`bun run check-types\` — Type check all packages
- \`bun run db:generate\` — Generate database client
- \`bun run db:migrate\` — Run database migrations
`
}

export function buildContextMd(config: ProjectConfig): string {
  const name = sanitizeProjectName(config.projectName)

  return `# ${name} — Context

A full-stack TypeScript monorepo scaffolded with @kitsu/create.

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
- tRPC context & procedures: \`packages/trpc/src/trpc.ts\`
- Database schema: \`packages/store/prisma/schema.prisma\`${config.orm === 'drizzle' ? '\n- Database schema: \`packages/store/src/schema.ts\`' : ''}
- Auth configuration: \`packages/auth/src/index.ts\`
- Frontend providers: \`apps/web/components/providers.tsx\`
- tRPC client setup: \`apps/web/trpc/client.tsx\`

## Environment Variables

See \`apps/server/.env.example\` and \`apps/web/.env.example\` for required variables.
`
}

export function buildClaudeMd(): string {
  return `# Navigation

Read \`AGENTS.md\` first for the project map and commands.
Use \`CONTEXT.md\` for architecture decisions and stack details.
`
}

export function buildStoreRulesMd(config: ProjectConfig): string {
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
