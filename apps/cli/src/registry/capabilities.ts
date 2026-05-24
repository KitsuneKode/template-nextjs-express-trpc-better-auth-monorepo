import type { SupportStatus } from './support-status'

export interface CapabilityOption {
  id: string
  label: string
  status: SupportStatus
  default?: boolean
  description?: string
}

export interface CapabilityDefinition {
  id: string
  label: string
  options: Record<string, CapabilityOption>
}

export const CAPABILITIES = {
  packageManager: {
    id: 'package-manager',
    label: 'Package manager',
    options: {
      bun: {
        id: 'bun',
        label: 'Bun',
        status: 'stable',
        default: true,
        description: 'Default package manager with Bun-native catalogs.',
      },
      pnpm: {
        id: 'pnpm',
        label: 'pnpm',
        status: 'stable',
        description: 'First-class package manager with pnpm-native catalogs.',
      },
      npm: {
        id: 'npm',
        label: 'npm',
        status: 'experimental',
        description: 'Not part of the stable generated-project matrix.',
      },
    },
  },
  typescriptRuntime: {
    id: 'typescript-runtime',
    label: 'TypeScript runtime',
    options: {
      node: { id: 'node', label: 'Node.js', status: 'stable', default: true },
      bun: { id: 'bun', label: 'Bun runtime', status: 'requiresValidation' },
    },
  },
  rustApi: {
    id: 'rust-api',
    label: 'Rust API',
    options: {
      axum: { id: 'axum', label: 'Axum', status: 'requiresValidation', default: true },
    },
  },
  database: {
    id: 'database',
    label: 'Database',
    options: {
      postgresSqlx: {
        id: 'postgres-sqlx',
        label: 'Postgres + SQLx',
        status: 'requiresValidation',
        default: true,
      },
      none: { id: 'none', label: 'None', status: 'stable' },
      seaOrm: { id: 'sea-orm', label: 'SeaORM', status: 'experimental' },
    },
  },
} as const satisfies Record<string, CapabilityDefinition>
