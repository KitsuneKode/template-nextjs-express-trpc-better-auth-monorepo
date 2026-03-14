/**
 * Docker Compose generator
 *
 * Generates docker-compose.yml adapted to the selected database and backend.
 * - postgres: PostgreSQL container + Redis
 * - sqlite: Redis only (SQLite is file-based, no container needed)
 * - mongodb: MongoDB container + Redis
 * - none: Redis only
 */

import type { ProjectConfig } from '../../types/schemas'
import { sanitizeProjectName } from '../scaffold'

export function renderDockerCompose(config: ProjectConfig): string {
  const services: string[] = []
  const volumes: string[] = []

  // Database service
  if (config.database === 'postgres') {
    const databaseName = sanitizeProjectName(config.projectName).replace(/-/g, '_')
    services.push(`  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${databaseName}
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data`)
    volumes.push('  postgres-data:')
  }

  if (config.database === 'mongodb') {
    services.push(`  mongo:
    image: mongo:7
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongo
      MONGO_INITDB_ROOT_PASSWORD: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db`)
    volumes.push('  mongo-data:')
  }

  // Redis (always included when backend is present)
  if (config.backend !== 'none') {
    services.push(`  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data`)
    volumes.push('  redis-data:')
  }

  if (services.length === 0) {
    // Edge case: no services needed (frontend-only + no database)
    return `# No Docker services needed for this configuration.\n`
  }

  return `services:\n${services.join('\n\n')}\n\nvolumes:\n${volumes.join('\n')}\n`
}
