/**
 * Database generator
 *
 * Post-scaffold transformations for non-default database selections.
 * The template ships with PostgreSQL + Prisma as the default. When a
 * different database is selected, this generator rewrites the relevant
 * store and auth package files.
 */

import { readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import type { ProjectConfig } from '../../types/schemas'
import { join, dirname } from 'node:path'

// =============================================================================
// SQLite (via Prisma with libsql adapter)
// =============================================================================

function sqlitePrismaSchema(): string {
  return `datasource db {
  provider = "sqlite"
}

generator client {
  provider = "prisma-client"
  output   = "../src/generated"
}

// ─── Better Auth models ─────────────────────────────────────────────────────

model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
  posts         Post[]
  messages      Message[]

  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@map("account")
}

model Verification {
  id         String    @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime? @default(now())
  updatedAt  DateTime? @updatedAt

  @@map("verification")
}

// ─── Application models ─────────────────────────────────────────────────────

model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("post")
}

model Message {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  senderId  String
  sender    User     @relation(fields: [senderId], references: [id], onDelete: Cascade)

  @@map("message")
}
`
}

function sqliteStoreIndex(): string {
  return `import { PrismaClient } from './generated/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
`
}

function sqliteStorePackageJsonPatch(): {
  removeDeps: string[]
  addDeps: Record<string, string>
} {
  return {
    removeDeps: ['@prisma/adapter-pg', 'pg'],
    addDeps: {},
  }
}

function sqlitePrismaConfig(): string {
  return `import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
})
`
}

function sqliteAuthPatch(): string {
  return `import { prisma } from '@template/store'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  plugins: [],
  socialProviders: {},
})

export { toNodeHandler, fromNodeHeaders }
export type Session = typeof auth.$Infer.Session
`
}

// =============================================================================
// MongoDB (via Prisma with built-in MongoDB driver)
// =============================================================================

function mongoPrismaSchema(): string {
  return `datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client"
  output   = "../src/generated"
}

// ─── Better Auth models ─────────────────────────────────────────────────────

model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
  posts         Post[]
  messages      Message[]

  @@map("user")
}

model Session {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("session")
}

model Account {
  id                    String    @id @default(auto()) @map("_id") @db.ObjectId
  accountId             String
  providerId            String
  userId                String    @db.ObjectId
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@map("account")
}

model Verification {
  id         String    @id @default(auto()) @map("_id") @db.ObjectId
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime? @default(now())
  updatedAt  DateTime? @updatedAt

  @@map("verification")
}

// ─── Application models ─────────────────────────────────────────────────────

model Post {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  slug      String   @unique
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  String   @db.ObjectId
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("post")
}

model Message {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  content   String
  createdAt DateTime @default(now())
  senderId  String   @db.ObjectId
  sender    User     @relation(fields: [senderId], references: [id], onDelete: Cascade)

  @@map("message")
}
`
}

function mongoStoreIndex(): string {
  return `import { PrismaClient } from './generated/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
`
}

function mongoStorePackageJsonPatch(): {
  removeDeps: string[]
  addDeps: Record<string, string>
  scriptOverrides: Record<string, string>
} {
  return {
    removeDeps: ['@prisma/adapter-pg', 'pg'],
    addDeps: {},
    scriptOverrides: {
      // MongoDB doesn't use SQL migrations — use db push instead
      'db:migrate': 'bunx --bun prisma db push',
      'db:reset': 'bunx --bun prisma db push --force-reset',
    },
  }
}

function mongoPrismaConfig(): string {
  return `import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})
`
}

function mongoAuthPatch(): string {
  return `import { prisma } from '@template/store'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  plugins: [],
  socialProviders: {},
})

export { toNodeHandler, fromNodeHeaders }
export type Session = typeof auth.$Infer.Session
`
}

// =============================================================================
// Helpers
// =============================================================================

async function writeFile_(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content)
}

async function patchStorePackageJson(
  packageJsonPath: string,
  patch: {
    removeDeps: string[]
    addDeps: Record<string, string>
    scriptOverrides?: Record<string, string>
  },
): Promise<void> {
  const raw = await readFile(packageJsonPath, 'utf8')
  const pkg = JSON.parse(raw) as Record<string, unknown>

  const deps = (pkg.dependencies ?? {}) as Record<string, string>
  for (const name of patch.removeDeps) delete deps[name]
  Object.assign(deps, patch.addDeps)
  pkg.dependencies = deps

  if (patch.scriptOverrides) {
    const scripts = (pkg.scripts ?? {}) as Record<string, string>
    Object.assign(scripts, patch.scriptOverrides)
    pkg.scripts = scripts
  }

  await writeFile(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n')
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Apply database-specific transformations to the scaffolded project.
 * Called after template copy and cleanup, before env/docker/ci generation.
 */
export async function applyDatabaseTransform(
  destinationDir: string,
  config: ProjectConfig,
): Promise<void> {
  if (config.database === 'postgres') return // default, no transformation needed

  if (config.database === 'sqlite') {
    // 1. Rewrite Prisma schema for SQLite
    await writeFile_(
      join(destinationDir, 'packages/store/prisma/schema.prisma'),
      sqlitePrismaSchema(),
    )

    // 2. Rewrite store index (no pg adapter needed)
    await writeFile_(join(destinationDir, 'packages/store/src/index.ts'), sqliteStoreIndex())

    // 3. Rewrite prisma.config.ts (no URL needed for SQLite file)
    await writeFile_(join(destinationDir, 'packages/store/prisma.config.ts'), sqlitePrismaConfig())

    // 4. Remove old migrations (provider-locked to postgres)
    await rm(join(destinationDir, 'packages/store/prisma/migrations'), {
      recursive: true,
      force: true,
    })

    // 5. Patch store package.json (remove pg deps)
    await patchStorePackageJson(
      join(destinationDir, 'packages/store/package.json'),
      sqliteStorePackageJsonPatch(),
    )

    // 6. Update auth to use sqlite provider
    await writeFile_(join(destinationDir, 'packages/auth/src/index.ts'), sqliteAuthPatch())

    return
  }

  if (config.database === 'mongodb') {
    // 1. Rewrite Prisma schema for MongoDB (ObjectId types, no SQL features)
    await writeFile_(
      join(destinationDir, 'packages/store/prisma/schema.prisma'),
      mongoPrismaSchema(),
    )

    // 2. Rewrite store index (no pg adapter, plain PrismaClient)
    await writeFile_(join(destinationDir, 'packages/store/src/index.ts'), mongoStoreIndex())

    // 3. Rewrite prisma.config.ts (no migrations path for MongoDB)
    await writeFile_(join(destinationDir, 'packages/store/prisma.config.ts'), mongoPrismaConfig())

    // 4. Remove old SQL migrations (MongoDB doesn't use them)
    await rm(join(destinationDir, 'packages/store/prisma/migrations'), {
      recursive: true,
      force: true,
    })

    // 5. Patch store package.json (remove pg deps, update scripts)
    await patchStorePackageJson(
      join(destinationDir, 'packages/store/package.json'),
      mongoStorePackageJsonPatch(),
    )

    // 6. Update auth to use mongodb provider
    await writeFile_(join(destinationDir, 'packages/auth/src/index.ts'), mongoAuthPatch())

    return
  }

  if (config.database === 'none') {
    // Remove the store package and auth database configuration entirely
    // For now, leave as-is since this is a niche case.
    // Users can manually strip database references.
    return
  }
}
