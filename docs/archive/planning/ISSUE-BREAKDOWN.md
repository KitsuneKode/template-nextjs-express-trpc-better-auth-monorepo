> Historical; do not use for implementation. See docs/README.md and AGENTS.md.

# Issue Breakdown: Every Problem + Every Fix

## Quick Reference Table

| Problem                          | Location                      | Root Cause                        | Fix                             | Effort  | Priority    |
| -------------------------------- | ----------------------------- | --------------------------------- | ------------------------------- | ------- | ----------- |
| **CLI doesn't generate .env**    | `apps/cli/dist/`              | CLI not rebuilt after code added  | `bun run build` in apps/cli     | 5 min   | 🔴 CRITICAL |
| **Better Auth types fail**       | `packages/auth/src/client.ts` | Complex inferred type             | Add `satisfies` annotation      | 15 min  | 🔴 CRITICAL |
| **No .env.local files**          | `apps/web/` `apps/server/`    | Missing for local dev             | Create .env.local (git-ignored) | 10 min  | 🔴 CRITICAL |
| **Template doesn't build**       | `apps/web/`                   | Missing .env vars                 | Phase 1 fixes + .env files      | 30 min  | 🔴 CRITICAL |
| **No .env.example**              | Template root                 | Users don't know setup            | Create .env.example files       | 15 min  | 🟠 HIGH     |
| **Config loader overly complex** | `packages/common/`            | 415 lines of custom code          | Migrate to t3-env               | 6 hours | 🟠 HIGH     |
| **No env validation**            | All packages                  | Each package has its own approach | Use t3-env schemas              | 6 hours | 🟠 HIGH     |

---

## ISSUE #1: CLI Doesn't Generate .env Files

### 🔴 Problem

After scaffolding with CLI, no `.env` files exist in the output:

```bash
npx create-arche my-app --yes
cd my-app
bun run build
# Error: Missing required environment variable: NEXT_PUBLIC_APP_URL
```

### 📍 Why It Happens

- **Code exists** in `apps/cli/src/lib/scaffold.ts:222-236`
- **Generator exists** in `apps/cli/src/lib/generators/env.ts`
- **But CLI dist is old** — built before code was added
- **dist/index.js was built** at `May 17 00:01` (before the commit that added env generation)

### ✅ Fix (5 minutes)

**Step 1: Rebuild CLI**

```bash
cd apps/cli
bun run build
# Creates new dist/index.js with env generation code
```

**Step 2: Test**

```bash
rm -rf /tmp/test-fixed
npx /home/kitsunekode/Projects/templates/template-nextjs-express-trpc-bettera-auth-monorepo/apps/cli/dist/index.js /tmp/test-fixed --yes
ls -la /tmp/test-fixed/apps/web/.env
# Should show: -rw-r--r-- ... .env
```

**Why this works:**

- The build process bundles `generators/env.ts` into `dist/index.js`
- Old dist doesn't include the env generation code
- New dist will have it

**Verify:**

```bash
# Old dist (broken)
ls -lh apps/cli/dist/index.js
# size: 169K, date: May 17 00:01

# After rebuild (fixed)
cd apps/cli && bun run build
ls -lh dist/index.js
# size: ~170K, date: today
```

---

## ISSUE #2: Better Auth Client Types Fail

### 🔴 Problem

Building `apps/web` fails:

```
Type error: The inferred type of 'authClient'
cannot be named without a reference to
'better-auth/dist/client/path-to-object.mjs'
```

### 📍 Why It Happens

- `createAuthClient()` returns a complex inferred type
- TypeScript can't generate `.d.ts` file because type is too complex
- No type annotation to give it a name

### ✅ Fix (15 minutes)

**File: `packages/auth/src/client.ts`**

**BEFORE:**

```typescript
import { clientConfig as config } from '@template/common/config-loader'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: config.getConfig('appUrl'),
})
```

**AFTER:**

```typescript
import { clientConfig as config } from '@template/common/config-loader'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: config.getConfig('appUrl'),
}) satisfies ReturnType<typeof createAuthClient>
```

**Alternative (if above doesn't work):**

```typescript
export const authClient = createAuthClient({
  baseURL: config.getConfig('appUrl'),
}) as const
```

**Why this works:**

- `satisfies` keyword tells TypeScript the type without naming it
- Gives the compiler enough info to generate types
- Better than `as const` — preserves type information

**Verify:**

```bash
cd packages/auth && bun run build
# Should succeed without type errors
```

---

## ISSUE #3: Missing .env.local Files

### 🔴 Problem

Users can't run the template locally:

```bash
cd apps/web
bun run dev
# Error: Missing environment variables
```

### 📍 Why It Happens

- `.env` files are git-ignored (correct)
- Template doesn't include them (by design)
- Users don't know they need to create them
- First-time experience: Fail on first command

### ✅ Fix (10 minutes)

**Step 1: Create `apps/web/.env.local`**

**File: `apps/web/.env.local`** (create if not exists)

```bash
# Frontend configuration
NEXT_PUBLIC_SITE_NAME=My App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_DESCRIPTION=Full-stack TypeScript application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Step 2: Create `apps/server/.env`**

**File: `apps/server/.env`** (create if not exists)

```bash
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/my_app
FRONTEND_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
BETTER_AUTH_SECRET=dev-secret-change-in-production-at-least-32-chars
BETTER_AUTH_URL=http://localhost:8080
```

**Step 3: Verify .gitignore**

Check `.gitignore` includes:

```bash
.env
.env.local
.env.*.local
```

**Why this works:**

- Files are git-ignored, won't be committed
- Developers create local copies, don't affect repo
- `.local` suffix is convention for git-ignored env files

**Verify:**

```bash
# Check files exist
ls -la apps/web/.env.local apps/server/.env

# Confirm they're ignored
git status
# Should NOT show these files
```

---

## ISSUE #4: Template Doesn't Build

### 🔴 Problem

All build attempts fail:

```bash
bun run build
# Error: Configuration resolution failed for "client"
# Missing required environment variable: NEXT_PUBLIC_APP_URL
```

### 📍 Why It Happens

- Caused by Issues #1, #2, #3 combined
- Issue #1: CLI doesn't generate .env
- Issue #2: Better Auth types fail
- Issue #3: No .env files for local dev
- Result: Can't build anything

### ✅ Fix (30 minutes total)

**This is solved by fixing Issues 1-3:**

1. Rebuild CLI (Issue #1) — ✅ 5 min
2. Fix Better Auth types (Issue #2) — ✅ 15 min
3. Create .env files (Issue #3) — ✅ 10 min

Then verify:

```bash
# Test web app
cd apps/web && bun run build
# Should succeed

# Test server
cd apps/server && bun run build
# Should succeed

# Test full build
bun run build
# Should succeed across all packages
```

---

## ISSUE #5: No .env.example Files

### 🔴 Problem

Users don't know what environment variables to set:

```bash
# User just scaffolded
npx create-arche my-app --yes
cd my-app
# Now what? What vars do I need?
# No .env.example to copy from
```

### 📍 Why It Happens

- CLI generates .env but NOT .env.example
- Template doesn't include examples
- Users have no reference

### ✅ Fix (15 minutes)

**File: `apps/web/.env.example`** (create)

```bash
# Frontend configuration
# This file documents all required and optional frontend variables.
# Copy to .env.local for local development.

NEXT_PUBLIC_SITE_NAME=My App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_DESCRIPTION=A full-stack TypeScript application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080

# See apps/web/env.ts for validation schema and defaults
```

**File: `apps/server/.env.example`** (create)

```bash
# Backend configuration
# This file documents all required and optional backend variables.
# Copy to .env for local development and customize as needed.

# Core Configuration
PORT=8080
NODE_ENV=development

# Database (choose based on your setup)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/my_app
# DATABASE_URL=sqlite:./dev.db
# DATABASE_URL=mongodb://mongo:mongo@localhost:27017/my_app?authSource=admin

# Frontend Reference
FRONTEND_URL=http://localhost:3000

# Cache/Queue
REDIS_URL=redis://localhost:6379

# Authentication (Better Auth)
BETTER_AUTH_SECRET=generate-a-random-secret-min-32-characters
BETTER_AUTH_URL=http://localhost:8080

# Optional: OAuth Providers
# GITHUB_CLIENT_ID=your_github_client_id
# GITHUB_CLIENT_SECRET=your_github_client_secret
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret

# See packages/backend-common/src/env.ts for validation schema
```

**Why this works:**

- `.example` files are committed to repo
- Users copy them to create local `.env` files
- Clear documentation of all variables
- References validation schemas

**Verify:**

```bash
# Files exist in git
git ls-files | grep env.example
# Should show both files

# Can be copied to create working env
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env
```

---

## ISSUE #6: Config Loader Is Overly Complex

### 🔴 Problem

`packages/common/src/utils/config-loader.ts` is **415 lines** of custom code:

- Custom validation logic
- Custom error handling
- Doesn't compose across packages
- Hard to test
- Duplicates what t3-env does (in 1/200th the code)

### 📍 Why It's a Problem

**Complexity:**

```typescript
// Current approach (415 lines)
const clientConfigSchema: ConfigSchema<ClientConfig> = {
  appUrl: () => readClientEnvUrl('NEXT_PUBLIC_APP_URL'),
  apiBaseUrl: () => readClientEnvUrl('NEXT_PUBLIC_API_URL'),
  nodeEnv: () => {
    /* complex logic */
  },
}

let clientConfigInstance: ConfigLoader<ClientConfig> | null = null
const getClientConfigInstance = (): ConfigLoader<ClientConfig> => {
  if (!clientConfigInstance) {
    clientConfigInstance = ConfigLoader.getInstance(clientConfigSchema, {
      key: 'client',
      logger: clientLogger,
    })
  }
  return clientConfigInstance
}

export const clientConfig: ClientConfigAccessor = {
  getConfig<K extends keyof ClientConfig>(key: K): ClientConfig[K] {
    return getClientConfigInstance().getConfig(key)
  },
  // ... more methods
}
```

**vs t3-env approach (10 lines):**

```typescript
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: process.env,
})
```

**Issues:**

- No schema composition (can't reuse in other packages)
- No presets (have to write everything from scratch)
- Verbose API (`getConfig('key')` vs just `env.KEY`)
- Hard to maintain (custom singleton pattern)
- Not extensible (can't add features easily)

### ✅ Fix (6+ hours)

**This is PHASE 3 of the comprehensive fix plan.**

See `docs/FIX-PLAN.md` for detailed steps.

---

## ISSUE #7: No Environment Validation Across Monorepo

### 🔴 Problem

- ✅ Web app has ConfigLoader for client env
- ❌ Server app has no env validation
- ❌ Worker has no env validation
- ❌ CLI has no env validation
- Result: Runtime errors when env vars are missing

### 📍 Why It Happens

- ConfigLoader only exports client config
- No shared server env schema
- Each app has to validate its own env (or doesn't)

### ✅ Fix (6+ hours)

**This is also PHASE 3 of the comprehensive fix plan.**

**With t3-env migration:**

```typescript
// packages/backend-common/src/env.ts (shared server schema)
export const serverEnv = createEnv({
  server: {
    PORT: z.coerce.number().default(8080),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
  },
  runtimeEnv: process.env,
})

// apps/server/env.ts (extends shared + app-specific)
export const env = createEnv({
  extends: [serverEnv],
  server: {
    APP_NAME: z.string().default('My App'),
  },
})

// apps/worker/env.ts (also extends shared)
export const env = createEnv({
  extends: [serverEnv],
})

// apps/cli/env.ts (uses same schema)
export const env = createEnv({
  extends: [serverEnv],
})
```

**Result:**

- All packages validate env at startup
- One source of truth for schema
- Type-safe everywhere
- Clear error messages if vars missing

---

## Implementation Order

### 🔴 Phase 1: CRITICAL (Do TODAY) - 30 minutes

Must complete to unblock everything else.

1. **Rebuild CLI** (5 min)

   ```bash
   cd apps/cli && bun run build
   ```

2. **Fix Better Auth types** (15 min)
   - Edit `packages/auth/src/client.ts`
   - Add `satisfies ReturnType<typeof createAuthClient>`

3. **Create .env files** (10 min)
   - Create `apps/web/.env.local`
   - Create `apps/server/.env`

**Verify:**

```bash
bun run build  # Everything builds
bun run dev    # App starts locally
```

---

### 🟠 Phase 2: HIGH (Do this week) - 45 minutes

Improves first-time user experience.

4. **Create .env.example files** (15 min)
   - `apps/web/.env.example`
   - `apps/server/.env.example`

5. **Update README** (15 min)
   - Add "Environment Setup" section
   - Show copy instructions
   - Reference schema docs

6. **End-to-end test** (15 min)
   ```bash
   rm -rf /tmp/test-scaffold
   npx create-arche /tmp/test-scaffold --yes
   cd /tmp/test-scaffold
   bun install
   bun run build  # Should work
   ```

---

### 🟡 Phase 3: MIGRATION (Do next week) - 6 hours

Full t3-env migration for type-safe env everywhere.

See detailed steps in `docs/FIX-PLAN.md` Phase 3.

---

## Visual Dependency Tree

```
Phase 1: Quick Fixes (CRITICAL)
├── Rebuild CLI
│   └── Enables .env generation in scaffolded apps
├── Fix Better Auth types
│   └── Template builds
└── Create .env.local files
    └── Apps can run locally

Phase 2: Documentation (HIGH)
├── .env.example files
├── README updates
└── End-to-end validation

Phase 3: Migration (MEDIUM)
├── Install t3-env
├── Create env schemas
│   ├── packages/common/src/env/*
│   ├── packages/backend-common/src/env.ts
│   └── apps/*/env.ts
├── Migrate imports
│   └── Replace clientConfig with env
└── Delete config-loader
    └── No longer needed
```

---

## Commit Strategy

After each phase, make **one commit** per phase:

### Phase 1 Commit

```bash
git add apps/cli dist/index.js packages/auth/src/client.ts apps/web/.env.local apps/server/.env
git commit -m "fix(env): enable .env generation and fix types

- Rebuild CLI to include env generators in dist
- Fix Better Auth client types with satisfies annotation
- Add .env.local for local development"
```

### Phase 2 Commit

```bash
git add apps/web/.env.example apps/server/.env.example README.md
git commit -m "docs(env): add .env.example and setup documentation

- Add environment variable examples for web and server
- Update README with local setup instructions
- Reference validation schemas"
```

### Phase 3 Commit (Large)

```bash
git add packages/common/src/env packages/backend-common/src/env.ts apps/web/env.ts apps/server/env.ts ...
git commit -m "refactor(env): migrate to t3-env for type-safe validation

BREAKING: Replaces ConfigLoader with t3-env

Benefits:
- Type-safe Zod validation
- Schema composition across packages
- Better error messages
- 2KB library vs 415 lines custom code

Migration:
- Adds t3-env schemas
- Migrates all imports from clientConfig to env
- Deletes custom ConfigLoader"
```

---

## What Gets Better

### Before (Current State)

```
User experience:
npm create arche my-app
→ Scaffolds
→ Installs dependencies
→ npm run build
→ ❌ ERROR: Missing env vars
→ Confusion, abandonment

Developer experience:
- ConfigLoader is complex (415 lines)
- No schema composition
- Type errors are unclear
- Each app validates independently
- Hard to test
```

### After (All Phases Done)

```
User experience:
npm create arche my-app
→ Scaffolds WITH .env files
→ Installs dependencies
→ npm run build
→ ✅ SUCCESS
→ npm run dev
→ ✅ App runs on localhost:3000
→ Happy user, product-market fit achieved

Developer experience:
- t3-env is simple (1 import)
- Schema composition works
- Clear, specific error messages
- All packages use same schema
- Easy to test with mocked env
- Type-safe everywhere
```

---

## Success Criteria (How to Know It's Fixed)

### Phase 1 ✅

- [ ] CLI rebuilds successfully
- [ ] Scaffolded apps have .env files
- [ ] Better Auth builds without type errors
- [ ] Template app builds end-to-end
- [ ] Can run `bun run dev` without env errors

### Phase 2 ✅

- [ ] .env.example files exist and can be copied
- [ ] README has clear setup instructions
- [ ] First-time user can scaffold → install → build → run
- [ ] All instructions are accurate

### Phase 3 ✅

- [ ] All env imports use t3-env
- [ ] Type errors are gone
- [ ] Error messages are clear when env is missing
- [ ] Schemas compose across packages
- [ ] Config-loader is deleted
- [ ] All tests pass
- [ ] Scaffolding still works correctly

---

## Questions?

Before starting implementation:

1. Should I start with Phase 1 today?
2. How much time do you have available?
3. Should I implement all 3 phases, or just Phase 1?
4. Any specific blockers or concerns?
