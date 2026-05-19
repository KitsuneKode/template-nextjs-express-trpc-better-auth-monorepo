/**
 * Backend (server, worker, CLI) environment variables.
 * Uses t3-env-core for runtime validation on Node.js.
 *
 * This schema is shared across:
 * - apps/server (Express API)
 * - apps/worker (Background jobs)
 * - apps/cli (Build/tooling)
 *
 * Each app can extend this schema with its own specific variables.
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

    // Redis / Cache
    REDIS_URL: z.string().url().default('redis://localhost:6379'),

    // Frontend reference
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),

    // Better Auth
    BETTER_AUTH_SECRET: z.string().min(32, 'Must be at least 32 characters for security'),
    BETTER_AUTH_URL: z.string().url(),

    // Optional: OAuth Providers
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  },
  clientPrefix: undefined,
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || !!process.env.VERCEL || !!process.env.RENDER,
})

export type ServerEnv = typeof serverEnv
