/**
 * Environment validation and startup checks
 *
 * Validates all required environment variables on application startup.
 * Fails fast with clear error messages if configuration is invalid.
 */

export function validateEnvironment(env: 'server' | 'worker' | 'web'): void {
  const errors: string[] = []

  // Common required vars for all backend services
  if (env === 'server' || env === 'worker') {
    const required = ['BETTER_AUTH_SECRET', 'REDIS_URL']
    for (const key of required) {
      if (!process.env[key]) {
        errors.push(`Missing required: ${key}`)
      }
    }

    if (process.env.DATABASE_URL === undefined && process.env.DATABASE_URL === null) {
      // DATABASE_URL can be empty for database=none, but should be explicitly set or omitted
      // This is actually OK — just document it
    }

    // OAuth is optional, but if one is set, both should be
    const hasGitHub =
      Boolean(process.env.GITHUB_CLIENT_ID) || Boolean(process.env.GITHUB_CLIENT_SECRET)
    if (hasGitHub) {
      if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        errors.push('Both GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set together')
      }
    }

    const hasGoogle =
      Boolean(process.env.GOOGLE_CLIENT_ID) || Boolean(process.env.GOOGLE_CLIENT_SECRET)
    if (hasGoogle) {
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        errors.push('Both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set together')
      }
    }
  }

  // Server-specific
  if (env === 'server') {
    if (!process.env.FRONTEND_URL) {
      errors.push('Missing required: FRONTEND_URL')
    }
    if (!process.env.BETTER_AUTH_URL) {
      errors.push('Missing required: BETTER_AUTH_URL')
    }
  }

  // Web-specific
  if (env === 'web') {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      errors.push('Missing required: NEXT_PUBLIC_API_URL')
    }
  }

  if (errors.length > 0) {
    console.error('❌ Environment validation failed:')
    errors.forEach((e) => console.error(`   - ${e}`))
    console.error('')
    console.error('📋 Check your .env file and ensure all required variables are set.')
    process.exit(1)
  }
}
