/**
 * Backend generator
 *
 * Post-scaffold transformations for non-default backends.
 * The template ships with express-bun as the default. When a different
 * backend is selected, this generator rewrites the relevant files.
 */

import { readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import type { ProjectConfig } from '../../types/schemas'
import { join, dirname } from 'node:path'

// =============================================================================
// Hono on Bun
// =============================================================================

function honoAppTs(): string {
  return `import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from '@template/auth/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter, createTRPCContext } from '@template/trpc'
import { config } from './utils/config'

const app = new Hono()

// CORS
app.use(
  '*',
  cors({
    origin: config.getConfig('frontendUrl'),
    credentials: true,
  }),
)

// Better Auth (fetch handler)
app.all('/api/auth/*', (c) => auth.handler(c.req.raw))

// tRPC (fetch adapter)
app.use('/api/trpc/*', async (c) => {
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () =>
      createTRPCContext({ headers: c.req.raw.headers }),
  })
  return response
})

// Health check
app.get('/health', (c) => c.json({ status: 'OK' }))

// 404 catch-all
app.all('*', (c) => c.json({ error: 'Not found' }, 404))

export { app }
`
}

function honoServerTs(): string {
  return `import { config } from './utils/config'
import { logger } from './utils/logger'
import { app } from './app'

// Validate all required environment variables on startup
config.validateAll()

const port = config.getConfig('port')

const server = Bun.serve({
  port,
  fetch: app.fetch,
  idleTimeout: 30,
})

logger.info(\`Server listening on http://localhost:\${server.port}\`)

// Graceful shutdown
const shutdown = () => {
  logger.info('Shutting down...')
  server.stop()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
`
}

function honoPackageJsonPatch(): {
  addDeps: Record<string, string>
  removeDeps: string[]
  removeDevDeps: string[]
  scriptOverrides: Record<string, string>
} {
  return {
    addDeps: {
      hono: '^4.7.0',
    },
    removeDeps: ['express', 'cors'],
    removeDevDeps: ['@types/express', '@types/cors'],
    scriptOverrides: {
      dev: 'bun run --watch src/server.ts',
      build: 'bun build ./src/server.ts --outdir ./dist --target bun --minify --sourcemap',
      start: 'bun run dist/server.js',
    },
  }
}

// =============================================================================
// tRPC adapter swap
// =============================================================================

/** Rewrite packages/trpc/src/trpc.ts for fetch-based context */
function trpcContextFetch(): string {
  return `import { initTRPC, TRPCError } from '@trpc/server'
import { auth, fromNodeHeaders } from '@template/auth/server'
import { prisma as db } from '@template/store'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { logger } from '@template/backend-common/logger'

/**
 * tRPC context for fetch-based backends (Hono, etc.)
 * Accepts web-standard Headers instead of Express req/res.
 */
export const createTRPCContext = async ({ headers }: { headers: Headers }) => {
  const session = await auth.api.getSession({ headers })
  return { session, db }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory

/**
 * Timing middleware — logs slow procedures, adds artificial delay in dev.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()

  if (process.env.NODE_ENV === 'development') {
    const delay = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  const result = await next()
  const elapsed = Date.now() - start

  if (elapsed > 1000) {
    logger.warn(\`Slow tRPC procedure: \${path} took \${elapsed}ms\`)
  }

  return result
})

/** Public procedure — no auth required */
export const publicProcedure = t.procedure.use(timingMiddleware)

/** Protected procedure — requires authenticated session */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })
`
}

/** Rewrite packages/trpc/src/index.ts for fetch-based adapter */
function trpcIndexFetch(): string {
  return `export { appRouter, type AppRouter } from './routers/_app'
export type { RouterInputs, RouterOutputs } from './routers/_app'
export { createTRPCContext, createCallerFactory } from './trpc'

import { appRouter } from './routers/_app'
import { createCallerFactory } from './trpc'

export const createCaller = createCallerFactory(appRouter)
`
}

// =============================================================================
// Public API
// =============================================================================

async function writeFile_(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content)
}

async function patchPackageJson(
  packageJsonPath: string,
  patch: ReturnType<typeof honoPackageJsonPatch>,
): Promise<void> {
  const raw = await readFile(packageJsonPath, 'utf8')
  const pkg = JSON.parse(raw) as Record<string, unknown>

  // Patch dependencies
  const deps = (pkg.dependencies ?? {}) as Record<string, string>
  for (const name of patch.removeDeps) delete deps[name]
  Object.assign(deps, patch.addDeps)
  pkg.dependencies = deps

  // Patch devDependencies
  const devDeps = (pkg.devDependencies ?? {}) as Record<string, string>
  for (const name of patch.removeDevDeps) delete devDeps[name]
  pkg.devDependencies = devDeps

  // Patch scripts
  const scripts = (pkg.scripts ?? {}) as Record<string, string>
  Object.assign(scripts, patch.scriptOverrides)
  pkg.scripts = scripts

  await writeFile(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n')
}

/**
 * Apply backend-specific transformations to the scaffolded project.
 * Called after template copy and cleanup, before env/docker/ci generation.
 */
export async function applyBackendTransform(
  destinationDir: string,
  config: ProjectConfig,
): Promise<void> {
  if (config.backend === 'express-bun') return // default, no transformation needed

  if (config.backend === 'hono-bun') {
    // 1. Rewrite server app files
    await writeFile_(join(destinationDir, 'apps/server/src/app.ts'), honoAppTs())
    await writeFile_(join(destinationDir, 'apps/server/src/server.ts'), honoServerTs())

    // 2. Remove Express middleware files (not applicable to Hono)
    await rm(join(destinationDir, 'apps/server/src/middlewares'), {
      recursive: true,
      force: true,
    })

    // 3. Patch server package.json
    await patchPackageJson(join(destinationDir, 'apps/server/package.json'), honoPackageJsonPatch())

    // 4. Rewrite tRPC package for fetch-based context
    await writeFile_(join(destinationDir, 'packages/trpc/src/trpc.ts'), trpcContextFetch())
    await writeFile_(join(destinationDir, 'packages/trpc/src/index.ts'), trpcIndexFetch())

    return
  }

  // Future backends: go-fiber, rust-axum, python-fastapi, fastify-node
  // These would be implemented similarly with their own templates.
}
