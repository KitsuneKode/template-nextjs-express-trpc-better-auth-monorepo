import { sanitizeProjectName, buildCleanupTargets } from '../src/lib/scaffold'
import { renderDeploymentGuide } from '../src/lib/generators/deployment'
import { buildServerEnv, buildWebEnv } from '../src/lib/generators/env'
import { renderGithubActionsWorkflow } from '../src/lib/generators/ci'
import { renderDockerCompose } from '../src/lib/generators/docker'
import type { ProjectConfig } from '../src/types/schemas'
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

describe('sanitizeProjectName', () => {
  it('converts to lowercase slug', () => {
    expect(sanitizeProjectName('My Project')).toBe('my-project')
    expect(sanitizeProjectName('UPPER')).toBe('upper')
  })

  it('replaces spaces and special chars with dashes', () => {
    expect(sanitizeProjectName('hello world')).toBe('hello-world')
    expect(sanitizeProjectName('hello_world')).toBe('hello-world')
    expect(sanitizeProjectName('hello.world')).toBe('hello-world')
  })

  it('removes leading/trailing dashes', () => {
    expect(sanitizeProjectName('--test--')).toBe('test')
    expect(sanitizeProjectName('-leading')).toBe('leading')
    expect(sanitizeProjectName('trailing-')).toBe('trailing')
  })

  it('handles paths by extracting basename', () => {
    expect(sanitizeProjectName('/path/to/my-project')).toBe('my-project')
    expect(sanitizeProjectName('./relative/path/cool_app')).toBe('cool-app')
  })

  it('throws for empty or invalid names', () => {
    expect(() => sanitizeProjectName('')).toThrow()
    expect(() => sanitizeProjectName('---')).toThrow()
    expect(() => sanitizeProjectName('...')).toThrow()
  })
})

describe('buildCleanupTargets', () => {
  it('always includes readme', () => {
    const targets = buildCleanupTargets({
      includeShowcase: true,
      includeWorker: true,
      testing: 'bun',
    })
    expect(targets).toContain('readme')
  })

  it('excludes showcase and seed when showcase disabled', () => {
    const targets = buildCleanupTargets({
      includeShowcase: false,
      includeWorker: true,
      testing: 'bun',
    })
    expect(targets).toContain('showcase')
    expect(targets).toContain('seed')
  })

  it('excludes worker when disabled', () => {
    const targets = buildCleanupTargets({
      includeShowcase: true,
      includeWorker: false,
      testing: 'bun',
    })
    expect(targets).toContain('worker')
  })

  it('excludes tests when testing is none', () => {
    const targets = buildCleanupTargets({
      includeShowcase: true,
      includeWorker: true,
      testing: 'none',
    })
    expect(targets).toContain('tests')
  })
})

describe('renderDockerCompose', () => {
  it('generates postgres + redis for postgres database', () => {
    const output = renderDockerCompose(makeConfig({ projectName: 'my-app', database: 'postgres' }))
    expect(output).toContain('POSTGRES_DB: my_app')
    expect(output).toContain('postgres:16-alpine')
    expect(output).toContain('redis:7-alpine')
    expect(output).toContain('volumes:')
  })

  it('generates mongo + redis for mongodb database', () => {
    const output = renderDockerCompose(makeConfig({ database: 'mongodb' }))
    expect(output).toContain('mongo:7')
    expect(output).toContain('redis:7-alpine')
    expect(output).not.toContain('postgres')
  })

  it('generates redis only for sqlite database', () => {
    const output = renderDockerCompose(makeConfig({ database: 'sqlite' }))
    expect(output).toContain('redis:7-alpine')
    expect(output).not.toContain('postgres')
    expect(output).not.toContain('mongo')
  })

  it('generates no services for frontend-only with no database', () => {
    const output = renderDockerCompose(makeConfig({ database: 'none', backend: 'none' }))
    expect(output).toContain('No Docker services needed')
  })
})

describe('renderGithubActionsWorkflow', () => {
  it('includes test step when tests enabled', () => {
    const output = renderGithubActionsWorkflow(makeConfig({ testing: 'bun' }))
    expect(output).toContain('Run tests')
    expect(output).toContain('bun test')
  })

  it('excludes test step when tests disabled', () => {
    const output = renderGithubActionsWorkflow(makeConfig({ testing: 'none' }))
    expect(output).not.toContain('Run tests')
    expect(output).not.toContain('bun test')
  })

  it('includes common CI steps', () => {
    const output = renderGithubActionsWorkflow(makeConfig({ testing: 'none' }))
    expect(output).toContain('Lint')
    expect(output).toContain('Typecheck')
    expect(output).toContain('bun install --frozen-lockfile')
  })
})

describe('renderDeploymentGuide', () => {
  it('mentions project name in output', () => {
    const output = renderDeploymentGuide(makeConfig({ projectName: 'test-project' }))
    expect(output).toContain('test-project')
  })

  it('includes worker deployment when enabled', () => {
    const output = renderDeploymentGuide(makeConfig({ includeWorker: true }))
    expect(output).toContain('Deploy `apps/worker`')
  })

  it('notes worker not needed when disabled', () => {
    const output = renderDeploymentGuide(makeConfig({ includeWorker: false }))
    expect(output).toContain('Worker deployment is not needed')
  })

  it('adapts to backend selection', () => {
    const express = renderDeploymentGuide(makeConfig({ backend: 'express-bun' }))
    expect(express).toContain('Express (Bun)')

    const hono = renderDeploymentGuide(makeConfig({ backend: 'hono-bun' }))
    expect(hono).toContain('Hono (Bun)')

    const none = renderDeploymentGuide(makeConfig({ backend: 'none' }))
    expect(none).toContain('No backend server to deploy')
  })
})

describe('buildServerEnv', () => {
  it('includes project-specific postgres DATABASE_URL', () => {
    const output = buildServerEnv(makeConfig({ projectName: 'my-app', database: 'postgres' }))
    expect(output).toContain('postgresql://postgres:postgres@localhost:5432/my_app')
  })

  it('includes sqlite DATABASE_URL for sqlite', () => {
    const output = buildServerEnv(makeConfig({ database: 'sqlite' }))
    expect(output).toContain('DATABASE_URL=file:./dev.db')
  })

  it('includes mongodb DATABASE_URL for mongodb', () => {
    const output = buildServerEnv(makeConfig({ database: 'mongodb' }))
    expect(output).toContain('mongodb://')
  })

  it('omits DATABASE_URL when no database', () => {
    const output = buildServerEnv(makeConfig({ database: 'none' }))
    expect(output).not.toContain('DATABASE_URL')
  })

  it('includes required server env vars', () => {
    const output = buildServerEnv(makeConfig())
    expect(output).toContain('PORT=8080')
    expect(output).toContain('BETTER_AUTH_SECRET')
    expect(output).toContain('REDIS_URL')
  })
})

describe('buildWebEnv', () => {
  it('includes frontend URLs', () => {
    const output = buildWebEnv()
    expect(output).toContain('NEXT_PUBLIC_APP_URL')
    expect(output).toContain('NEXT_PUBLIC_API_URL')
  })
})
