import { describe, expect, it } from 'bun:test'
import { renderGithubActionsWorkflow } from '../../../apps/cli/src/lib/generators/ci'
import { renderDockerCompose } from '../../../apps/cli/src/lib/generators/docker'
import { buildServerEnv } from '../../../apps/cli/src/lib/generators/env'
import { buildCleanupTargets, sanitizeProjectName, scaffoldProject } from '../../../apps/cli/src/lib/scaffold'
import { buildReadme } from '../../../apps/cli/src/lib/generators/readme'
import {
  buildRootAgentsMd,
  buildContextMd,
} from '../../../apps/cli/src/lib/generators/agent-docs'
import type { ProjectConfig } from '../../../apps/cli/src/types/schemas'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

function baseConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    projectName: 'test-app',
    destinationDir: '/tmp/test-app',
    family: 'ts-turbo',
    bundles: ['product'],
    packageManager: 'bun',
    database: 'postgres',
    vectorDatabase: 'none',
    orm: 'prisma',
    backend: 'express-bun',
    runtime: 'bun',
    addons: [],
    example: 'none',
    testing: 'bun',
    deployment: 'vercel-railway',
    includeShowcase: false,
    includeWorker: false,
    includeDocker: true,
    includeCi: true,
    initializeGit: false,
    installDependencies: false,
    presets: [],
    ...overrides,
  }
}

describe('project name sanitization', () => {
  it('sanitizes project names into package-safe slugs', () => {
    expect(sanitizeProjectName('My Cool App')).toBe('my-cool-app')
  })

  it('rejects empty input after sanitization', () => {
    expect(() => sanitizeProjectName('')).toThrow()
  })
})

describe('cleanup targets', () => {
  it('strips showcase and worker when opted out for ts-turbo', () => {
    expect(
      buildCleanupTargets({
        includeShowcase: false,
        includeWorker: false,
        testing: 'none',
        family: 'ts-turbo',
      }),
    ).toEqual(['readme', 'showcase', 'seed', 'worker', 'tests'])
  })

  it('does not strip worker for other families by default', () => {
    const targets = buildCleanupTargets({
      includeShowcase: false,
      includeWorker: false,
      testing: 'bun',
      family: 'next',
    })
    expect(targets).toContain('worker')
  })
})

describe('docker compose output', () => {
  it('renders docker compose with project-specific database naming', () => {
    const config = baseConfig({ projectName: 'my-cool-app' })
    expect(renderDockerCompose(config)).toContain('POSTGRES_DB: my_cool_app')
  })
})

describe('CI workflow', () => {
  it('adds a test step to CI only when tests are enabled', () => {
    expect(renderGithubActionsWorkflow(baseConfig({ testing: 'bun' }))).toContain('Run tests')
    expect(renderGithubActionsWorkflow(baseConfig({ testing: 'none' }))).not.toContain('Run tests')
  })
})

describe('server env', () => {
  it('renders a server env with local defaults', () => {
    const env = buildServerEnv(baseConfig({ projectName: 'demo-app' }))
    expect(env).toContain('DATABASE_URL=postgresql://postgres:postgres@localhost:5432/demo_app')
    expect(env).toContain('BETTER_AUTH_URL=http://localhost:8080')
  })
})

describe('family-aware readme', () => {
  it('includes ts-turbo stack details for ts-turbo family', () => {
    const readme = buildReadme(baseConfig())
    expect(readme).toContain('full-stack typescript monorepo')
    expect(readme).toContain('tRPC')
    expect(readme).toContain('Better Auth')
  })

  it('includes Next.js stack details for next family', () => {
    const readme = buildReadme(baseConfig({ family: 'next', presets: ['auth'] }))
    expect(readme).toContain('standalone next.js app')
    expect(readme).toContain('Next.js')
    expect(readme).toContain('Better Auth')
    expect(readme).not.toContain('tRPC')
    expect(readme).not.toContain('Turborepo')
  })
})

describe('family-aware agent docs', () => {
  it('includes ts-turbo key dirs for ts-turbo family', () => {
    const agents = buildRootAgentsMd(baseConfig())
    expect(agents).toContain('apps/web')
    expect(agents).toContain('packages/trpc')
    expect(agents).toContain('packages/store')
  })

  it('includes next-specific key dirs for next family', () => {
    const agents = buildRootAgentsMd(baseConfig({ family: 'next' }))
    expect(agents).toContain('components')
    expect(agents).not.toContain('apps/web')
    expect(agents).not.toContain('packages/trpc')
  })
})

describe('family-aware context', () => {
  it('includes ts-turbo architecture sections for ts-turbo family', () => {
    const ctx = buildContextMd(baseConfig())
    expect(ctx).toContain('tRPC')
    expect(ctx).toContain('Next.js')
  })

  it('includes next-specific architecture for next family', () => {
    const ctx = buildContextMd(baseConfig({ family: 'next' }))
    expect(ctx).toContain('Next.js')
    expect(ctx).not.toContain('tRPC')
  })

  it('includes backend-specific architecture for backend family', () => {
    const ctx = buildContextMd(baseConfig({ family: 'backend', backend: 'express-bun', database: 'postgres', orm: 'prisma' }))
    expect(ctx).toContain('API service')
    expect(ctx).toContain('express-bun')
    expect(ctx).not.toContain('Frontend')
  })

  it('includes convex architecture for convex family', () => {
    const ctx = buildContextMd(baseConfig({ family: 'convex' }))
    expect(ctx).toContain('Convex')
    expect(ctx).toContain('serverless')
    expect(ctx).toContain('Next.js')
  })
})

describe('scaffold smoke tests', () => {
  const smokeDir = '/tmp/opencode/test-scaffold-smoke'

  it('scaffolds a ts-turbo project and produces expected files', async () => {
    // Remove any leftover from previous runs
    try { Bun.spawnSync(['rm', '-rf', smokeDir]) } catch {}

    const result = await scaffoldProject(
      baseConfig({
        projectName: 'smoke-test',
        destinationDir: smokeDir,
        includeShowcase: true,
        includeWorker: true,
        includeDocker: true,
        includeCi: true,
        initializeGit: false,
        installDependencies: false,
      }),
    )

    expect(result.packageName).toBe('smoke-test')
    expect(existsSync(join(smokeDir, 'package.json'))).toBe(true)
    expect(existsSync(join(smokeDir, 'apps/server'))).toBe(true)
    expect(existsSync(join(smokeDir, 'apps/web'))).toBe(true)
    expect(existsSync(join(smokeDir, 'packages/trpc'))).toBe(true)
    expect(existsSync(join(smokeDir, 'docker-compose.yml'))).toBe(true)
    expect(existsSync(join(smokeDir, 'SHOWCASE.mdx'))).toBe(true)
  })
})
