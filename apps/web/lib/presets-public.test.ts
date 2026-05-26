import { describe, expect, it } from 'bun:test'

import { PRESETS } from '@arche-template/registry'
import { PUBLIC_PRESET_ROWS } from './presets-public'

describe('presets-public', () => {
  it('includes all non-entry CLI preset ids on the families page', () => {
    const registryById = new Map(PRESETS.map((preset) => [preset.id, preset]))
    const publicIds = new Set(PUBLIC_PRESET_ROWS.map((row) => row.id))

    for (const preset of PRESETS) {
      if (preset.id === 'customize' || preset.id === 'experiments') continue
      expect(publicIds.has(preset.id)).toBe(true)
      const row = PUBLIC_PRESET_ROWS.find((candidate) => candidate.id === preset.id)
      expect(row?.label).toBe(preset.label)
      expect(row?.status).toBe(preset.status)
      expect(row?.description).toBe(preset.description)
      expect(row?.capabilities).toEqual(registryById.get(preset.id)?.capabilities)
    }
  })

  it('includes convex-product for registry parity', () => {
    expect(PUBLIC_PRESET_ROWS.some((row) => row.id === 'convex-product')).toBe(true)
  })
})
