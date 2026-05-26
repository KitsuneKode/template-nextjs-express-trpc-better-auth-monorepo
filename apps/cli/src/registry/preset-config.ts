import {
  presetMenuOptions as registryPresetMenuOptions,
  projectDefaultsForPreset as registryProjectDefaultsForPreset,
  type PresetId,
} from '@arche-template/registry'
import type { ProjectConfig } from '../types/schemas'

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
  return registryProjectDefaultsForPreset(preset) as PresetProjectDefaults
}

export function presetMenuOptions() {
  return registryPresetMenuOptions()
}
