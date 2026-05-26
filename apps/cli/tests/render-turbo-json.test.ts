import { describe, expect, it } from 'bun:test'
import { renderTurboJson } from '../src/render/turbo/render-turbo-json'

describe('renderTurboJson', () => {
  it('includes transit nodes and db tasks by default', () => {
    const turbo = JSON.parse(renderTurboJson()) as {
      tasks: Record<string, { dependsOn?: string[] }>
    }

    expect(turbo.tasks.transit.dependsOn).toEqual(['^transit'])
    expect(turbo.tasks.lint.dependsOn).toEqual(['transit'])
    expect(turbo.tasks['lint:fix'].dependsOn).toEqual(['transit'])
    expect(turbo.tasks['check-types'].dependsOn).toEqual(['transit'])
    expect(turbo.tasks['db:generate']).toBeDefined()
    expect(turbo.tasks['mdx:generate']).toBeUndefined()
  })

  it('omits db tasks and adds mdx when requested', () => {
    const turbo = JSON.parse(
      renderTurboJson({ includeDbTasks: false, includeMdxGenerate: true }),
    ) as { tasks: Record<string, unknown> }

    expect(turbo.tasks['db:generate']).toBeUndefined()
    expect(turbo.tasks['mdx:generate']).toEqual({ outputs: ['.source/**'] })
  })

  it('merges extra build outputs', () => {
    const turbo = JSON.parse(renderTurboJson({ extraBuildOutputs: ['target/**'] })) as {
      tasks: { build: { outputs: string[] } }
    }

    expect(turbo.tasks.build.outputs).toContain('target/**')
    expect(turbo.tasks.build.outputs).toContain('dist/**')
  })
})
