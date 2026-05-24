import type { ProjectConfig } from '../types/schemas'
import { PRESETS, type PresetId } from './presets'
import { SUPPORT_LABELS } from './support-status'

type PresetProjectDefaults = Partial<
  Pick<
    ProjectConfig,
    | 'family'
    | 'bundles'
    | 'backend'
    | 'database'
    | 'orm'
    | 'example'
    | 'rustAuth'
    | 'includeShowcase'
    | 'includeWorker'
    | 'includeDocker'
    | 'includeCi'
    | 'deployment'
  >
>

export function projectDefaultsForPreset(preset: PresetId): PresetProjectDefaults {
  switch (preset) {
    case 'typescript-fullstack':
      return {
        family: 'fullstack',
        bundles: ['product'],
        backend: 'express-bun',
        database: 'postgres',
        orm: 'prisma',
        includeShowcase: false,
        includeWorker: false,
        includeDocker: true,
        includeCi: true,
        deployment: 'vercel-railway',
      }
    case 'rust-api':
      return {
        family: 'rust',
        bundles: ['product'],
        backend: 'rust-axum',
        database: 'postgres',
        orm: 'none',
        example: 'posts',
        rustAuth: 'placeholder',
        includeDocker: true,
        includeCi: true,
        deployment: 'vercel-railway',
      }
    case 'rust-fullstack':
      return {
        family: 'fullstack',
        bundles: ['product'],
        backend: 'rust-axum',
        database: 'postgres',
        orm: 'none',
        includeShowcase: false,
        includeWorker: false,
        includeDocker: true,
        includeCi: true,
        deployment: 'vercel-railway',
      }
    case 'solana-program':
    case 'solana-web':
    case 'solana-mobile':
    case 'solana-product':
      return {
        family: 'solana',
        bundles: [],
        backend: 'none',
        database: 'none',
        orm: 'none',
        includeDocker: false,
        includeCi: true,
        deployment: 'none',
      }
    case 'customize':
    case 'experiments':
      return {}
  }
}

export function presetMenuOptions() {
  return PRESETS.map((preset) => ({
    label: preset.label,
    value: preset.id,
    hint: `${SUPPORT_LABELS[preset.status]} - ${preset.description}`,
  }))
}
