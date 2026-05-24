import { describe, expect, it } from 'bun:test'
import { buildRecipeReplayCommand } from '../src/recipe/replay'
import { RecipeSchema } from '../src/recipe/schema'

describe('recipe schema', () => {
  it('parses the intended rust-fullstack recipe shape before stability graduation', () => {
    const recipe = RecipeSchema.parse({
      version: 1,
      preset: 'rust-fullstack',
      support: 'requiresValidation',
      packageManager: 'bun',
      runtime: { web: 'node', api: 'rust' },
      workspace: { turbo: true, cargo: true },
      capabilities: {
        web: { framework: 'next' },
        api: { language: 'rust', framework: 'axum' },
        database: { engine: 'postgres', client: 'sqlx', owner: 'rust' },
        auth: { provider: 'clerk' },
        deployment: { target: 'vercel-render' },
      },
    })

    expect(recipe.preset).toBe('rust-fullstack')
    expect(recipe.workspace.cargo).toBe(true)
  })

  it('rejects npm as a first-class recipe package manager', () => {
    expect(() =>
      RecipeSchema.parse({
        version: 1,
        preset: 'typescript-fullstack',
        support: 'requiresValidation',
        packageManager: 'npm',
        runtime: { web: 'node' },
        workspace: { turbo: true, cargo: false },
        capabilities: {},
      }),
    ).toThrow()
  })
})

describe('recipe replay', () => {
  it('builds a replay command from a recipe', () => {
    const command = buildRecipeReplayCommand('acme', {
      version: 1,
      preset: 'rust-fullstack',
      support: 'requiresValidation',
      packageManager: 'bun',
      runtime: { web: 'node', api: 'rust' },
      workspace: { turbo: true, cargo: true },
      capabilities: {
        auth: { provider: 'clerk' },
        database: { engine: 'postgres', client: 'sqlx', owner: 'rust' },
        deployment: { target: 'vercel-render' },
      },
    })

    expect(command).toBe(
      'arche create acme --preset rust-fullstack --package-manager bun --web-runtime node --auth clerk --db postgres-sqlx --deploy vercel-render',
    )
  })
})
