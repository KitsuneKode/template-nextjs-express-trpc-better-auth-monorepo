/**
 * Backend app environment (Express).
 * Extends shared server env with any server-specific variables.
 *
 * Usage in routes:
 * import { serverEnv } from '@template/backend-common/env'
 * const dbUrl = serverEnv.DATABASE_URL
 */

import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'
import { serverEnv as baseEnv } from '@template/backend-common/env'

export const serverEnv = createEnv({
  extends: [baseEnv],
  server: {
    // Add server-specific variables here
    // Example: LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: process.env.CI === 'true',
})

export type ServerEnv = typeof serverEnv
