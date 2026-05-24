import { describe, expect, it } from 'bun:test'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createProject } from '../src/lib/create'
import { projectDefaultsForPreset } from '../src/registry/preset-config'
import type { ProjectConfig } from '../src/types/schemas'

function configFromPreset(destinationDir: string): ProjectConfig {
  return {
    projectName: 'rust-fullstack',
    destinationDir,
    family: 'fullstack',
    bundles: [],
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
    rustAuth: 'placeholder',
    ...projectDefaultsForPreset('rust-fullstack'),
  }
}

describe('preset scaffold output', () => {
  it('scaffolds rust-fullstack as a web app plus services/api Rust workspace', async () => {
    const tmpRoot = mkdtempSync(join(tmpdir(), 'arche-rust-fullstack-'))
    const destinationDir = join(tmpRoot, 'app')

    try {
      const result = await createProject({
        config: configFromPreset(destinationDir),
        dryRun: false,
      })
      expect(result.success).toBe(true)

      expect(existsSync(join(destinationDir, 'apps/web'))).toBe(true)
      expect(existsSync(join(destinationDir, 'apps/server'))).toBe(false)
      expect(existsSync(join(destinationDir, 'Cargo.toml'))).toBe(true)
      expect(existsSync(join(destinationDir, 'services/api/Cargo.toml'))).toBe(true)
      expect(existsSync(join(destinationDir, 'services/api/src/main.rs'))).toBe(true)

      const cargoWorkspace = readFileSync(join(destinationDir, 'Cargo.toml'), 'utf8')
      expect(cargoWorkspace).toContain('[workspace]')
      expect(cargoWorkspace).toContain('"services/api"')

      const rootPackage = JSON.parse(readFileSync(join(destinationDir, 'package.json'), 'utf8'))
      expect(rootPackage.packageManager).toStartWith('bun@')
      expect(rootPackage.workspaces.packages).toContain('services/*')

      const apiCargo = readFileSync(join(destinationDir, 'services/api/Cargo.toml'), 'utf8')
      expect(apiCargo).toContain('axum = "0.8"')
      expect(apiCargo).toContain('sqlx =')

      const architecture = readFileSync(
        join(destinationDir, '.docs/architecture/generated-project.md'),
        'utf8',
      )
      expect(architecture).toContain('services/api')
      expect(architecture).not.toContain('apps/server/src/app.ts')
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true })
    }
  }, 60000)
})
