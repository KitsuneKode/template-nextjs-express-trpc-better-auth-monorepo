import { describe, it, expect } from 'bun:test'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const rootDir = join(import.meta.dir, '../../..')

describe('server health', () => {
  it('has Express app entry point', () => {
    expect(existsSync(join(rootDir, 'apps/server/src/app.ts'))).toBe(true)
  })

  it('has server entry point', () => {
    expect(existsSync(join(rootDir, 'apps/server/src/server.ts'))).toBe(true)
  })

  it('has health endpoint in app.ts', async () => {
    const content = await Bun.file(join(rootDir, 'apps/server/src/app.ts')).text()
    expect(content).toContain('/health')
  })
})
