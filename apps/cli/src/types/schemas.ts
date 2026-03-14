/**
 * CLI Type Schemas
 *
 * All CLI option types defined as Zod schemas.
 * Extended for polyglot backend and database support:
 * - Backends: Express (default), Hono, future Go/Rust/Python
 * - Databases: PostgreSQL (default), SQLite, future MongoDB
 * - ORMs: Prisma (default), Drizzle, Mongoose, none
 * - Addons: WebSocket, worker, S3, email, payments (future)
 * - Examples: todo, chat, game, AI (future)
 *
 * When adding new options:
 * 1. Add the schema here
 * 2. Add compatibility rules to checkCompatibility()
 * 3. Add prompts in index.ts
 * 4. Implement generator in src/lib/generators/
 */

import { z } from 'zod'

// =============================================================================
// Core Schemas (Current Implementation)
// =============================================================================

/** Testing configuration options */
export const TestingSchema = z.enum(['bun', 'none']).describe('Testing framework setup')
export type TestingMode = z.infer<typeof TestingSchema>

/** Deployment guide options */
export const DeploymentSchema = z
  .enum(['vercel-railway', 'none'])
  .describe('Deployment documentation to generate')
export type DeploymentMode = z.infer<typeof DeploymentSchema>

/** Cleanup targets for template customization */
export const CleanupTargetSchema = z
  .enum(['showcase', 'seed', 'worker', 'tests', 'readme'])
  .describe('Template sections that can be removed')
export type CleanupTarget = z.infer<typeof CleanupTargetSchema>

// =============================================================================
// Database Schemas
// =============================================================================

/** Primary database options */
export const DatabaseSchema = z
  .enum([
    'postgres', // Current default (Prisma)
    'mongodb', // Future: MongoDB support
    'sqlite', // Future: SQLite/Turso
    'none', // API-only or external DB
  ])
  .describe('Primary database')
export type DatabaseType = z.infer<typeof DatabaseSchema>

/** Vector database for AI/ML features */
export const VectorDatabaseSchema = z
  .enum([
    'pgvector', // PostgreSQL extension
    'pinecone', // Managed vector DB
    'none', // No vector search
  ])
  .describe('Vector database for embeddings')
export type VectorDatabaseType = z.infer<typeof VectorDatabaseSchema>

/** ORM selection */
export const ORMSchema = z
  .enum([
    'prisma', // Current default
    'drizzle', // Future alternative
    'mongoose', // For MongoDB
    'none', // Raw queries
  ])
  .describe('Object-relational mapper')
export type ORMType = z.infer<typeof ORMSchema>

// =============================================================================
// Backend Schemas
// =============================================================================

/** Backend framework options */
export const BackendSchema = z
  .enum([
    'express-bun', // Current default
    'hono-bun', // Future: Hono
    'fastify-node', // Future: Fastify
    'go-fiber', // Future: Go backend
    'rust-axum', // Future: Rust backend
    'python-fastapi', // Future: Python backend
    'none', // Frontend only
  ])
  .describe('Backend framework and runtime')
export type BackendType = z.infer<typeof BackendSchema>

/** Runtime environment */
export const RuntimeSchema = z
  .enum([
    'bun', // Current default
    'node', // Node.js
    'workers', // Cloudflare Workers
  ])
  .describe('JavaScript runtime')
export type RuntimeType = z.infer<typeof RuntimeSchema>

// =============================================================================
// Addon Schemas
// =============================================================================

/** Optional addons that can be included */
export const AddonSchema = z
  .enum([
    'websocket', // WebSocket server
    'worker', // Background job processing
    's3', // S3/R2 object storage
    'email', // Email sending (Resend, etc.)
    'payments', // Stripe/Polar integration
    'analytics', // Analytics integration
    'none', // No addons
  ])
  .describe('Optional feature addons')
export type AddonType = z.infer<typeof AddonSchema>

// =============================================================================
// Example Templates
// =============================================================================

/** Pre-built example applications */
export const ExampleSchema = z
  .enum([
    'none', // Blank slate (current default)
    'todo', // Todo app with CRUD
    'chat', // Real-time chat
    'game', // Simple game starter
    'ai', // AI/LLM integration example
  ])
  .describe('Example application to scaffold')
export type ExampleType = z.infer<typeof ExampleSchema>

// =============================================================================
// Composite Schemas
// =============================================================================

/** Full project configuration */
export const ProjectConfigSchema = z.object({
  projectName: z.string().min(1),
  destinationDir: z.string().min(1),
  database: DatabaseSchema.default('postgres'),
  vectorDatabase: VectorDatabaseSchema.default('none'),
  orm: ORMSchema.default('prisma'),
  backend: BackendSchema.default('express-bun'),
  runtime: RuntimeSchema.default('bun'),
  addons: z.array(AddonSchema).default([]),
  example: ExampleSchema.default('none'),
  testing: TestingSchema.default('bun'),
  deployment: DeploymentSchema.default('vercel-railway'),
  includeShowcase: z.boolean().default(false),
  includeWorker: z.boolean().default(false),
  includeDocker: z.boolean().default(true),
  includeCi: z.boolean().default(true),
  initializeGit: z.boolean().default(true),
  installDependencies: z.boolean().default(true),
})
export type ProjectConfig = z.infer<typeof ProjectConfigSchema>

/** CLI input arguments (parsed from process.argv) */
export const CLIArgsSchema = z.object({
  projectName: z.string().optional(),
  yes: z.boolean().default(false),
  help: z.boolean().default(false),
  version: z.boolean().default(false),
  // Project structure
  install: z.boolean().optional(),
  git: z.boolean().optional(),
  includeShowcase: z.boolean().optional(),
  includeWorker: z.boolean().optional(),
  testing: TestingSchema.optional(),
  includeDocker: z.boolean().optional(),
  includeCi: z.boolean().optional(),
  deployment: DeploymentSchema.optional(),
  // Stack selection
  database: DatabaseSchema.optional(),
  orm: ORMSchema.optional(),
  backend: BackendSchema.optional(),
  example: ExampleSchema.optional(),
})
export type CLIArgs = z.infer<typeof CLIArgsSchema>

// =============================================================================
// Validation Helpers
// =============================================================================

/** Validate project name format */
export function validateProjectName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Project name cannot be empty' }
  }

  const slugified = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._ -]/g, '')
    .replace(/[._ ]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!slugified) {
    return { valid: false, error: 'Project name must contain at least one alphanumeric character' }
  }

  return { valid: true }
}

/** Check compatibility between options. Returns warnings (non-blocking) and errors (blocking). */
export function checkCompatibility(config: Partial<ProjectConfig>): {
  warnings: string[]
  errors: string[]
} {
  const warnings: string[] = []
  const errors: string[] = []

  // MongoDB requires mongoose ORM (or none), not Prisma/Drizzle
  if (config.database === 'mongodb' && config.orm === 'drizzle') {
    errors.push('Drizzle does not support MongoDB. Use Mongoose or Prisma.')
  }

  // Mongoose only makes sense with MongoDB
  if (config.orm === 'mongoose' && config.database !== 'mongodb') {
    errors.push('Mongoose ORM requires MongoDB as the database.')
  }

  // Vector DB requires a primary database
  if (config.vectorDatabase === 'pgvector' && config.database !== 'postgres') {
    errors.push('pgvector requires PostgreSQL as the primary database.')
  }

  // No database + non-none ORM is contradictory
  if (config.database === 'none' && config.orm && config.orm !== 'none') {
    errors.push(`ORM "${config.orm}" requires a database. Set database or use orm=none.`)
  }

  // No backend + worker doesn't make sense
  if (config.backend === 'none' && config.includeWorker) {
    warnings.push('Worker without a backend server may not be useful.')
  }

  // MongoDB works best with Mongoose
  if (config.database === 'mongodb' && config.orm === 'prisma') {
    warnings.push(
      'MongoDB with Prisma has limitations. Consider Mongoose for full MongoDB support.',
    )
  }

  // WebSocket addon pairs well with chat example
  if (config.example === 'chat' && config.addons && !config.addons.includes('websocket')) {
    warnings.push('Chat example works best with WebSocket addon.')
  }

  // SQLite + Docker is odd (no container needed for file-based DB)
  if (config.database === 'sqlite' && config.includeDocker) {
    warnings.push(
      'SQLite is file-based and does not need a Docker container. Docker will only include Redis.',
    )
  }

  return { warnings, errors }
}
