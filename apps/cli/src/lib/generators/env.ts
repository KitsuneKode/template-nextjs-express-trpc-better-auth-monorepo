/**
 * Environment file generator
 *
 * Generates .env and .env.example files adapted to the selected
 * database, backend, and runtime configuration.
 */

import type { ProjectConfig } from '../../types/schemas'
import { sanitizeProjectName } from '../scaffold'

/** Build DATABASE_URL for the selected database */
function buildDatabaseUrl(config: ProjectConfig): string | null {
  const safeName = sanitizeProjectName(config.projectName).replace(/-/g, '_')

  switch (config.database) {
    case 'postgres':
      return `postgresql://postgres:postgres@localhost:5432/${safeName}`
    case 'sqlite':
      return `file:./dev.db`
    case 'mongodb':
      return `mongodb://mongo:mongo@localhost:27017/${safeName}?authSource=admin`
    case 'none':
      return null
  }
}

/** Server .env content */
export function buildServerEnv(config: ProjectConfig): string {
  const lines: string[] = [`PORT=8080`, `NODE_ENV=development`, `JWT_SECRET=replace-me`]

  const dbUrl = buildDatabaseUrl(config)
  if (dbUrl) {
    lines.push(`DATABASE_URL=${dbUrl}`)
  }

  lines.push(
    `FRONTEND_URL=http://localhost:3000`,
    `REDIS_URL=redis://localhost:6379`,
    `BETTER_AUTH_SECRET=replace-with-a-long-random-secret`,
    `BETTER_AUTH_URL=http://localhost:8080`,
  )

  return lines.join('\n') + '\n'
}

/** Web .env content */
export function buildWebEnv(): string {
  return `NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
`
}
