/**
 * Config file support for @kitsu/create
 *
 * Reads ~/.kitsurc and ./kitsu.jsonc for user defaults.
 * Merge order: CLI flags > project config > user config > hardcoded defaults.
 *
 * JSONC format: allows comments (// and /* *\/) which JSON.parse normally rejects.
 * This implementation strips comments before parsing.
 */

import { accessSync, constants, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { ProjectConfig } from '../types/schemas'

export interface KitsuConfig {
  backend?: ProjectConfig['backend']
  database?: ProjectConfig['database']
  orm?: ProjectConfig['orm']
  includeWorker?: boolean
  includeShowcase?: boolean
  testing?: ProjectConfig['testing']
  deployment?: ProjectConfig['deployment']
  includeDocker?: boolean
  includeCi?: boolean
  portfolio?: {
    author?: string
    defaultTags?: string[]
  }
}

function stripJsoncComments(raw: string): string {
  return raw
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
}

function readConfigFile(filePath: string): KitsuConfig | null {
  try {
    accessSync(filePath, constants.R_OK)
    const raw = readFileSync(filePath, 'utf8')
    const cleaned = stripJsoncComments(raw)
    return JSON.parse(cleaned) as KitsuConfig
  } catch {
    return null
  }
}

let cachedConfig: KitsuConfig | null = null

export function loadKitsuConfig(): KitsuConfig {
  if (cachedConfig) return cachedConfig

  const userConfig = readConfigFile(join(homedir(), '.kitsurc'))
  const projectConfig = readConfigFile('kitsu.jsonc')

  cachedConfig = {
    ...userConfig,
    ...projectConfig,
  }

  return cachedConfig
}

export function applyConfigDefaults<T>(cliValue: T | undefined, configKey: keyof KitsuConfig, defaultValue: T): T {
  if (cliValue !== undefined) return cliValue
  const cfg = loadKitsuConfig()
  const configValue = cfg[configKey] as T | undefined
  return configValue ?? defaultValue
}
