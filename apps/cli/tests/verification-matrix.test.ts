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

  it('records completed Convex structure proof without calling convex-product stable', () => {
    expect(PRESET_VERIFICATION_MATRIX['convex-product']).toMatchObject({
      structure: true,
      bun: true,
      convexBackend: true,
      generatedBuild: false,
      docs: true,
      agentContext: true,
    })
    expect(presetHasStableEvidence('convex-product')).toBe(false)
  })

  it('records completed Solana structure proof without calling Solana presets stable', () => {
    for (const preset of [
      'solana-program',
      'solana-web',
      'solana-mobile',
      'solana-product',
    ] as const) {
      expect(PRESET_VERIFICATION_MATRIX[preset]).toMatchObject({
        structure: true,
        bun: true,
        generatedBuild: false,
        solanaProgram: true,
      })
      expect(presetHasStableEvidence(preset)).toBe(false)
    }
  })
})
