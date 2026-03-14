import { buildCleanupTargets, sanitizeProjectName } from '../../../apps/cli/src/lib/scaffold'
import { renderGithubActionsWorkflow } from '../../../apps/cli/src/lib/generators/ci'
import { renderDockerCompose } from '../../../apps/cli/src/lib/generators/docker'
import { buildServerEnv } from '../../../apps/cli/src/lib/generators/env'
import type { ProjectConfig } from '../../../apps/cli/src/types/schemas'
import { describe, expect, it } from 'bun:test'

/** Helper to build a minimal ProjectConfig for testing generators */
function makeConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    projectName: 'test-app',
    destinationDir: '/tmp/test-app',
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
    initializeGit: true,
    installDependencies: true,
    ...overrides,
  }
}

describe('create-kitsu-stack helpers', () => {
  it('sanitizes project names into package-safe slugs', () => {
    expect(sanitizeProjectName('My Cool App')).toBe('my-cool-app')
  })

  it('builds cleanup targets for the start-fresh default path', () => {
    expect(
      buildCleanupTargets({
        includeShowcase: false,
        includeWorker: false,
        testing: 'none',
      }),
    ).toEqual(['readme', 'showcase', 'seed', 'worker', 'tests'])
  })

  it('renders docker compose with project-specific database naming', () => {
    expect(renderDockerCompose(makeConfig({ projectName: 'my-cool-app' }))).toContain(
      'POSTGRES_DB: my_cool_app',
    )
  })

  it('adds a test step to CI only when tests are enabled', () => {
    expect(renderGithubActionsWorkflow(makeConfig({ testing: 'bun' }))).toContain('Run tests')
    expect(renderGithubActionsWorkflow(makeConfig({ testing: 'none' }))).not.toContain('Run tests')
  })

  it('renders a server env with local defaults', () => {
    const env = buildServerEnv(makeConfig({ projectName: 'demo-app' }))
    expect(env).toContain('DATABASE_URL=postgresql://postgres:postgres@localhost:5432/demo_app')
    expect(env).toContain('BETTER_AUTH_URL=http://localhost:8080')
  })
})
