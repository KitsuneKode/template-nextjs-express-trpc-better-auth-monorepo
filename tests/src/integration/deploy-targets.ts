import { resolveDeployApiBaseUrl } from './deploy-fetch'

const DEFAULT_RENDER_API = 'https://arche-template-api.onrender.com'

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/$/, '')
}

/** Production API hosts to smoke-test (local / post-deploy). */
export function resolveDeploySmokeTargets(): string[] {
  const list = process.env.DEPLOY_SMOKE_TARGETS?.split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(normalizeBaseUrl)

  if (list && list.length > 0) {
    return [...new Set(list)]
  }

  const fromEnv = [
    process.env.RENDER_API_URL,
    process.env.VERCEL_API_URL,
    process.env.RAILWAY_API_URL,
    process.env.API_BASE_URL,
  ]
    .filter((v): v is string => Boolean(v?.trim()))
    .map(normalizeBaseUrl)

  if (fromEnv.length > 0) {
    return [...new Set(fromEnv)]
  }

  return [resolveDeployApiBaseUrl() || DEFAULT_RENDER_API]
}

export function isVercelAppHost(baseUrl: string): boolean {
  try {
    const host = new URL(baseUrl).hostname
    return host.endsWith('.vercel.app')
  } catch {
    return false
  }
}

export function vercelProtectionBypassConfigured(): boolean {
  return Boolean(process.env.VERCEL_PROTECTION_BYPASS?.trim())
}

export function shouldSkipVercelProtectedHost(baseUrl: string): boolean {
  return isVercelAppHost(baseUrl) && !vercelProtectionBypassConfigured()
}
