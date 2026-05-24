import { describe, expect, it } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createProject } from '../src/lib/create'
import type { ProjectConfig } from '../src/types/schemas'

function makeConfig(
  destinationDir: string,
  packageManager: ProjectConfig['packageManager'],
): ProjectConfig {
  return {
    projectName: `catalog-${packageManager}`,
    destinationDir,
    family: 'fullstack',
    bundles: [],
    packageManager,
    database: 'postgres',
    vectorDatabase: 'none',
    orm: 'prisma',
    backend: 'express-bun',
    runtime: 'bun',
    addons: [],
    example: 'none',
    testing: 'bun',
    deployment: 'none',
    includeShowcase: false,
    includeWorker: false,
    includeDocker: false,
    includeCi: false,
    initializeGit: false,
    installDependencies: false,
    presets: [],
    rustAuth: 'placeholder',
  }
}

async function createFullstack(packageManager: ProjectConfig['packageManager']) {
  const tmpRoot = mkdtempSync(join(tmpdir(), 'arche-workspace-output-'))
  const destinationDir = join(tmpRoot, packageManager)
  const result = await createProject({
    config: makeConfig(destinationDir, packageManager),
    dryRun: false,
  })
  expect(result.success).toBe(true)

  return { tmpRoot, destinationDir }
}

describe('fullstack workspace output', () => {
  it('emits Bun-native catalogs and canonical Turbo root commands', async () => {
    const { tmpRoot, destinationDir } = await createFullstack('bun')

    try {
      const root = JSON.parse(readFileSync(join(destinationDir, 'package.json'), 'utf8'))
      const web = JSON.parse(readFileSync(join(destinationDir, 'apps/web/package.json'), 'utf8'))

      expect(root.packageManager).toStartWith('bun@')
      expect(root.workspaces.packages).toContain('apps/*')
      expect(root.workspaces.catalog.typescript).toBe('^6.0.3')
      expect(root.workspaces.catalog.turbo).toBe('^2.9.14')
      expect(root.scripts['dev:web']).toStartWith('turbo run dev --filter=')
      expect(root.scripts['db:migrate']).toBe('turbo run db:migrate')
      expect(web.devDependencies.typescript).toBe('catalog:')
      expect(web.dependencies.zod).toBe('catalog:')
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true })
    }
  }, 60000)

  it('emits pnpm-native catalogs while keeping Bun runtime available', async () => {
    const { tmpRoot, destinationDir } = await createFullstack('pnpm')

    try {
      const root = JSON.parse(readFileSync(join(destinationDir, 'package.json'), 'utf8'))
      const web = JSON.parse(readFileSync(join(destinationDir, 'apps/web/package.json'), 'utf8'))
      const pnpmWorkspace = readFileSync(join(destinationDir, 'pnpm-workspace.yaml'), 'utf8')

      expect(root.packageManager).toStartWith('pnpm@')
      expect(root.workspaces).toBeUndefined()
      expect(root.scripts.preinstall).toBeUndefined()
      expect(root.engines.bun).toBeDefined()
      expect(pnpmWorkspace).toContain('catalog:')
      expect(pnpmWorkspace).toContain('  typescript:')
      expect(web.devDependencies.typescript).toBe('catalog:')
      expect(web.dependencies.zod).toBe('catalog:')
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true })
    }
  }, 60000)
})
