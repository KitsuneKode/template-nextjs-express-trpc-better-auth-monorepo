import { describe, expect, it } from 'bun:test'
import { CAPABILITIES, packageManagerMenuOptions } from '../src/capabilities'
import { PUBLIC_PRESET_ROWS } from '../src/display'
import { PRESETS, PRESET_IDS } from '../src/presets'
import { PRESET_VERIFICATION_MATRIX, VERIFICATION_MATRIX_COLUMNS } from '../src/verification-matrix'

describe('@arche-template/registry', () => {
  it('defines every preset id in the verification matrix', () => {
    for (const id of PRESET_IDS) {
      expect(PRESET_VERIFICATION_MATRIX[id]).toBeDefined()
    }
  })

  it('includes convex-product in the preset catalog', () => {
    expect(PRESET_IDS).toContain('convex-product')
  })

  it('maps public preset rows from registry presets', () => {
    for (const row of PUBLIC_PRESET_ROWS) {
      const preset = PRESETS.find((candidate) => candidate.id === row.id)
      expect(preset).toBeDefined()
      expect(row.label).toBe(preset?.label)
      expect(row.status).toBe(preset?.status)
      expect(row.description).toBe(preset?.description)
      expect(row.capabilities).toEqual(preset?.capabilities)
    }
  })

  it('exposes verification columns for the marketing matrix', () => {
    expect(VERIFICATION_MATRIX_COLUMNS.some((column) => column.key === 'convexBackend')).toBe(true)
  })

  it('keeps Bun default and pnpm first-class', () => {
    expect(CAPABILITIES.packageManager.options.bun.status).toBe('stable')
    expect(packageManagerMenuOptions()[0]?.value).toBe('bun')
  })
})
