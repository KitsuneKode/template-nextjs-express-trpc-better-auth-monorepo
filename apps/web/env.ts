/**
 * Frontend app environment (Next.js).
 * Extends shared client env with any web-specific variables.
 *
 * Usage in components:
 * import { env } from '@/env'
 * export const Component = () => env.NEXT_PUBLIC_APP_URL
 */

import { createEnv } from '@t3-oss/env-nextjs'
import { clientEnv } from '@template/common/env'
import { z } from 'zod'

export const env = createEnv({
  extends: [clientEnv],
  client: {
    NEXT_PUBLIC_SITE_NAME: z.string().default('My App'),
    NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_SITE_DESCRIPTION: z.string().default('Full-stack TypeScript application'),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || !!process.env.VERCEL,
})

export type Env = typeof env

export default env
