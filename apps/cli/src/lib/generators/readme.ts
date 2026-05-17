import type { ProjectConfig } from '../../types/schemas'
import { sanitizeProjectName } from '../scaffold'

function familyLabel(family: string): string {
  const labels: Record<string, string> = {
    'ts-turbo': 'Full-stack TypeScript Monorepo',
    next: 'Standalone Next.js App',
    backend: 'API Service',
    rust: 'Rust API Service',
    solana: 'Solana Program',
    convex: 'Next.js + Convex',
    worker: 'Background Worker',
    lib: 'TypeScript Package',
    cli: 'CLI Package',
    mobile: 'Expo Mobile App',
    polyglot: 'Multi-language Monorepo',
  }
  return labels[family] ?? 'Project'
}

function backendLabel(backend: string): string {
  const labels: Record<string, string> = {
    'express-bun': 'Express (Bun)',
    'hono-bun': 'Hono (Bun)',
    'fastify-node': 'Fastify (Node)',
    'go-fiber': 'Go Fiber',
    'rust-axum': 'Rust Axum',
    'python-fastapi': 'Python FastAPI',
  }
  return labels[backend] ?? backend
}

function commandsForFamily(family: string): string {
  const common = `| \`bun run build\` | Build all packages |
| \`bun run lint\` | Lint all packages |
| \`bun run check-types\` | Type check all packages |`

  if (family === 'ts-turbo') {
    return `| \`bun dev\` | Start all dev servers |
| \`bun run db:generate\` | Generate database client |
| \`bun run db:migrate\` | Run database migrations |
${common}`
  }

  if (family === 'next') {
    return `| \`bun dev\` | Start Next.js dev server |
${common}`
  }

  if (family === 'backend') {
    return `| \`bun dev\` | Start API dev server |
| \`bun run db:generate\` | Generate database client |
| \`bun run db:migrate\` | Run database migrations |
${common}`
  }

  if (family === 'convex') {
    return `| \`bun dev\` | Start Next.js + Convex dev |
| \`bun run convex:deploy\` | Deploy Convex functions |
${common}`
  }

  return `| \`bun dev\` | Start development |
${common}`
}

function stackForFamily(config: ProjectConfig): string {
  const { family, backend, database, orm } = config
  const lines: string[] = []

  if (family === 'ts-turbo') {
    lines.push('- **Frontend**: Next.js')
    lines.push(`- **Backend**: ${backendLabel(backend)}`)
    lines.push('- **API**: tRPC')
    if (database !== 'none') lines.push(`- **Database**: ${database} via ${orm}`)
    lines.push('- **Auth**: Better Auth')
    lines.push('- **Monorepo**: Turborepo + Bun')
  } else if (family === 'next') {
    lines.push('- **Frontend**: Next.js')
    lines.push('- **Runtime**: Bun')
    if (config.presets.includes('auth')) lines.push('- **Auth**: Better Auth')
    if (config.presets.includes('docs')) lines.push('- **Docs**: Fumadocs')
  } else if (family === 'backend') {
    lines.push(`- **Backend**: ${backendLabel(backend)}`)
    if (database !== 'none') lines.push(`- **Database**: ${database} via ${orm}`)
    lines.push('- **API**: tRPC')
    lines.push('- **Auth**: Better Auth')
    lines.push('- **Runtime**: Bun')
  } else if (family === 'convex') {
    lines.push('- **Frontend**: Next.js')
    lines.push('- **Backend**: Convex')
    lines.push('- **Auth**: Better Auth')
    lines.push('- **Runtime**: Bun')
  } else if (family === 'rust') {
    lines.push('- **Language**: Rust')
    lines.push('- **Runtime**: Native binary')
  } else if (family === 'worker') {
    lines.push('- **Queue**: BullMQ + Redis')
    lines.push('- **Runtime**: Bun')
  } else if (family === 'lib') {
    lines.push('- **Language**: TypeScript')
    lines.push('- **Runtime**: Bun')
  } else if (family === 'cli') {
    lines.push('- **Language**: TypeScript')
    lines.push('- **Runtime**: Bun')
    lines.push('- **Release**: Changesets')
  } else if (family === 'solana') {
    lines.push('- **Framework**: Anchor')
    lines.push('- **Language**: Rust')
  } else if (family === 'mobile') {
    lines.push('- **Framework**: Expo Router')
    lines.push('- **Language**: TypeScript')
  }

  return lines.join('\n')
}

function hasShowcase(config: ProjectConfig): boolean {
  return config.includeShowcase && config.family === 'ts-turbo'
}

export function buildReadme(config: ProjectConfig): string {
  const name = sanitizeProjectName(config.projectName)
  const label = familyLabel(config.family)
  const commands = commandsForFamily(config.family)
  const stack = stackForFamily(config)
  const showcase = hasShowcase(config)

  return `# ${name}

A ${label.toLowerCase()} scaffolded with [@kitsu/create](https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo).

## Stack

${stack}

## Quick Start

\`\`\`bash
bun install
bun dev
\`\`\`

## Commands

| Command | Description |
|---------|-------------|
${commands}

${showcase ? `## Portfolio\n\nThis project is portfolio-ready. When you're ready to showcase it:\n1. Fill in \`SHOWCASE.mdx\` at the project root\n2. Push to GitHub — the portfolio will auto-sync\n\n` : ''}See \`CONTEXT.md\` for architecture details and \`AGENTS.md\` for agent navigation.
`
}
