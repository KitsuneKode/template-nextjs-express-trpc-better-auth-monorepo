import { describe, expect, it } from 'bun:test'
import { PRESETS } from '../src/registry/presets'
import {
  PRESET_VERIFICATION_MATRIX,
  presetHasStableEvidence,
} from '../src/registry/verification-matrix'

describe('preset verification matrix', () => {
  it('has an evidence row for every preset', () => {
    expect(Object.keys(PRESET_VERIFICATION_MATRIX).sort()).toEqual(
      PRESETS.map((preset) => preset.id).sort(),
    )
  })

  it('keeps every non-stable preset below stable evidence threshold', () => {
    for (const preset of PRESETS) {
      if (preset.status === 'stable') {
        expect(presetHasStableEvidence(preset.id)).toBe(true)
      } else {
        expect(presetHasStableEvidence(preset.id)).toBe(false)
      }
    }
  })

  it('records completed proof for Rust-backed fullstack structure without calling it stable', () => {
    expect(PRESET_VERIFICATION_MATRIX['rust-fullstack']).toMatchObject({
      structure: true,
      cargoWorkspace: true,
      bun: true,
      pnpm: false,
      generatedBuild: false,
    })
    expect(presetHasStableEvidence('rust-fullstack')).toBe(false)
  })
})
