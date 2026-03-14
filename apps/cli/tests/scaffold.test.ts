import {
  sanitizeProjectName,
  buildCleanupTargets,
  renderDockerCompose,
  renderGithubActionsWorkflow,
  renderDeploymentGuide,
  buildServerEnvExample,
  buildWebEnvExample,
} from '../src/lib/scaffold'
import { describe, expect, it } from 'bun:test'

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
  it('generates valid docker-compose with project-specific database name', () => {
    const output = renderDockerCompose('my-app')
    expect(output).toContain('POSTGRES_DB: my_app')
    expect(output).toContain('postgres:16-alpine')
    expect(output).toContain('redis:7-alpine')
    expect(output).toContain('volumes:')
  })
})

describe('renderGithubActionsWorkflow', () => {
  it('includes test step when tests enabled', () => {
    const output = renderGithubActionsWorkflow({ includeTests: true })
    expect(output).toContain('Run tests')
    expect(output).toContain('bun test')
  })

  it('excludes test step when tests disabled', () => {
    const output = renderGithubActionsWorkflow({ includeTests: false })
    expect(output).not.toContain('Run tests')
    expect(output).not.toContain('bun test')
  })

  it('includes common CI steps', () => {
    const output = renderGithubActionsWorkflow({ includeTests: false })
    expect(output).toContain('Lint')
    expect(output).toContain('Typecheck')
    expect(output).toContain('bun install --frozen-lockfile')
  })
})

describe('renderDeploymentGuide', () => {
  it('mentions project name in output', () => {
    const output = renderDeploymentGuide({
      projectName: 'test-project',
      includeWorker: true,
      includeDocker: true,
    })
    expect(output).toContain('test-project')
  })

  it('includes worker deployment when enabled', () => {
    const output = renderDeploymentGuide({
      projectName: 'test',
      includeWorker: true,
      includeDocker: true,
    })
    expect(output).toContain('Deploy `apps/worker`')
  })

  it('notes worker not needed when disabled', () => {
    const output = renderDeploymentGuide({
      projectName: 'test',
      includeWorker: false,
      includeDocker: true,
    })
    expect(output).toContain('Worker deployment is not needed')
  })
})

describe('buildServerEnvExample', () => {
  it('includes project-specific database URL', () => {
    const output = buildServerEnvExample('my-app')
    expect(output).toContain('postgresql://postgres:postgres@localhost:5432/my_app')
  })

  it('includes required server env vars', () => {
    const output = buildServerEnvExample('test')
    expect(output).toContain('PORT=8080')
    expect(output).toContain('BETTER_AUTH_SECRET')
    expect(output).toContain('REDIS_URL')
  })
})

describe('buildWebEnvExample', () => {
  it('includes frontend URLs', () => {
    const output = buildWebEnvExample()
    expect(output).toContain('NEXT_PUBLIC_APP_URL')
    expect(output).toContain('NEXT_PUBLIC_API_URL')
  })
})
