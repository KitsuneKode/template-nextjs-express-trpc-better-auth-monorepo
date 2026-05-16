/**
 * README generator
 *
 * Generates the scaffolded project's README with portfolio webhook awareness
 * and project-specific instructions.
 */

import type { ProjectConfig } from '../../types/schemas'
import { sanitizeProjectName } from '../scaffold'

export function buildReadme(config: ProjectConfig): string {
  const name = sanitizeProjectName(config.projectName)
  const backendLabel = config.backend === 'express-bun' ? 'Express (Bun)' : config.backend === 'hono-bun' ? 'Hono (Bun)' : config.backend
  const dbLabel = config.database || 'none'
  const ormLabel = config.orm || 'none'

  return `# ${name}

A full-stack TypeScript monorepo scaffolded with [@kitsu/create](https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo).

## Stack

- **Frontend**: Next.js
- **Backend**: ${backendLabel}
- **API**: tRPC
- **Database**: ${dbLabel} via ${ormLabel}
- **Auth**: Better Auth
- **Monorepo**: Turborepo + Bun

## Quick Start

\`\`\`bash
bun install
bun dev
\`\`\`

## Commands

| Command | Description |
|---------|-------------|
| \`bun dev\` | Start all dev servers |
| \`bun run build\` | Build all packages |
| \`bun run lint\` | Lint all packages |
| \`bun run check-types\` | Type check all packages |

## Portfolio

This project is portfolio-ready. When you're ready to showcase it:
1. Fill in \`SHOWCASE.mdx\` at the project root
2. Push to GitHub — the portfolio will auto-sync

See \`CONTEXT.md\` for architecture details and \`AGENTS.md\` for agent navigation.
`
}
