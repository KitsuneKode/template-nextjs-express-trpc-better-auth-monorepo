/**
 * Docker Compose generator
 *
 * Generates docker-compose.yml (dev) and docker-compose.prod.yml adapted to
 * the selected database, backend, and worker.
 *
 * - postgres: PostgreSQL container + Redis
 * - sqlite: Redis only (SQLite is file-based, no container needed)
 * - mongodb: MongoDB container + Redis
 * - none: Redis only
 */

import type { ProjectConfig } from '../../types/schemas'
import { sanitizeProjectName } from '../scaffold'

function buildDbService(config: ProjectConfig): { services: string[]; volumes: string[] } {
  const services: string[] = []
  const volumes: string[] = []

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

  return { services, volumes }
}

function buildRedisService(config: ProjectConfig): { services: string[]; volumes: string[] } {
  if (config.backend === 'none') return { services: [], volumes: [] }

  return {
    services: [
      `  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data`,
    ],
    volumes: ['  redis-data:'],
  }
}

export function renderDockerCompose(config: ProjectConfig): string {
  const { services: dbServices, volumes: dbVolumes } = buildDbService(config)
  const { services: redisServices, volumes: redisVolumes } = buildRedisService(config)

  const allServices = [...dbServices, ...redisServices]
  const allVolumes = [...dbVolumes, ...redisVolumes]

  if (allServices.length === 0) {
    return `# No Docker services needed for this configuration.\n`
  }

  return `services:\n${allServices.join('\n\n')}\n\nvolumes:\n${allVolumes.join('\n')}\n`
}

export function renderDockerComposeProd(config: ProjectConfig): string {
  const { volumes: dbVolumes } = buildDbService(config)
  const { volumes: redisVolumes } = buildRedisService(config)

  const appServices: string[] = []
  const appVolumes: string[] = [...dbVolumes, ...redisVolumes]

  // Web (Next.js)
  appServices.push(`  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    restart: unless-stopped
    env_file: ./apps/web/.env
    environment:
      - NODE_ENV=production
    ports:
      - "3000:3000"
    depends_on:
      - server`)

  // Server
  appServices.push(`  server:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    restart: unless-stopped
    env_file: ./apps/server/.env
    environment:
      - NODE_ENV=production
    ports:
      - "3001:3001"
    depends_on:
      - redis${config.database !== 'none' && config.database !== 'sqlite' ? '\n      - postgres' : ''}${config.database === 'mongodb' ? '\n      - mongo' : ''}`)

  // Worker
  if (config.includeWorker) {
    appServices.push(`  worker:
    build:
      context: .
      dockerfile: apps/worker/Dockerfile
    restart: unless-stopped
    env_file: ./apps/worker/.env
    environment:
      - NODE_ENV=production
    depends_on:
      - server
      - redis`)
  }

  // Nginx reverse proxy
  appServices.push(`  nginx:
    image: nginx:1.27-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
      - server`)

  const appServiceNames = ['web', 'server']
  if (config.includeWorker) appServiceNames.push('worker')
  appServiceNames.push('nginx')

  return `# Production Docker Compose
# Usage: docker compose -f docker-compose.prod.yml up -d

services:\n${appServices.join('\n\n')}\n\nvolumes:\n${appVolumes.join('\n')}\n

networks:
  default:
    name: ${sanitizeProjectName(config.projectName)}-prod
`
}
