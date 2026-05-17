/**
 * Frontend environment variables for Next.js.
 * All public variables are prefixed with NEXT_PUBLIC_.
 *
 * This is auto-validated at build time and runtime by Next.js/t3-env.
 * Type-safe access: just import and use env.VARIABLE_NAME
 */

import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const clientEnv = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  clientPrefix: 'NEXT_PUBLIC_',
  runtimeEnvStrict: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  emptyStringAsUndefined: true,
})

export type ClientEnv = typeof clientEnv
