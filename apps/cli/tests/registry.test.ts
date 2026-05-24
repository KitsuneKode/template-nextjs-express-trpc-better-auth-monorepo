import { describe, expect, it } from 'bun:test'
import { CAPABILITIES } from '../src/registry/capabilities'
import { validateCapabilitySelection } from '../src/registry/compatibility'
import { PRESETS } from '../src/registry/presets'
import { SUPPORT_LABELS } from '../src/registry/support-status'

describe('capability registry', () => {
  it('labels supported states for menu display', () => {
    expect(SUPPORT_LABELS.stable).toBe('Stable')
    expect(SUPPORT_LABELS.experimental).toBe('Experimental')
    expect(SUPPORT_LABELS.requiresValidation).toBe('Requires validation')
  })

  it('keeps Bun default and pnpm first-class', () => {
    expect(CAPABILITIES.packageManager.options.bun.status).toBe('stable')
    expect(CAPABILITIES.packageManager.options.bun.default).toBe(true)
    expect(CAPABILITIES.packageManager.options.pnpm.status).toBe('stable')
    expect(CAPABILITIES.packageManager.options.npm.status).toBe('experimental')
  })

  it('defines the approved preset candidates', () => {
    expect(PRESETS.map((preset) => preset.id)).toEqual([
      'typescript-fullstack',
      'rust-api',
      'rust-fullstack',
      'solana-program',
      'solana-web',
      'solana-mobile',
      'solana-product',
      'customize',
      'experiments',
    ])
  })

  it('does not claim target presets are stable before their matrix exists', () => {
    for (const preset of PRESETS.filter((value) => value.id !== 'experiments')) {
      expect(preset.status).toBe('requiresValidation')
    }
    expect(PRESETS.find((preset) => preset.id === 'experiments')?.status).toBe('experimental')
  })
})

describe('capability compatibility', () => {
  it('allows the intended rust-fullstack defaults without compatibility errors', () => {
    const result = validateCapabilitySelection({
      preset: 'rust-fullstack',
      packageManager: 'bun',
      databaseOwner: 'rust',
      databaseClient: 'sqlx',
      authProvider: 'clerk',
    })

    expect(result.errors).toEqual([])
  })

  it('rejects Prisma when Rust owns persistence', () => {
    const result = validateCapabilitySelection({
      preset: 'rust-fullstack',
      packageManager: 'bun',
      databaseOwner: 'rust',
      databaseClient: 'prisma',
      authProvider: 'clerk',
    })

    expect(result.errors).toContain('Prisma requires TypeScript database ownership.')
  })

  it('rejects native Better Auth as Rust auth', () => {
    const result = validateCapabilitySelection({
      preset: 'rust-fullstack',
      packageManager: 'pnpm',
      databaseOwner: 'rust',
      databaseClient: 'sqlx',
      authProvider: 'better-auth-native-rust',
    })

    expect(result.errors).toContain('Better Auth native Rust support is not a stable capability.')
  })
})
