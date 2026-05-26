export type RenderTurboJsonOptions = {
  /** Include Prisma/db tasks (db:generate, db:migrate, db:seed). */
  includeDbTasks?: boolean
  /** Register root mdx:generate task (Fumadocs web). */
  includeMdxGenerate?: boolean
  /** Extra build output globs (e.g. target/** for Rust). */
  extraBuildOutputs?: string[]
}

const SCHEMA = 'https://turborepo.com/schema.json'

function buildOutputs(extra?: string[]): string[] {
  const outputs = ['dist/**', '.next/**', '!.next/cache/**']
  if (extra?.length) {
    for (const glob of extra) {
      if (!outputs.includes(glob)) outputs.push(glob)
    }
  }
  return outputs
}

export function renderTurboJson(options: RenderTurboJsonOptions = {}): string {
  const { includeDbTasks = true, includeMdxGenerate = false, extraBuildOutputs } = options

  const tasks: Record<string, Record<string, unknown>> = {
    transit: {
      dependsOn: ['^transit'],
    },
    build: {
      dependsOn: ['^build'],
      inputs: ['$TURBO_DEFAULT$', '.env*'],
      outputs: buildOutputs(extraBuildOutputs),
      env: ['DATABASE_URL'],
    },
    lint: {
      dependsOn: ['transit'],
    },
    'lint:fix': {
      dependsOn: ['transit'],
    },
    'check-types': {
      dependsOn: ['transit'],
      env: ['DATABASE_URL'],
    },
    dev: {
      cache: false,
      persistent: true,
    },
  }

  if (includeMdxGenerate) {
    tasks['mdx:generate'] = {
      outputs: ['.source/**'],
    }
  }

  if (includeDbTasks) {
    tasks['db:generate'] = { cache: false }
    tasks['db:migrate'] = { cache: false, persistent: true }
    tasks['db:seed'] = { persistent: true, cache: false }
  }

  const config = {
    $schema: SCHEMA,
    ui: 'tui',
    globalEnv: ['NODE_ENV', 'CI'],
    tasks,
  }

  return JSON.stringify(config, null, 2) + '\n'
}
