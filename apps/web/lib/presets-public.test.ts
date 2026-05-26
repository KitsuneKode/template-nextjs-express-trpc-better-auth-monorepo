import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { PUBLIC_PRESET_ROWS } from './presets-public'

const cliPresetsPath = join(import.meta.dir, '../../cli/src/registry/presets.ts')

describe('presets-public', () => {
  it('includes all non-entry CLI preset ids on the families page', () => {
    const cliSource = readFileSync(cliPresetsPath, 'utf8')
    const cliIds = [...cliSource.matchAll(/id: '([^']+)'/g)].map((m) => m[1])
    const publicIds = new Set(PUBLIC_PRESET_ROWS.map((row) => row.id))

    for (const id of cliIds) {
      if (id === 'customize' || id === 'experiments') continue
      expect(publicIds.has(id)).toBe(true)
    }
  })

  it('includes solana-program for registry parity', () => {
    expect(PUBLIC_PRESET_ROWS.some((row) => row.id === 'solana-program')).toBe(true)
  })
})
