/**
 * Public preset display data for the marketing site.
 * Keep in sync with apps/cli/src/registry/presets.ts and support-status.ts.
 */

export type PublicSupportStatus = 'stable' | 'experimental' | 'requiresValidation'

export const SUPPORT_LABELS: Record<PublicSupportStatus, string> = {
  stable: 'Stable',
  experimental: 'Experimental',
  requiresValidation: 'Requires validation',
}

export function formatSupportStatus(status: PublicSupportStatus): string {
  return SUPPORT_LABELS[status]
}

export type PublicPresetId =
  | 'typescript-fullstack'
  | 'rust-api'
  | 'rust-fullstack'
  | 'solana-program'
  | 'solana-web'
  | 'solana-mobile'
  | 'solana-product'
  | 'customize'
  | 'experiments'

export interface PublicPresetRow {
  id: PublicPresetId
  label: string
  status: PublicSupportStatus
  description: string
  shape: string
  goodFor: string
}

/** Presets shown on /families (excludes customize/experiments entry points). */
export const PUBLIC_PRESET_ROWS: PublicPresetRow[] = [
  {
    id: 'typescript-fullstack',
    label: 'TypeScript Fullstack',
    status: 'requiresValidation',
    description:
      'Next.js plus TypeScript API, contracts, auth, database, and deployment foundations.',
    shape: 'Next.js web + Express API + tRPC + Better Auth + Prisma',
    goodFor: 'Default production app foundation',
  },
  {
    id: 'rust-api',
    label: 'Rust API',
    status: 'requiresValidation',
    description: 'Axum API with Cargo workspace, SQLx-ready persistence, and Rust quality gates.',
    shape: 'Cargo workspace with service and worker slots',
    goodFor: 'Engine services, background work, and future polyglot scale',
  },
  {
    id: 'rust-fullstack',
    label: 'Rust Fullstack',
    status: 'requiresValidation',
    description: 'Next.js frontend plus Axum API with Cargo workspace and Clerk/JWT auth boundary.',
    shape: 'Next.js web + Axum API + shared deployment docs',
    goodFor: 'Teams that want Rust on the API with a typed web client',
  },
  {
    id: 'solana-program',
    label: 'Solana Program',
    status: 'requiresValidation',
    description: 'Anchor program foundation with IDL/client generation contract.',
    shape: 'Anchor program + generated client boundaries',
    goodFor: 'On-chain program work with explicit client contracts',
  },
  {
    id: 'solana-web',
    label: 'Solana Web dApp',
    status: 'requiresValidation',
    description: 'Next.js dApp with Anchor program and generated Solana client.',
    shape: 'Next.js dApp + program + wallet adapter direction',
    goodFor: 'Web3 apps with web wallet flows',
  },
  {
    id: 'solana-mobile',
    label: 'Solana Mobile dApp',
    status: 'requiresValidation',
    description:
      'Expo Router app with Anchor program, generated client, and mobile wallet boundary.',
    shape: 'Expo mobile + program + mobile wallet boundary',
    goodFor: 'Mobile-first Solana products',
  },
  {
    id: 'solana-product',
    label: 'Solana Product',
    status: 'requiresValidation',
    description: 'Web, mobile, program, generated client, and shared Solana configuration.',
    shape: 'Web + mobile + program + shared Solana config',
    goodFor: 'Full product surface across web, mobile, and chain',
  },
]

export const PUBLIC_PRESET_ENTRY_ROWS: PublicPresetRow[] = [
  ...PUBLIC_PRESET_ROWS,
  {
    id: 'customize',
    label: 'Customize',
    status: 'requiresValidation',
    description: 'Build from supported capabilities with compatibility validation.',
    shape: 'Capability picker with validation gates',
    goodFor: 'Teams that need a bespoke mix of bundles and backends',
  },
  {
    id: 'experiments',
    label: 'Experiments',
    status: 'experimental',
    description: 'Explicit opt-in for proof-gated or unstable stack routes.',
    shape: 'Experimental routes only',
    goodFor: 'Trying unstable generators with clear expectations',
  },
]
