import { describe, expect, it } from 'bun:test'
import {
  buildCleanupTargets,
  buildServerEnvExample,
  renderDockerCompose,
  renderGithubActionsWorkflow,
  sanitizeProjectName,
} from '../../../apps/cli/src/lib/scaffold'

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
    expect(renderDockerCompose('my-cool-app')).toContain('POSTGRES_DB: my_cool_app')
  })

  it('adds a test step to CI only when tests are enabled', () => {
    expect(renderGithubActionsWorkflow({ includeTests: true })).toContain('Run tests')
    expect(renderGithubActionsWorkflow({ includeTests: false })).not.toContain('Run tests')
  })

  it('renders a server env example with local defaults', () => {
    const env = buildServerEnvExample('demo-app')
    expect(env).toContain('DATABASE_URL=postgresql://postgres:postgres@localhost:5432/demo_app')
    expect(env).toContain('BETTER_AUTH_URL=http://localhost:8080')
  })
})
