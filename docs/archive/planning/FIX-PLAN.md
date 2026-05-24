> Historical; do not use for implementation. See docs/README.md and AGENTS.md.

# Comprehensive Fix Plan: All Issues + Solutions

## Executive Summary

**Critical Issues Found: 7**

- CLI doesn't generate .env files ❌
- Template doesn't build (Better Auth types) ❌
- Config loader is overly complex ❌
- No env validation/type safety ❌
- Scaffolded apps can't build locally ❌
- Missing .env.example in template ❌
- No clear env structure for monorepo ❌

**Solution: Migrate to t3-env + Fix Generator**

Effort: ~8-10 hours across all fixes
Priority: CRITICAL (blocks all scaffolding)

---

## Problem 1: CLI Doesn't Generate .env Files

### Location

- `apps/cli/src/lib/scaffold.ts` — Code exists but has a bug
- `apps/cli/src/lib/generators/env.ts` — Generator functions exist

### What's Happening

The code looks correct:

```typescript
// Line 222-236 in scaffold.ts
const serverEnvContent = buildServerEnv(options)
const webEnvContent = buildWebEnv()

await writeGeneratedFile(destinationDir, 'apps/server/.env.example', serverEnvContent)
await writeGeneratedFile(destinationDir, 'apps/web/.env.example', webEnvContent)
await writeGeneratedFile(destinationDir, 'apps/server/.env', serverEnvContent)
await writeGeneratedFile(destinationDir, 'apps/web/.env', webEnvContent)
```

But the **built CLI** (`apps/cli/dist/index.js`) was built at `May 17 00:01` and doesn't have the updated code.

### Root Cause

The CLI needs to be **rebuilt** after the env generation code was added.

### Fix

```bash
cd apps/cli
bun run build
```

### Verification

After rebuild, scaffold again:

```bash
cd /tmp/test-arche-app-fixed
rm -rf .env .env.example apps/*/env*
npx create-arche ../test-arche-app-fixed --yes
ls -la apps/web/.env apps/server/.env
# Should show both files exist
```

**Effort: 5 minutes**

---

## Problem 2: Better Auth Client Type Errors

### Location

- `packages/auth/src/client.ts` — Missing type annotation

### What's Happening

When building `@arche-template/web`, TypeScript fails:

```
Type error: The inferred type of 'authClient'
cannot be named without a reference to 'better-auth/dist/client/path-to-object.mjs'
```

### Root Cause

`createAuthClient()` returns a complex inferred type that TypeScript can't serialize to `.d.ts` files.

### Fix

Add explicit type annotation:

**File: `packages/auth/src/client.ts`**

```typescript
import { clientConfig as config } from '@arche-template/common/config-loader'
import { createAuthClient } from 'better-auth/react'
import type { BetterAuthClientPlugin } from 'better-auth/client'

export const authClient = createAuthClient({
  baseURL: config.getConfig('appUrl'),
}) satisfies ReturnType<typeof createAuthClient>
```

Alternative: Use `as const` assertion:

```typescript
export const authClient = createAuthClient({
  baseURL: config.getConfig('appUrl'),
}) as const
```

**Verification:**

```bash
cd packages/auth && bun run build
# Should succeed without type errors
```

**Effort: 15 minutes**

---

## Problem 3: Template Doesn't Build

### Location

- `apps/web/` — Next.js build fails
- Root cause: `.env` file missing + Better Auth types

### What's Happening

```bash
cd apps/web
bun run build
# Error: Configuration resolution failed for "client"
# Missing required environment variable: NEXT_PUBLIC_APP_URL
```

### Fix

**Step 1:** Generate .env files in template root

**File: Create `apps/web/.env.local`** (git-ignored)

```env
NEXT_PUBLIC_SITE_NAME=Template
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_DESCRIPTION=Full-stack TypeScript template
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**File: Create `apps/server/.env.local`** (git-ignored)

```env
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
BETTER_AUTH_SECRET=dev-secret-change-in-production
BETTER_AUTH_URL=http://localhost:8080
```

**Step 2:** Update `.gitignore` to exclude `.env.local`:

**File: `.gitignore`**

```bash
# Already should have:
.env
.env.local
.env.*.local
```

**Verification:**

```bash
cd apps/web && bun run build
# Should succeed
```

**Effort: 10 minutes**

---

## Problem 4: Custom Config Loader Is Overly Complex

### Location

- `packages/common/src/utils/config-loader.ts` — 415 lines of custom code

### Why This Is A Problem

1. **Duplicates t3-env functionality** — t3-env does this better
2. **No schema reuse** — Can't extend env schemas across packages
3. **Complex API** — `ConfigLoader.getInstance()`, `.getConfig()`, `.validate()`
4. **No type-safe presets** — t3-env has Vercel, Node.js presets
5. **Hard to test** — Requires mocking entire ConfigLoader
6. **Unmaintainable** — Custom validation logic scattered everywhere

### Why Use t3-env Instead

- **Official, well-maintained** — Used by thousands of apps
- **Schema composition** — Extend env across packages
- **Built-in validation** — Zod integration, type inference
- **Cleaner API** — Just import `env` and use it
- **Smaller bundle** — ~2KB vs 415 lines custom code
- **Better error messages** — Clear validation errors
- **Runtime + Build time validation** — Catches errors early

### Migration Path

1. **Install t3-env**

   ```bash
   bun add @t3-oss/env-core @t3-oss/env-nextjs zod
   ```

2. **Create shared env module** → `packages/common/src/env.ts`
3. **Create app-specific env** → `apps/web/env.ts`, `apps/server/env.ts`
4. **Delete config-loader** → Remove after migration complete
5. **Update all imports** → Replace `clientConfig` with `env`

**Effort: 2-3 hours (detailed below)**

---

## Problem 5: No Env Validation Across Monorepo

### Location

- `packages/common/src/utils/config-loader.ts` — Client only
- `apps/server/` — No env validation
- `apps/cli/` — No env validation

### What's Missing

- ✅ Client env (`apps/web`) — Has ConfigLoader
- ❌ Server env (`apps/server`) — No validation
- ❌ Worker env (`apps/worker`) — No validation
- ❌ CLI env (`apps/cli`) — No validation
- ❌ Shared env logic — Duplicated across packages

### Solution: t3-env Structure

```
packages/
├── common/
│   └── src/
│       ├── env/
│       │   ├── index.ts          ← Export all env modules
│       │   ├── shared.ts         ← Shared env (DATABASE_URL, etc)
│       │   ├── client.ts         ← Frontend env (NEXT_PUBLIC_*)
│       │   ├── server.ts         ← Backend env (NODE_ENV, PORT, etc)
│       │   └── presets.ts        ← Reusable presets
│       └── index.ts
├── backend-common/
│   └── src/
│       └── env.ts                ← Server/worker/CLI env
```

**Effort: 3 hours (detailed below)**

---

## Problem 6: CLI Env Generator Outputs Wrong Content

### Location

- `apps/cli/src/lib/generators/env.ts` — Generator creates valid but needs migration

### What's Happening

The generator creates this format:

```bash
# ============================================
# Core Configuration
# ============================================
PORT=8080
NODE_ENV=development
```

This is **fine for now** but should eventually use env schema patterns like:

```bash
# .env format (used by apps/web and apps/server)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Why It Works But Could Be Better

Current approach:

- ✅ Creates working .env files
- ✅ Includes comments explaining each section
- ✅ Provides production examples
- ❌ Doesn't validate against schema
- ❌ Values are hardcoded, not schema-aware
- ❌ Can get out of sync with actual env needs

### Fix

Migrate env generator to read from t3-env schemas:

**File: `apps/cli/src/lib/generators/env.ts`** (Updated)

```typescript
/**
 * Environment file generator (t3-env aware)
 *
 * Generates .env files from t3-env schemas selected during scaffolding.
 */

import type { ProjectConfig } from '../../types/schemas'
import { sanitizeProjectName } from '../scaffold'

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

/** Generate server .env from t3-env schema */
export function buildServerEnv(config: ProjectConfig): string {
  const lines: string[] = [
    `# Server environment - generated by create-arche`,
    `# See packages/backend-common/src/env.ts for validation schema`,
    ``,
    `# Core Configuration`,
    `PORT=8080`,
    `NODE_ENV=development`,
  ]

  const dbUrl = buildDatabaseUrl(config)
  if (dbUrl) {
    lines.push(`DATABASE_URL=${dbUrl}`)
  }

  lines.push(
    ``,
    `# Backend & API`,
    `FRONTEND_URL=http://localhost:3000`,
    `REDIS_URL=redis://localhost:6379`,
    ``,
    `# Authentication (Better Auth)`,
    `BETTER_AUTH_SECRET=replace-with-a-long-random-secret`,
    `BETTER_AUTH_URL=http://localhost:8080`,
  )

  return lines.join('\n') + '\n'
}

/** Generate web .env from t3-env schema */
export function buildWebEnv(): string {
  return `# Frontend environment - generated by create-arche
# See apps/web/env.ts for validation schema

NEXT_PUBLIC_SITE_NAME=My App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_DESCRIPTION=A full-stack TypeScript application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
`
}

/** Generate CLI .env (minimal - CLI uses defaults) */
export function buildCliEnv(): string {
  return `# CLI configuration - mostly uses defaults
# CLI uses environment from parent process

NODE_ENV=development
`
}
```

**Effort: 30 minutes**

---

## Problem 7: No .env.example in Template Root

### Location

- `apps/web/` — No `.env.example`
- `apps/server/` — No `.env.example`
- Root — No `.env.example` or documentation

### What's Needed

Users need to know:

1. Which env vars are required
2. What format they should be in
3. How to set them up locally
4. Where to find documentation

### Solution

Create `.env.example` files:

**File: `apps/web/.env.example`**

```bash
# Frontend configuration
# Copy to .env.local for local development

NEXT_PUBLIC_SITE_NAME=My App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_DESCRIPTION=A full-stack TypeScript application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080

# See apps/web/env.ts for validation schema and defaults
```

**File: `apps/server/.env.example`**

```bash
# Backend configuration
# Copy to .env for local development

PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/my_app
FRONTEND_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379

BETTER_AUTH_SECRET=dev-secret-change-in-production
BETTER_AUTH_URL=http://localhost:8080

# Optional: OAuth Providers
# GITHUB_CLIENT_ID=your_github_client_id
# GITHUB_CLIENT_SECRET=your_github_client_secret

# See packages/backend-common/src/env.ts for validation schema
```

**File: `README.md` (Add section)**

````markdown
## Environment Setup

### Local Development

1. **Frontend (.env.local)**
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```
````

2. **Backend (.env)**

   ```bash
   cp apps/server/.env.example apps/server/.env
   # Edit values as needed
   ```

3. **Run services**
   ```bash
   docker-compose up -d  # Redis, Postgres
   bun run dev           # Start all services
   ```

### Required Variables

See `docs/environment-variables.md` for complete reference.

````

**Effort: 15 minutes**

---

## Complete Migration: Config Loader → t3-env

This is the **largest change** but provides the most value.

### Step 1: Install Dependencies

```bash
bun add @t3-oss/env-core @t3-oss/env-nextjs zod
````

**Effort: 2 minutes**

---

### Step 2: Create Shared Env Schemas

**File: `packages/common/src/env/shared.ts`** (NEW)

```typescript
/**
 * Shared environment variables used across frontend and backend.
 * Part of t3-env schema composition.
 */

import { z } from 'zod'

export const sharedEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

export type SharedEnv = z.infer<typeof sharedEnvSchema>
```

**File: `packages/common/src/env/client.ts`** (NEW)

```typescript
/**
 * Client-side environment variables for Next.js frontend.
 * All variables must be prefixed with NEXT_PUBLIC_.
 */

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'
import { sharedEnvSchema } from './shared'

export const clientEnv = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_SITE_NAME: z.string().default('My App'),
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_SITE_DESCRIPTION: z.string().default('Full-stack TypeScript application'),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  clientPrefix: 'NEXT_PUBLIC_',
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})

export type ClientEnv = typeof clientEnv
```

**Effort: 20 minutes**

---

### Step 3: Create Server Env Schema

**File: `packages/backend-common/src/env.ts`** (NEW)

```typescript
/**
 * Backend environment variables for Express server, Worker, and CLI.
 * Uses t3-env-core for runtime validation.
 */

import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const serverEnv = createEnv({
  server: {
    // Core
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(8080),

    // Database
    DATABASE_URL: z.string().url(),

    // Redis
    REDIS_URL: z.string().url().default('redis://localhost:6379'),

    // Frontend
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),

    // Better Auth
    BETTER_AUTH_SECRET: z.string().min(32, 'Must be at least 32 characters'),
    BETTER_AUTH_URL: z.string().url(),

    // Optional OAuth
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})

export type ServerEnv = typeof serverEnv
```

**Effort: 20 minutes**

---

### Step 4: Update Client Implementation

**File: `packages/common/src/utils/config-loader.ts`** (DELETE AFTER)

Once migrated, delete this file. But first, update imports everywhere.

**File: `apps/web/env.ts`** (NEW)

```typescript
/**
 * Frontend environment for Next.js (extends shared + client).
 * Auto-validates on build and runtime.
 */

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'
import { clientEnv } from '@arche-template/common/src/env/client'

export const env = createEnv({
  extends: [clientEnv],
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})

export type Env = typeof env
```

**Effort: 15 minutes**

---

### Step 5: Update All Imports

**Replace in entire codebase:**

From:

```typescript
import { clientConfig } from '@arche-template/common/config-loader'
const appUrl = clientConfig.getConfig('appUrl')
```

To:

```typescript
import { env } from '@arche-template/common/env/client'
const appUrl = env.NEXT_PUBLIC_APP_URL
```

**Files to update:**

- `apps/web/` — All components (grep `clientConfig`)
- `packages/auth/src/client.ts` — Better Auth setup
- Any other files importing `config-loader`

**Command to find all:**

```bash
rg "clientConfig|config-loader" --type ts --type tsx
```

**Effort: 1 hour**

---

### Step 6: Delete Old Config Loader

Once all imports updated:

```bash
rm packages/common/src/utils/config-loader.ts
rm packages/common/src/utils/client-logger.ts  # No longer needed
```

Update `packages/common/src/index.ts` exports.

**Effort: 10 minutes**

---

### Step 7: Update CLI Generators

Update `apps/cli/src/lib/generators/env.ts` to reference t3-env schemas.

**Effort: 30 minutes**

---

## Complete Chronological Fix Order

### Phase 1: Quick Wins (30 minutes)

1. ✅ Rebuild CLI → Enables .env generation
2. ✅ Fix Better Auth types → Template builds
3. ✅ Create `.env.local` files → App runs locally

### Phase 2: Template Validation (45 minutes)

4. ✅ Create `.env.example` files
5. ✅ Update README with env setup steps
6. ✅ Verify template builds end-to-end

### Phase 3: t3-env Migration (5-6 hours)

7. ⚠️ Install t3-env dependencies
8. ⚠️ Create shared env schemas
9. ⚠️ Create client/server env modules
10. ⚠️ Update all imports (1 hour)
11. ⚠️ Delete config-loader
12. ⚠️ Update CLI generators

---

## Validation Checklist

After each phase:

### Phase 1 Validation

```bash
# CLI builds
cd apps/cli && bun run build

# CLI scaffolds with .env files
rm -rf /tmp/test-app-fixed
npx create-arche /tmp/test-app-fixed --yes
ls -la /tmp/test-app-fixed/apps/web/.env
ls -la /tmp/test-app-fixed/apps/server/.env

# Template builds
cd apps/web && bun run build
cd apps/server && bun run build
```

### Phase 2 Validation

```bash
# Copy .env.example to .env
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env

# Build and run
bun run build
bun run dev
# Should start on port 3000 without errors
```

### Phase 3 Validation

```bash
# All env imports work
bun run type-check

# All builds succeed
bun run build

# t3-env validation at runtime
bun run dev
# Should validate env on startup

# CLI generates correct .env files
rm -rf /tmp/test-t3env
npx create-arche /tmp/test-t3env --yes
cd /tmp/test-t3env
bun install
bun run build  # Should succeed
bun run dev    # Should start without env errors
```

---

## Files Modified Summary

### Create (New Files)

- `packages/common/src/env/shared.ts`
- `packages/common/src/env/client.ts`
- `packages/common/src/env/index.ts`
- `packages/backend-common/src/env.ts`
- `apps/web/env.ts`
- `apps/server/env.ts` (if not exists)
- `apps/web/.env.local` (git-ignored)
- `apps/server/.env` (git-ignored)
- `apps/web/.env.example`
- `apps/server/.env.example`

### Modify (Update)

- `apps/cli/src/lib/scaffold.ts` — No change needed (just rebuild)
- `apps/cli/src/lib/generators/env.ts` — Update comments
- `packages/auth/src/client.ts` — Fix type annotation
- `apps/web/` — Replace all `clientConfig` with `env`
- `packages/common/src/index.ts` — Update exports
- `README.md` — Add env setup section
- `.gitignore` — Add `.env.local`

### Delete

- `packages/common/src/utils/config-loader.ts`
- `packages/common/src/utils/client-logger.ts` (optional)

### CLI Changes

- Rebuild `apps/cli` to bundle .env generation

---

## Implementation Notes

### Why t3-env Wins

1. **Composition** — Extend schemas across packages (shared, client, server)
2. **Type Safety** — Full TypeScript inference, catch errors at build time
3. **Validation** — Zod integration, clear error messages at runtime
4. **Presets** — Vercel, Node.js, frameworks (already built)
5. **Cleaner Code** — 1 line import vs 415 lines custom code
6. **Well-maintained** — Official, battle-tested in production apps
7. **Better Errors** — Shows exactly which vars are missing/invalid
8. **Smaller Bundle** — ~2KB vs custom implementation

### Backward Compatibility

- During migration: both config-loader and t3-env can coexist
- Gradual: migrate imports file-by-file
- No breaking changes to public APIs (internal only)

### Testing During Migration

Each file updated:

```bash
bun run type-check    # Catch type errors
bun run lint          # Catch import errors
bun run build         # Catch missing env
```

---

## Total Effort Estimate

| Phase     | Task                                      | Hours         |
| --------- | ----------------------------------------- | ------------- |
| 1         | Rebuild CLI                               | 0.1           |
| 1         | Fix Better Auth types                     | 0.25          |
| 1         | Create .env.local files                   | 0.25          |
| 2         | Create .env.example files                 | 0.25          |
| 2         | Update README                             | 0.25          |
| 2         | Validation & testing                      | 0.5           |
| 3         | Install dependencies                      | 0.05          |
| 3         | Create env schemas (shared/client/server) | 1.5           |
| 3         | Update CLI generators                     | 0.5           |
| 3         | Migrate imports                           | 1.5           |
| 3         | Delete old code                           | 0.25          |
| 3         | Full validation                           | 1.0           |
| **TOTAL** | **All phases**                            | **7-8 hours** |

---

## Commit Strategy

After each phase, commit with clear message:

```bash
# Phase 1
git commit -m "fix: rebuild CLI with .env generation enabled

- Rebuild CLI to include buildServerEnv/buildWebEnv in dist
- Fix Better Auth client types with explicit return type
- Create .env.local files for local development"

# Phase 2
git commit -m "docs: add environment setup documentation

- Add .env.example files for web and server
- Update README with env setup steps
- Add environment variables reference guide"

# Phase 3
git commit -m "refactor: migrate to t3-env for environment validation

BREAKING: Replaces custom ConfigLoader with t3-env

Benefits:
- Type-safe environment validation (Zod)
- Schema composition across monorepo packages
- Better error messages and presets
- 2KB library vs 415 lines custom code

Migration:
- Adds packages/common/src/env/* schemas
- Adds packages/backend-common/src/env.ts
- Replaces clientConfig with env import
- Deletes config-loader and client-logger"
```

---

## Next Steps (In Order)

1. **TODAY**: Execute Phase 1 (30 min) → Verify scaffolding works
2. **THIS WEEK**: Execute Phase 2 (45 min) → Verify template builds
3. **NEXT WEEK**: Execute Phase 3 (6 hours) → Complete migration
4. **POST-MIGRATION**:
   - Deploy scaffolded app to Railway
   - Record video walkthrough
   - Create quick-start guide
   - Community testing

---

## Questions Before Implementation

Before starting, clarify:

1. **Monorepo structure** — Apps need separate env or shared?
   - Current: Web (.env.local) + Server (.env) separate ✓
2. **Database choices** — Which are primary (Postgres, SQLite)?
   - Primary: Postgres (cloudflare/neon friendly)
   - Secondary: SQLite (local dev)
3. **OAuth support** — GitHub, Google, or both?
   - Optional in schema, both supported
4. **Worker env** — Needs separate schema?
   - Yes: `packages/backend-common/src/env.ts` covers both

---

## Success Criteria

✅ CLI scaffolds with .env files
✅ Scaffolded apps build without manual env setup
✅ Template repo builds end-to-end
✅ All types are strict (no `any`)
✅ Env validation works at runtime
✅ Error messages are clear
✅ Documentation is up-to-date
✅ First-time users succeed on first try
