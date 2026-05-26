/**
 * Frontend app environment (Next.js).
 * Extends shared client env with any web-specific variables.
 *
 * Usage in components:
 * import { env } from '@/env'
 * export const Component = () => env.NEXT_PUBLIC_APP_URL
 */

import { clientEnv } from '@arche-template/common/env'
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/** Dashboard typos like the literal string "undefined" must not reach `new URL()`. */
function sanitizePublicEnv(value: string | undefined): string | undefined {
  if (value === undefined || value === '') return undefined
  const trimmed = value.trim()
  if (trimmed === 'undefined' || trimmed === 'null') return undefined
  return trimmed
}

function vercelDeploymentOrigin(): string | undefined {
  const host = sanitizePublicEnv(process.env.VERCEL_URL)
  return host ? `https://${host}` : undefined
}

const vercelOrigin = vercelDeploymentOrigin()

const publicSiteUrl =
  sanitizePublicEnv(process.env.NEXT_PUBLIC_SITE_URL) ??
  sanitizePublicEnv(process.env.NEXT_PUBLIC_APP_URL) ??
  vercelOrigin

const publicAppUrl = sanitizePublicEnv(process.env.NEXT_PUBLIC_APP_URL) ?? vercelOrigin

export const env = createEnv({
  extends: [clientEnv],
  client: {
    NEXT_PUBLIC_SITE_NAME: z.string().default('Arche'),
    NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_SITE_DESCRIPTION: z
      .string()
      .default(
        'Personal project origin system — TypeScript, Rust, and Solana scaffolds with agent-readable context.',
      ),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_URL: publicSiteUrl,
    NEXT_PUBLIC_SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    NEXT_PUBLIC_APP_URL: publicAppUrl,
    NEXT_PUBLIC_API_URL: sanitizePublicEnv(process.env.NEXT_PUBLIC_API_URL),
  },
  emptyStringAsUndefined: true,
  // CI may build packages without full web env; Vercel must validate (defaults + fallbacks above).
  skipValidation: !!process.env.CI,
})

export type Env = typeof env

export default env
