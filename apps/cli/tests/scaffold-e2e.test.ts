import { describe, expect, it } from 'bun:test'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createProject } from '../src/lib/create'
import type { ProjectConfig } from '../src/types/schemas'

const runE2e = process.env.SCAFFOLD_E2E === '1'

const e2eDescribe = runE2e ? describe : describe.skip

e2eDescribe('scaffold e2e', () => {
  it('scaffolds fullstack and builds', async () => {
    const tmpRoot = mkdtempSync(join(tmpdir(), 'arche-e2e-'))
    const destinationDir = join(tmpRoot, 'e2e-app')
    try {
      const config: ProjectConfig = {
        projectName: 'e2e-app',
        destinationDir,
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
        testing: 'none',
        deployment: 'none',
        includeShowcase: false,
        includeWorker: false,
        includeDocker: false,
        includeCi: false,
        initializeGit: false,
        installDependencies: false,
        presets: [],
      }

      const result = await createProject({ config, dryRun: false })
      expect(result.success).toBe(true)
      expect(existsSync(join(destinationDir, 'arche.json'))).toBe(true)
      expect(existsSync(join(destinationDir, 'apps/server/.env'))).toBe(true)

      const proc = Bun.spawn(['bun', 'install'], {
        cwd: destinationDir,
        stdout: 'pipe',
        stderr: 'pipe',
      })
      const installCode = await proc.exited
      expect(installCode).toBe(0)

      const buildProc = Bun.spawn(['bun', 'run', 'build'], {
        cwd: destinationDir,
        stdout: 'pipe',
        stderr: 'pipe',
      })
      const buildCode = await buildProc.exited
      if (buildCode !== 0) {
        const err = await new Response(buildProc.stderr).text()
        console.error(err)
      }
      expect(buildCode).toBe(0)
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true })
    }
  }, 300_000)
})
