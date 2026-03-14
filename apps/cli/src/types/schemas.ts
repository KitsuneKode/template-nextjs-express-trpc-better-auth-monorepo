/**
 * CLI Type Schemas
 *
 * This file defines all CLI option types using Zod schemas.
 * Designed for extensibility to support future features:
 * - Additional databases (MongoDB, vector DBs)
 * - Additional backends (Go, Rust, Python)
 * - Additional addons (WebSocket, object storage)
 * - Example templates (todo, chat, game)
 *
 * When adding new options:
 * 1. Add the schema here
 * 2. Update BootstrapOptions in scaffold.ts
 * 3. Add prompts in index.ts
 * 4. Implement generation logic
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
// Future: Database Schemas (Phase 2)
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
// Future: Backend Schemas (Phase 2+)
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
// Future: Addon Schemas (Phase 2)
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
// Future: Example Templates (Phase 2)
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
  database: DatabaseSchema.default('postgres'),
  vectorDatabase: VectorDatabaseSchema.default('none'),
  orm: ORMSchema.default('prisma'),
  backend: BackendSchema.default('express-bun'),
  runtime: RuntimeSchema.default('bun'),
  addons: z.array(AddonSchema).default([]),
  example: ExampleSchema.default('none'),
  testing: TestingSchema.default('bun'),
  deployment: DeploymentSchema.default('vercel-railway'),
  includeDocker: z.boolean().default(true),
  includeCi: z.boolean().default(true),
  initializeGit: z.boolean().default(true),
  installDependencies: z.boolean().default(true),
})
export type ProjectConfig = z.infer<typeof ProjectConfigSchema>

/** CLI input arguments */
export const CLIArgsSchema = z.object({
  projectName: z.string().optional(),
  yes: z.boolean().default(false),
  help: z.boolean().default(false),
  version: z.boolean().default(false),
  // Current options
  install: z.boolean().optional(),
  git: z.boolean().optional(),
  includeShowcase: z.boolean().optional(),
  includeWorker: z.boolean().optional(),
  testing: TestingSchema.optional(),
  includeDocker: z.boolean().optional(),
  includeCi: z.boolean().optional(),
  deployment: DeploymentSchema.optional(),
  // Future options (not yet implemented)
  database: DatabaseSchema.optional(),
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

/** Check compatibility between options */
export function checkCompatibility(config: Partial<ProjectConfig>): string[] {
  const warnings: string[] = []

  // MongoDB requires mongoose ORM
  if (config.database === 'mongodb' && config.orm !== 'mongoose' && config.orm !== 'none') {
    warnings.push('MongoDB works best with Mongoose ORM')
  }

  // Vector DB requires a primary database
  if (config.vectorDatabase === 'pgvector' && config.database !== 'postgres') {
    warnings.push('pgvector requires PostgreSQL as the primary database')
  }

  // WebSocket addon pairs well with chat example
  if (config.example === 'chat' && config.addons && !config.addons.includes('websocket')) {
    warnings.push('Chat example works best with WebSocket addon')
  }

  return warnings
}
