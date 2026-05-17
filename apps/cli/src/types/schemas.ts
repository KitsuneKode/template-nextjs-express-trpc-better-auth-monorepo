import { z } from 'zod'

// =============================================================================
// Family Model
// =============================================================================

export const FamilySchema = z.enum([
  'ts-turbo',
  'next',
  'backend',
  'rust',
  'solana',
  'convex',
  'worker',
  'lib',
  'cli',
  'mobile',
  'polyglot',
])
export type Family = z.infer<typeof FamilySchema>

export const BundleSchema = z.enum(['product', 'realtime', 'growth', 'infra', 'ai'])
export type Bundle = z.infer<typeof BundleSchema>

export const PackageManagerSchema = z.enum(['bun', 'pnpm', 'npm'])
export type PackageManager = z.infer<typeof PackageManagerSchema>

// =============================================================================
// Core Schemas (kept for backward compat with generators)
// =============================================================================

export const TestingSchema = z.enum(['bun', 'none']).describe('Testing framework setup')
export type TestingMode = z.infer<typeof TestingSchema>

export const DeploymentSchema = z
  .enum(['vercel-railway', 'none'])
  .describe('Deployment documentation to generate')
export type DeploymentMode = z.infer<typeof DeploymentSchema>

export const CleanupTargetSchema = z
  .enum(['showcase', 'seed', 'worker', 'tests', 'readme'])
  .describe('Template sections that can be removed')
export type CleanupTarget = z.infer<typeof CleanupTargetSchema>

// =============================================================================
// Database Schemas
// =============================================================================

export const DatabaseSchema = z
  .enum(['postgres', 'mongodb', 'sqlite', 'none'])
  .describe('Primary database')
export type DatabaseType = z.infer<typeof DatabaseSchema>

export const VectorDatabaseSchema = z
  .enum(['pgvector', 'pinecone', 'none'])
  .describe('Vector database for embeddings')
export type VectorDatabaseType = z.infer<typeof VectorDatabaseSchema>

export const ORMSchema = z
  .enum(['prisma', 'drizzle', 'mongoose', 'none'])
  .describe('Object-relational mapper')
export type ORMType = z.infer<typeof ORMSchema>

// =============================================================================
// Backend Schemas
// =============================================================================

export const BackendSchema = z
  .enum([
    'express-bun',
    'hono-bun',
    'fastify-node',
    'go-fiber',
    'rust-axum',
    'python-fastapi',
    'none',
  ])
  .describe('Backend framework and runtime')
export type BackendType = z.infer<typeof BackendSchema>

export const RuntimeSchema = z.enum(['bun', 'node', 'workers']).describe('JavaScript runtime')
export type RuntimeType = z.infer<typeof RuntimeSchema>

// =============================================================================
// Addon Schemas
// =============================================================================

export const AddonSchema = z
  .enum(['websocket', 'worker', 's3', 'email', 'payments', 'analytics', 'none'])
  .describe('Optional feature addons')
export type AddonType = z.infer<typeof AddonSchema>

// =============================================================================
// Example Templates
// =============================================================================

export const ExampleSchema = z
  .enum(['none', 'todo', 'chat', 'game', 'ai'])
  .describe('Example application to scaffold')
export type ExampleType = z.infer<typeof ExampleSchema>

// =============================================================================
// Next.js Presets
// =============================================================================

export const NextPresetSchema = z
  .enum(['auth', 'docs', 'analytics', 'storage'])
  .describe('Next.js family presets')
export type NextPreset = z.infer<typeof NextPresetSchema>

// =============================================================================
// Composite Schemas
// =============================================================================

export const ProjectConfigSchema = z.object({
  projectName: z.string().min(1),
  destinationDir: z.string().min(1),
  // NEW: family model
  family: FamilySchema.default('ts-turbo'),
  bundles: z.array(BundleSchema).default(['product']),
  packageManager: PackageManagerSchema.default('bun'),
  // EXISTING (kept for backward compat with generators)
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
  // Family-specific (flattened for dispatch)
  presets: z.array(NextPresetSchema).default([]),
})
export type ProjectConfig = z.infer<typeof ProjectConfigSchema>

export const CLIArgsSchema = z.object({
  projectName: z.string().optional(),
  family: FamilySchema.optional(),
  bundles: z.array(BundleSchema).optional(),
  packageManager: PackageManagerSchema.optional(),
  yes: z.boolean().default(false),
  help: z.boolean().default(false),
  version: z.boolean().default(false),
  dryRun: z.boolean().default(false),
  // Existing flags
  install: z.boolean().optional(),
  git: z.boolean().optional(),
  includeShowcase: z.boolean().optional(),
  includeWorker: z.boolean().optional(),
  testing: TestingSchema.optional(),
  includeDocker: z.boolean().optional(),
  includeCi: z.boolean().optional(),
  deployment: DeploymentSchema.optional(),
  database: DatabaseSchema.optional(),
  orm: ORMSchema.optional(),
  backend: BackendSchema.optional(),
  example: ExampleSchema.optional(),
  // Family-specific flags
  presets: z.array(NextPresetSchema).optional(),
  // Internal: subcommand dispatch
  _command: z.string().optional(),
  _jsonConfig: z.any().optional(),
  _addFeature: z.string().optional(),
  _addDir: z.string().optional(),
})
export type CLIArgs = z.infer<typeof CLIArgsSchema>

// =============================================================================
// Family Helpers
// =============================================================================

export const FAMILY_LABELS: Record<Family, string> = {
  'ts-turbo': 'Full-stack TypeScript monorepo',
  next: 'Standalone Next.js app',
  backend: 'API-only service',
  rust: 'Rust API service',
  solana: 'Solana program',
  convex: 'Next.js + Convex',
  worker: 'Background job worker',
  lib: 'Generic TypeScript package',
  cli: 'CLI package',
  mobile: 'Expo mobile app',
  polyglot: 'Multi-language monorepo',
}

export const BUNDLE_LABELS: Record<Bundle, string> = {
  product: 'Auth + DB + API',
  realtime: 'WebSocket + Worker + Docs',
  growth: 'Analytics + Feature Flags + A/B',
  infra: 'Monitoring + Storage + CI/Deploy',
  ai: 'AI examples + Helpers + Docs',
}

export function hasBackendOptions(family: Family): boolean {
  return family === 'ts-turbo' || family === 'backend'
}

export function hasDatabaseOptions(family: Family): boolean {
  return family === 'ts-turbo' || family === 'backend'
}

export function hasOrmOptions(family: Family): boolean {
  return family === 'ts-turbo' || family === 'backend'
}

export function hasPresetOptions(family: Family): boolean {
  return family === 'next'
}

export function familySupportsWorker(family: Family): boolean {
  return family === 'ts-turbo'
}

export function familySupportsShowcase(family: Family): boolean {
  return family === 'ts-turbo'
}

// =============================================================================
// Validation Helpers
// =============================================================================

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

export function checkCompatibility(config: Partial<ProjectConfig>): {
  warnings: string[]
  errors: string[]
} {
  const warnings: string[] = []
  const errors: string[] = []

  if (config.database === 'mongodb' && config.orm === 'drizzle') {
    errors.push('Drizzle does not support MongoDB. Use Mongoose or Prisma.')
  }

  if (config.orm === 'mongoose' && config.database !== 'mongodb') {
    errors.push('Mongoose ORM requires MongoDB as the database.')
  }

  if (config.vectorDatabase === 'pgvector' && config.database !== 'postgres') {
    errors.push('pgvector requires PostgreSQL as the primary database.')
  }

  if (config.database === 'none' && config.orm && config.orm !== 'none') {
    errors.push(`ORM "${config.orm}" requires a database. Set database or use orm=none.`)
  }

  if (config.backend === 'none' && config.includeWorker) {
    warnings.push('Worker without a backend server may not be useful.')
  }

  if (config.database === 'mongodb' && config.orm === 'prisma') {
    warnings.push(
      'MongoDB with Prisma has limitations. Consider Mongoose for full MongoDB support.',
    )
  }

  if (config.example === 'chat' && config.addons && !config.addons.includes('websocket')) {
    warnings.push('Chat example works best with WebSocket addon.')
  }

  if (config.database === 'sqlite' && config.includeDocker) {
    warnings.push(
      'SQLite is file-based and does not need a Docker container. Docker will only include Redis.',
    )
  }

  // Family-specific validation
  if (config.family === 'solana' && config.backend !== 'none' && config.backend !== undefined) {
    warnings.push('Solana programs do not use a backend server. Backend will be ignored.')
  }
  if (config.family === 'rust' && config.backend !== 'none' && config.backend !== undefined) {
    warnings.push('Rust API projects use their own backend. Selected backend ignored.')
  }
  if (config.family === 'mobile' && config.backend === undefined) {
    // Mobile has its own concerns — no backend validation needed
  }

  // Bundle compatibility
  if (
    config.bundles?.includes('realtime') &&
    !config.includeWorker &&
    config.family === 'ts-turbo'
  ) {
    warnings.push('Realtime bundle works best with worker enabled (--worker).')
  }
  if (config.bundles?.includes('ai') && config.family !== 'ts-turbo' && config.family !== 'next') {
    warnings.push('AI bundle is designed for ts-turbo or next families.')
  }

  // Backend + family validation
  if (config.family && config.family !== 'ts-turbo' && config.family !== 'backend') {
    if (config.backend && config.backend !== 'none') {
      warnings.push(
        `Backend selection is only applicable to ts-turbo and backend families. Ignored for ${config.family}.`,
      )
    }
    if (config.database && config.database !== 'none') {
      warnings.push(
        `Database selection is only applicable to ts-turbo and backend families. Ignored for ${config.family}.`,
      )
    }
    if (config.orm && config.orm !== 'none') {
      warnings.push(
        `ORM selection is only applicable to ts-turbo and backend families. Ignored for ${config.family}.`,
      )
    }
  }

  return { warnings, errors }
}
