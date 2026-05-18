import { describe, it, expect } from 'bun:test'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const rootDir = join(import.meta.dir, '../../..')

describe('auth flow integration', () => {
  it('has auth package with server entry', () => {
    expect(existsSync(join(rootDir, 'packages/auth/src/index.ts'))).toBe(true)
  })

  it('has auth package with client entry', () => {
    expect(existsSync(join(rootDir, 'packages/auth/src/client.ts'))).toBe(true)
  })

  it('auth server exports auth instance', async () => {
    const content = await Bun.file(join(rootDir, 'packages/auth/src/index.ts')).text()
    expect(content).toMatch(/betterAuth|export const auth/)
  })

  it('auth package exports map includes server and client', async () => {
    const pkg = JSON.parse(await Bun.file(join(rootDir, 'packages/auth/package.json')).text()) as {
      exports: Record<string, string>
    }
    expect(pkg.exports['./server']).toBeDefined()
    expect(pkg.exports['./client']).toBeDefined()
  })
})
