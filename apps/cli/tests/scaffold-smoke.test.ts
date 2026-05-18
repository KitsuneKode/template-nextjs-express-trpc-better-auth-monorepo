import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync, rmSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createProject } from '../src/lib/create'
import type { Family, PackageManager, ProjectConfig } from '../src/types/schemas'

function makeConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    projectName: 'smoke-app',
    destinationDir: '/tmp/smoke-app',
    family: 'fullstack',
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

const MATRIX: Array<{
  family: Family
  pm: PackageManager
  bundles?: ProjectConfig['bundles']
  backend?: ProjectConfig['backend']
  database?: ProjectConfig['database']
  orm?: ProjectConfig['orm']
  includeWorker?: boolean
  includeShowcase?: boolean
}> = [
  {
    family: 'fullstack',
    pm: 'bun',
    bundles: ['product', 'realtime', 'ai'],
    includeWorker: true,
    includeShowcase: true,
  },
  {
    family: 'next',
    pm: 'pnpm',
    bundles: ['product', 'growth'],
    backend: 'none',
    database: 'none',
    orm: 'none',
  },
  { family: 'backend', pm: 'npm', bundles: ['product', 'infra'], includeWorker: false },
  {
    family: 'lib',
    pm: 'bun',
    bundles: ['product'],
    backend: 'none',
    database: 'none',
    orm: 'none',
  },
  {
    family: 'worker',
    pm: 'pnpm',
    bundles: ['product'],
    backend: 'none',
    database: 'none',
    orm: 'none',
  },
]

describe('scaffold smoke matrix', () => {
  for (const entry of MATRIX) {
    it(`scaffolds ${entry.family} with ${entry.pm}`, async () => {
      const tmpRoot = mkdtempSync(join(tmpdir(), 'arche-scaffold-smoke-'))
      const destinationDir = join(tmpRoot, `${entry.family}-${entry.pm}`)
      try {
        const result = await createProject({
          config: makeConfig({
            destinationDir,
            projectName: `${entry.family}-${entry.pm}`,
            family: entry.family,
            packageManager: entry.pm,
            bundles: entry.bundles ?? ['product'],
            backend: entry.backend ?? 'express-bun',
            database: entry.database ?? 'postgres',
            orm: entry.orm ?? 'prisma',
            includeWorker: entry.includeWorker ?? false,
            includeShowcase: entry.includeShowcase ?? false,
          }),
          dryRun: false,
        })

        if (!result.success) {
          throw new Error(`createProject failed: ${result.errors.join('; ')}`)
        }
        expect(result.result).toBeDefined()
        expect(existsSync(join(destinationDir, 'package.json'))).toBe(true)
        expect(existsSync(join(destinationDir, 'README.md'))).toBe(true)
        expect(existsSync(join(destinationDir, 'arche.json'))).toBe(true)

        const arche = JSON.parse(readFileSync(join(destinationDir, 'arche.json'), 'utf8'))
        expect(arche.family).toBe(entry.family)
        expect(arche.packageManager).toBe(entry.pm)

        if (entry.family === 'fullstack') {
          expect(existsSync(join(destinationDir, '.opencode/skills.json'))).toBe(true)
          expect(existsSync(join(destinationDir, '.cursor/rules/project.mdc'))).toBe(true)
        }

        if (entry.family === 'next') {
          expect(existsSync(join(destinationDir, 'app/layout.tsx'))).toBe(true)
          expect(existsSync(join(destinationDir, 'apps/server'))).toBe(false)
        }

        if (entry.family === 'backend') {
          expect(existsSync(join(destinationDir, 'src/app.ts'))).toBe(true)
          expect(existsSync(join(destinationDir, 'src/server.ts'))).toBe(true)
          expect(existsSync(join(destinationDir, 'package.json'))).toBe(true)
        }
      } finally {
        rmSync(tmpRoot, { recursive: true, force: true })
      }
    }, 60000)
  }
})
