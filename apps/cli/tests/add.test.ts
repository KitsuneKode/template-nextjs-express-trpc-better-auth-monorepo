import { describe, expect, it } from 'bun:test'
import { existsSync, lstatSync, mkdtempSync, readlinkSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { addFeature } from '../src/lib/add'

describe('add agent-docs', () => {
  it('adds canonical agent context without duplicate instruction files', async () => {
    const destinationDir = mkdtempSync(join(tmpdir(), 'arche-add-agent-docs-'))

    try {
      const result = await addFeature({ feature: 'agent-docs', destinationDir })

      expect(result.success).toBe(true)
      expect(existsSync(join(destinationDir, 'AGENTS.md'))).toBe(true)
      expect(lstatSync(join(destinationDir, 'CLAUDE.md')).isSymbolicLink()).toBe(true)
      expect(readlinkSync(join(destinationDir, 'CLAUDE.md'))).toBe('AGENTS.md')
      expect(existsSync(join(destinationDir, 'CONTEXT.md'))).toBe(false)
      expect(existsSync(join(destinationDir, '.docs/README.md'))).toBe(true)
      expect(existsSync(join(destinationDir, '.docs/architecture/generated-project.md'))).toBe(true)
      expect(existsSync(join(destinationDir, '.plans/README.md'))).toBe(true)
    } finally {
      rmSync(destinationDir, { recursive: true, force: true })
    }
  })
})
