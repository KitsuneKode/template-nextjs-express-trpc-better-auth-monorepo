import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3001),
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  },
  clientPrefix: undefined,
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
