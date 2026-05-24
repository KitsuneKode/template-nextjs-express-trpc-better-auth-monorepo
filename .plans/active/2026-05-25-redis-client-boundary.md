# Redis Client Boundary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use official `redis` for application Redis lifecycle access while retaining `ioredis` only for BullMQ connections in the TypeScript fullstack template.

**Architecture:** `packages/backend-common/src/redis/index.ts` remains the application-facing subpath, but its private client changes to `createClient` from `redis`. `packages/backend-common/src/redis/bull-connection.ts` remains an explicit BullMQ adapter and continues creating `ioredis` connections. The scaffold copies this root template, so dependency and generated-output tests establish the rule for new projects.

**Tech Stack:** Bun workspaces, TypeScript, `redis`/node-redis, BullMQ, `ioredis`, Bun test, Turborepo.

---

### Task 1: Record the dependency ownership rule

**Files:**

- Create: `.docs/decisions/0002-redis-client-boundaries.md`
- Create: `.plans/active/2026-05-25-redis-client-boundary.md`

- [x] **Step 1: Document the accepted boundary**

Record that `redis` owns general application access and `ioredis` is an
adapter dependency for BullMQ only.

- [x] **Step 2: Commit the decision and plan**

```bash
git add .docs/decisions/0002-redis-client-boundaries.md .plans/active/2026-05-25-redis-client-boundary.md
git commit -m "docs(redis): establish client ownership boundary"
```

### Task 2: Add generated-project evidence before changing the template

**Files:**

- Modify: `apps/cli/tests/workspace-output.test.ts`
- Modify: `apps/cli/src/render/workspace/foundation.ts`

- [x] **Step 1: Add failing assertions for the fullstack dependency boundary**

Within the Bun fullstack output test, read
`packages/backend-common/package.json` and assert:

```ts
expect(backendCommon.dependencies.redis).toBe('catalog:')
expect(backendCommon.dependencies.ioredis).toBe('catalog:')
expect(appRedis).toContain("from 'redis'")
expect(bullRedis).toContain("from 'ioredis'")
```

Within the pnpm test, make the same assertions so both first-class package
manager paths carry the application Redis dependency. Add both clients to
`DEFAULT_WORKSPACE_CATALOG` so generated packages receive `catalog:`
references.

- [x] **Step 2: Run the focused test to verify it fails**

```bash
bun test apps/cli/tests/workspace-output.test.ts
```

Expected: FAIL because `packages/backend-common` does not yet declare
`redis`.

### Task 3: Migrate the application Redis adapter

**Files:**

- Modify: `packages/backend-common/src/redis/index.ts`
- Modify: `packages/backend-common/package.json`
- Modify: `bun.lock`

- [x] **Step 1: Change only the application-facing client**

Implement the lifecycle wrapper with the official package:

```ts
import { createClient } from 'redis'
import { resolveRedisUrl } from '../utils/redis-enabled'

export type AppRedisClient = {
  connect(): Promise<void>
  close(): Promise<void>
}

export const redisClient = (): AppRedisClient => {
  const url = resolveRedisUrl()
  if (!url) {
    throw new Error('REDIS_URL is not configured (set REDIS_URL or ENABLE_REDIS=false)')
  }

  const client = createClient({ url })
  client.on('error', (error) => {
    console.error('[redis] client error:', error)
  })

  return {
    async connect() {
      await client.connect()
    },
    async close() {
      await client.quit()
    },
  }
}
```

Add `"redis"` to `packages/backend-common` dependencies and install through
Bun to update the lockfile. Leave `src/redis/bull-connection.ts` on
`ioredis`.

- [x] **Step 2: Run the focused test to verify it passes**

```bash
bun test apps/cli/tests/workspace-output.test.ts
```

Expected: PASS for Bun and pnpm generated fullstack output.

### Task 4: Align agent and public architecture context

**Files:**

- Modify: `AGENTS.md`
- Modify: `packages/backend-common/AGENTS.md`
- Modify: `docs/architecture.md`

- [x] **Step 1: Describe both Redis owners without duplicating implementation detail**

Change stack/context wording to say application Redis uses official `redis`
and BullMQ connections use `ioredis`. Keep deployment/env docs unchanged
because `REDIS_URL` and `ENABLE_REDIS` behavior do not change.

- [x] **Step 2: Commit the complete implementation slice**

```bash
git add .plans/active/2026-05-25-redis-client-boundary.md apps/cli/src/render/workspace/foundation.ts apps/cli/tests/workspace-output.test.ts packages/backend-common/src/redis/index.ts packages/backend-common/package.json bun.lock AGENTS.md packages/backend-common/AGENTS.md docs/architecture.md
git commit -m "refactor(redis): isolate ioredis to BullMQ connections"
```

### Task 5: Prevent stale server bundles from JIT package cache gaps

**Files:**

- Create: `tests/src/toolings/server-turbo-cache.test.ts`
- Modify: `apps/server/turbo.json`
- Modify: `.docs/decisions/0002-redis-client-boundaries.md`

- [x] **Step 1: Add failing cache-input evidence**

Read `apps/server/turbo.json` in a Bun test and require both `build` and
`build:vercel` to include:

```ts
'$TURBO_ROOT$/packages/*/src/**'
'$TURBO_ROOT$/packages/*/package.json'
```

Also require `build` to preserve inherited inputs with `$TURBO_EXTENDS$` and
`build:vercel` to retain package defaults with `$TURBO_DEFAULT$`.

- [x] **Step 2: Verify the regression test fails before configuration changes**

```bash
bun test tests/src/toolings/server-turbo-cache.test.ts
```

Expected: FAIL because Vercel logs demonstrated a cache hit after
`packages/backend-common/src/redis/index.ts` changed.

- [x] **Step 3: Configure server bundle inputs for JIT shared packages**

```json
{
  "build:vercel": {
    "inputs": [
      "$TURBO_DEFAULT$",
      "$TURBO_ROOT$/packages/*/src/**",
      "$TURBO_ROOT$/packages/*/package.json"
    ],
    "outputs": ["dist/**"]
  },
  "build": {
    "inputs": [
      "$TURBO_EXTENDS$",
      "$TURBO_ROOT$/packages/*/src/**",
      "$TURBO_ROOT$/packages/*/package.json"
    ],
    "outputs": ["dist/**"]
  }
}
```

This prevents a shared source edit from reusing a stale API bundle while
retaining the repository-level `.env*` build inputs.

- [x] **Step 4: Verify the cache-input regression test passes**

```bash
bun test tests/src/toolings/server-turbo-cache.test.ts
```

Expected: PASS.

### Task 6: Verify the full slice

**Files:**

- Modify: `.plans/active/2026-05-25-redis-client-boundary.md`

- [ ] **Step 1: Run full local verification**

```bash
bun run ci
bun run build:vercel --filter=@arche-template/server
```

Expected: typechecks, tests, repo doctor, and the server Vercel bundle pass.

Earlier local verification covered the Redis adapter before Vercel logs
revealed the missing Turbo JIT-package cache inputs. Re-run this gate after the
cache correction before marking the slice shipped.

- [ ] **Step 2: Push and inspect remote checks**

```bash
git push origin main
gh run list --limit 6
vercel ls --yes
```

Expected: CI/release checks and the affected Vercel server deployment report
success before the active plan is moved to completed.
