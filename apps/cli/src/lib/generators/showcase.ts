/**
 * SHOWCASE.mdx generator
 *
 * Generates a portfolio-ready SHOWCASE.mdx file at the project root.
 * Designed for LLM/agent modification: includes structured JSON-LD,
 * explicit agent sections, and regeneration hints.
 */

import type { ProjectConfig } from '../../types/schemas'
import { sanitizeProjectName } from '../slug'

function jsonLd(name: string, created: string): string {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name,
      description: '',
      programmingLanguage: ['TypeScript', 'Rust', 'Python'],
      runtimePlatform: ['Bun', 'Node.js', 'Rust'],
      operatingSystem: 'POSIX',
      dateCreated: created,
      dateModified: created,
    },
    null,
    2,
  )
}

export function buildShowcaseMdx(config: ProjectConfig): string {
  const name = sanitizeProjectName(config.projectName)
  const created = new Date().toISOString().slice(0, 10)
  const rawTags = [config.backend, config.database, config.orm, config.family]
  const tags = rawTags.filter((t): t is NonNullable<typeof t> => t != null && t !== 'none')

  return `---
title: ${name}
type: project
tags: [${tags.join(', ')}]
featured: false
created: ${created}
updated: ${created}
generator: '@kitsu/create@0.2.0'
agent_hint: >
  This file is structured for agent-assisted maintenance.
  Fill in each section with project-specific details.
  Update the 'updated' field in frontmatter on changes.
  Keep the JSON-LD block in sync with the markdown content.
---

import { ProjectCard, TechBadge, MetricBadge } from './components'

<script>
  /** Agents: update this JSON-LD block when project metadata changes */
  const projectMeta = ${jsonLd(name, created)}
</script>

# ${name}

<ProjectCard title="${name}" tags={[${tags.map((t) => `'${t}'`).join(', ')}]} />

## Overview

{/* Describe what this project does in 2-3 sentences. Agents: read package.json and CONTEXT.md to synthesize this. */}

## Architecture

{/* Agents: describe the architecture based on the project structure. Include key directories, data flow, auth strategy, deployment model. */}

### Tech Stack

<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
  <TechBadge name="TypeScript" />
  <TechBadge name="${config.backend === 'express-bun' ? 'Express' : config.backend === 'hono-bun' ? 'Hono' : config.backend}" />
  <TechBadge name="${config.database === 'none' ? 'No DB' : config.database === 'postgres' ? 'PostgreSQL' : config.database}" />
  <TechBadge name="${config.orm === 'prisma' ? 'Prisma' : config.orm === 'drizzle' ? 'Drizzle' : config.orm}" />
  <TechBadge name="tRPC" />
  <TechBadge name="Better Auth" />
</div>

## Key Features

{/* Agents: extract features from package.json scripts, router files, and directory structure. Replace the list below. */}

- Feature one
- Feature two
- Feature three

## Metrics

<div style={{ display: 'flex', gap: '1rem' }}>
  <MetricBadge label="Routes" value="—" />
  <MetricBadge label="DB Tables" value="—" />
  <MetricBadge label="Tests" value="—" />
</div>

{/* Agents: update metric values using source analysis. Routes: count tRPC routers/procedures. Tables: count models in schema. Tests: count test files. */}

## Recent Changes

{/* Agents: append entries here when making significant modifications. Keep the 5 most recent. */}

- ${created}: Project scaffolded with @kitsu/create

## Getting Started

\`\`\`bash
bun install
bun dev
\`\`\`

---

*Maintained with @kitsu/create. Push changes to sync with portfolio at kitsunekode.in.*
`
}
