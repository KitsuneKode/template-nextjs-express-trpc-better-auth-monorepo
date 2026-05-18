import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ProjectConfig } from '../../types/schemas'

interface SkillMapping {
  condition: (config: ProjectConfig) => boolean
  source: string
  skill: string
  description: string
  agent: string
}

const RECOMMENDED_SKILLS: SkillMapping[] = [
  {
    condition: (c) => c.family === 'fullstack' || c.family === 'next' || c.family === 'convex',
    source: 'vercel/next.js',
    skill: 'next-best-practices',
    description: 'Next.js conventions and best practices',
    agent: 'opencode',
  },
  {
    condition: (c) => c.family === 'fullstack' || c.family === 'next' || c.family === 'convex',
    source: 'vercel/next.js',
    skill: 'next-cache-components',
    description: 'Next.js cache components (PPR, use cache)',
    agent: 'opencode',
  },
  {
    condition: (c) => c.backend !== 'none' || c.family === 'fullstack',
    source: 'better-auth',
    skill: 'better-auth',
    description: 'Better Auth configuration and patterns',
    agent: 'opencode',
  },
  {
    condition: (c) => c.orm === 'prisma',
    source: 'prisma',
    skill: 'prisma',
    description: 'Prisma ORM schema and query patterns',
    agent: 'opencode',
  },
  {
    condition: (c) => c.orm === 'drizzle',
    source: 'drizzle-orm',
    skill: 'drizzle',
    description: 'Drizzle ORM schema and query patterns',
    agent: 'opencode',
  },
  {
    condition: (c) => c.bundles?.includes('ai'),
    source: 'vercel/ai-sdk',
    skill: 'vercel-ai-sdk',
    description: 'Vercel AI SDK usage',
    agent: 'opencode',
  },
  {
    condition: (c) => c.database === 'postgres',
    source: 'supabase/supabase',
    skill: 'supabase',
    description: 'Supabase and PostgreSQL patterns',
    agent: 'opencode',
  },
]

/** Generate a .cursorrules or .claude.md with skill recommendations based on config */
export function buildSkillRecommendations(config: ProjectConfig): string {
  const matching = RECOMMENDED_SKILLS.filter((s) => s.condition(config)).map(
    (s) => `  - \`${s.source}/${s.skill}\`: ${s.description}`,
  )

  if (matching.length === 0) return ''

  return `# Recommended Skills

Add these skills for agent-assisted development:

\`\`\`bash
${matching.map((_, i) => `# skill ${i + 1}`).join('\n')}
\`\`\`

${matching.join('\n')}
`
}

interface CursorRule {
  fileName: string
  description: string
  globs: string
  content: string
}

function buildCursorRules(config: ProjectConfig): CursorRule[] {
  const rules: CursorRule[] = []

  rules.push({
    fileName: 'project.mdc',
    description: 'Project overview and agent navigation',
    globs: '*',
    content: `This is a ${config.family} project scaffolded with @arche/create.

Key information:
- Family: ${config.family}
- Package manager: ${config.packageManager ?? 'bun'}
- Backend: ${config.backend}
- Database: ${config.database}
- ORM: ${config.orm}

Before making changes:
1. Read the relevant source files first
2. Run lint and typecheck after changes
3. Keep documentation in sync
`,
  })

  if (config.family === 'fullstack' || config.family === 'backend') {
    rules.push({
      fileName: 'database.mdc',
      description: 'Database schema and migration patterns',
      globs: '**/*.{prisma,sql,ts}',
      content: `Database: ${config.database} via ${config.orm}
Schema: packages/store/prisma/schema.prisma

After schema changes:
- Run \`bun run db:generate\` to regenerate the client
- Run \`bun run db:migrate\` to create a migration

The Prisma client is re-exported from packages/store/src/index.ts.
`,
    })

    rules.push({
      fileName: 'auth.mdc',
      description: 'Better Auth configuration and patterns',
      globs: '**/*.{ts,tsx}',
      content: `Auth: Better Auth with session-based authentication
Config: packages/auth/src/index.ts
tRPC context: packages/trpc/src/trpc.ts

Use \`protectedProcedure\` for authenticated tRPC endpoints.
Use \`publicProcedure\` for open endpoints.

Auth routes are mounted at /api/auth/* in apps/server/src/app.ts.
`,
    })
  }

  if (config.family === 'fullstack') {
    rules.push({
      fileName: 'trpc.mdc',
      description: 'tRPC router patterns and conventions',
      globs: '**/*.{ts,tsx}',
      content: `tRPC routers: packages/trpc/src/routers/
Context: packages/trpc/src/trpc.ts

Each router is a plain object satisfying TRPCRouterRecord.
Import and register in src/routers/_app.ts.

Use \`protectedProcedure\` for authenticated, \`publicProcedure\` for open.
`,
    })
  }

  if (config.database === 'postgres' && config.orm === 'prisma') {
    rules.push({
      fileName: 'postgres.mdc',
      description: 'PostgreSQL with Prisma patterns',
      globs: '**/*.{prisma,ts}',
      content: `PostgreSQL via Prisma ORM.
Use \`bunx prisma studio\` for local database inspection.
Seed data: packages/store/src/scripts/seed.ts
`,
    })
  }

  return rules
}

/** Write skill configuration files to the scaffolded project */
export function writeSkillConfigs(destinationDir: string, config: ProjectConfig): string[] {
  const matching = RECOMMENDED_SKILLS.filter((s) => s.condition(config))
  if (matching.length === 0) return []

  const opencodeSkills = matching.filter((s) => s.agent === 'opencode')
  const generatedFiles: string[] = []
  if (opencodeSkills.length > 0) {
    const configDir = join(destinationDir, '.opencode')
    if (!existsSync(configDir)) mkdirSync(configDir, { recursive: true })
    writeFileSync(
      join(configDir, 'skills.json'),
      JSON.stringify(
        {
          version: '0.2.0',
          skills: opencodeSkills.map((s) => ({
            source: s.source,
            name: s.skill,
          })),
        },
        null,
        2,
      ) + '\n',
    )
    generatedFiles.push('.opencode/skills.json')
  }

  return generatedFiles
}

/** Write Cursor editor rules (.cursor/rules/*.mdc) */
export function writeCursorRules(destinationDir: string, config: ProjectConfig): string[] {
  const rules = buildCursorRules(config)
  if (rules.length === 0) return []

  const rulesDir = join(destinationDir, '.cursor/rules')
  if (!existsSync(rulesDir)) mkdirSync(rulesDir, { recursive: true })
  const generatedFiles: string[] = []

  for (const rule of rules) {
    const content = `---
description: ${rule.description}
globs: "${rule.globs}"
---
${rule.content}
`
    writeFileSync(join(rulesDir, rule.fileName), content)
    generatedFiles.push(join('.cursor/rules', rule.fileName))
  }

  return generatedFiles
}
