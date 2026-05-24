import type { PresetId } from './presets'

export interface CapabilitySelection {
  preset: PresetId
  packageManager: string
  databaseOwner?: 'typescript' | 'rust' | 'none'
  databaseClient?: string
  authProvider?: string
}

export interface CompatibilityResult {
  warnings: string[]
  errors: string[]
}

export function validateCapabilitySelection(selection: CapabilitySelection): CompatibilityResult {
  const warnings: string[] = []
  const errors: string[] = []

  if (selection.packageManager !== 'bun' && selection.packageManager !== 'pnpm') {
    warnings.push('Only Bun and pnpm are first-class package managers.')
  }

  if (selection.databaseOwner === 'rust' && selection.databaseClient === 'prisma') {
    errors.push('Prisma requires TypeScript database ownership.')
  }

  if (selection.databaseOwner === 'typescript' && selection.databaseClient === 'sqlx') {
    errors.push('SQLx requires Rust database ownership.')
  }

  if (selection.authProvider === 'better-auth-native-rust') {
    errors.push('Better Auth native Rust support is not a stable capability.')
  }

  return { warnings, errors }
}
