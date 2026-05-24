import type { PresetId } from './presets'

export interface PresetVerificationEvidence {
  structure: boolean
  bun: boolean
  pnpm: boolean
  generatedInstall: boolean
  generatedLint: boolean
  generatedTypecheck: boolean
  generatedTest: boolean
  generatedBuild: boolean
  docs: boolean
  agentContext: boolean
  cargoWorkspace: boolean
  rustQualityGates: boolean
  solanaProgram: boolean
  deployment: boolean
}

const NONE: PresetVerificationEvidence = {
  structure: false,
  bun: false,
  pnpm: false,
  generatedInstall: false,
  generatedLint: false,
  generatedTypecheck: false,
  generatedTest: false,
  generatedBuild: false,
  docs: false,
  agentContext: false,
  cargoWorkspace: false,
  rustQualityGates: false,
  solanaProgram: false,
  deployment: false,
}

export const PRESET_VERIFICATION_MATRIX = {
  'typescript-fullstack': {
    ...NONE,
    structure: true,
    bun: true,
    pnpm: true,
    docs: true,
    agentContext: true,
  },
  'rust-api': {
    ...NONE,
    structure: true,
    bun: true,
    docs: true,
    agentContext: true,
    cargoWorkspace: true,
  },
  'rust-fullstack': {
    ...NONE,
    structure: true,
    bun: true,
    docs: true,
    agentContext: true,
    cargoWorkspace: true,
  },
  'solana-program': {
    ...NONE,
    structure: true,
    bun: true,
    solanaProgram: true,
  },
  'solana-web': {
    ...NONE,
    structure: true,
    bun: true,
    solanaProgram: true,
  },
  'solana-mobile': {
    ...NONE,
    structure: true,
    bun: true,
    solanaProgram: true,
  },
  'solana-product': {
    ...NONE,
    structure: true,
    bun: true,
    solanaProgram: true,
  },
  customize: NONE,
  experiments: NONE,
} satisfies Record<PresetId, PresetVerificationEvidence>

const STABLE_CORE_REQUIREMENTS: (keyof PresetVerificationEvidence)[] = [
  'structure',
  'bun',
  'pnpm',
  'generatedInstall',
  'generatedLint',
  'generatedTypecheck',
  'generatedTest',
  'generatedBuild',
  'docs',
  'agentContext',
  'deployment',
]

export function presetHasStableEvidence(preset: PresetId): boolean {
  const evidence = PRESET_VERIFICATION_MATRIX[preset]
  const corePasses = STABLE_CORE_REQUIREMENTS.every((requirement) => evidence[requirement])

  if (preset === 'rust-api' || preset === 'rust-fullstack') {
    return corePasses && evidence.cargoWorkspace && evidence.rustQualityGates
  }

  if (preset.startsWith('solana-')) {
    return corePasses && evidence.solanaProgram
  }

  return corePasses
}
