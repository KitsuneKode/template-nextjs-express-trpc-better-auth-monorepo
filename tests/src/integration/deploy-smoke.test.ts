import { describe, expect, it } from 'bun:test'
import { fetchJson } from './deploy-fetch'
import { resolveDeploySmokeTargets, shouldSkipVercelProtectedHost } from './deploy-targets'

const runDeploySmoke =
  process.env.RUN_DEPLOY_SMOKE === '1' || process.env.RUN_DEPLOY_SMOKE === 'true'
const deployDescribe = runDeploySmoke ? describe : describe.skip

type RootPayload = {
  status: string
  redis: string
  links?: { health?: string }
}

type HealthPayload = {
  status: string
  database: string
}

deployDescribe('deploy smoke (live APIs)', () => {
  const targets = resolveDeploySmokeTargets()

  for (const baseUrl of targets) {
    const label = new URL(baseUrl).hostname

    describe(label, () => {
      it(`GET ${baseUrl}/ — service metadata`, async () => {
        if (shouldSkipVercelProtectedHost(baseUrl)) {
          console.warn(
            `[skip] ${label}: Vercel deployment protection — set VERCEL_PROTECTION_BYPASS or use a production alias URL`,
          )
          return
        }

        const { status, body } = await fetchJson<RootPayload>(`${baseUrl}/`)
        expect(status).toBe(200)
        expect(body.status).toBe('ok')
        expect(body.redis).toBe('disabled')
        expect(body.links?.health).toBe('/health')
      })

      it(`GET ${baseUrl}/health — database reachable`, async () => {
        if (shouldSkipVercelProtectedHost(baseUrl)) {
          console.warn(`[skip] ${label}: health check skipped (Vercel protection)`)
          return
        }

        const { status, body } = await fetchJson<HealthPayload>(`${baseUrl}/health`)
        expect(status).toBe(200)
        expect(body.status).toBe('OK')
        expect(body.database).toBe('connected')
      })
    })
  }
})
