import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { ProjectConfig } from '../types/schemas'
import { validateConfig } from './create'
import { buildRootAgentsMd, buildContextMd, buildClaudeMd } from './generators/agent-docs'
import { renderGithubActionsWorkflow } from './generators/ci'
import { renderDockerCompose, renderDockerComposeProd } from './generators/docker'
import { buildServerEnv } from './generators/env'

export interface ProjectConfigFile {
  $schema: string
  version: string
  createdAt: string
  family: string
  packageManager: string
  choices: Record<string, unknown>
  reproducible: string
}

export interface AddOptions {
  feature: string
  destinationDir: string
  params?: Record<string, string>
}

export interface AddResult {
  success: boolean
  feature: string
  errors: string[]
  warnings: string[]
  generatedFiles: string[]
}

const VALID_FEATURES = [
  'docker',
  'ci',
  'websocket',
  'worker',
  'analytics',
  'email',
  's3',
  'payments',
] as const

function readProjectConfig(destinationDir: string): ProjectConfigFile | null {
  const configPath = join(destinationDir, 'kitsu.jsonc')
  if (!existsSync(configPath)) return null
  try {
    const raw = readFileSync(configPath, 'utf8')
    const cleaned = raw.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
    return JSON.parse(cleaned) as ProjectConfigFile
  } catch {
    return null
  }
}

function buildProjectConfig(
  baseDir: string,
  feature: string,
  params: Record<string, string>,
): ProjectConfig {
  const config = readProjectConfig(baseDir)
  const family = (config?.family as ProjectConfig['family']) || 'ts-turbo'
  const pm = (config?.packageManager as ProjectConfig['packageManager']) || 'bun'

  return {
    projectName: 'existing-project',
    destinationDir: baseDir,
    family,
    bundles: ['product'],
    packageManager: pm,
    backend: (config?.choices?.backend as ProjectConfig['backend']) || 'express-bun',
    database: (config?.choices?.database as ProjectConfig['database']) || 'postgres',
    orm: (config?.choices?.orm as ProjectConfig['orm']) || 'prisma',
    vectorDatabase: 'none',
    runtime: 'bun',
    addons: [feature as ProjectConfig['addons'][number]].filter(Boolean),
    example: 'none',
    testing: (config?.choices?.testing as ProjectConfig['testing']) || 'bun',
    deployment: (config?.choices?.deployment as ProjectConfig['deployment']) || 'vercel-railway',
    includeDocker: feature === 'docker' || (config?.choices?.includeDocker as boolean) || false,
    includeCi: feature === 'ci' || (config?.choices?.includeCi as boolean) || false,
    includeShowcase: false,
    includeWorker: feature === 'worker',
    initializeGit: false,
    installDependencies: false,
    presets: [],
  }
}

function writeGeneratedFile(baseDir: string, relativePath: string, content: string): void {
  const filePath = join(baseDir, relativePath)
  mkdirSync(filePath.substring(0, filePath.lastIndexOf('/')), { recursive: true })
  writeFileSync(filePath, content)
}

async function addDockerCompose(baseDir: string, config: ProjectConfig): Promise<string[]> {
  const files: string[] = []
  writeGeneratedFile(baseDir, 'docker-compose.yml', renderDockerCompose(config))
  files.push('docker-compose.yml')
  writeGeneratedFile(baseDir, 'docker-compose.prod.yml', renderDockerComposeProd(config))
  files.push('docker-compose.prod.yml')
  return files
}

async function addCi(baseDir: string, config: ProjectConfig): Promise<string[]> {
  const files: string[] = []
  writeGeneratedFile(baseDir, '.github/workflows/ci.yml', renderGithubActionsWorkflow(config))
  files.push('.github/workflows/ci.yml')
  return files
}

async function addEnvFiles(baseDir: string, config: ProjectConfig): Promise<string[]> {
  const files: string[] = []
  const serverEnv = buildServerEnv(config)
  writeGeneratedFile(baseDir, 'apps/server/.env.example', serverEnv)
  files.push('apps/server/.env.example')
  return files
}

async function addAgentDocs(baseDir: string, config: ProjectConfig): Promise<string[]> {
  const files: string[] = []
  writeGeneratedFile(baseDir, 'AGENTS.md', buildRootAgentsMd(config))
  files.push('AGENTS.md')
  writeGeneratedFile(baseDir, 'CONTEXT.md', buildContextMd(config))
  files.push('CONTEXT.md')
  writeGeneratedFile(baseDir, 'CLAUDE.md', buildClaudeMd())
  files.push('CLAUDE.md')
  return files
}

const FEATURE_HANDLERS: Record<
  string,
  (baseDir: string, config: ProjectConfig) => Promise<string[]>
> = {
  docker: addDockerCompose,
  ci: addCi,
  env: addEnvFiles,
  'agent-docs': addAgentDocs,
}

/**
 * Add a feature to an existing scaffolded project.
 * Requires kitsu.jsonc to detect current config.
 */
export async function addFeature(options: AddOptions): Promise<AddResult> {
  const { feature, destinationDir, params = {} } = options
  const generatedFiles: string[] = []
  const warnings: string[] = []

  if (
    !VALID_FEATURES.includes(feature as (typeof VALID_FEATURES)[number]) &&
    !FEATURE_HANDLERS[feature]
  ) {
    return {
      success: false,
      feature,
      errors: [
        `Unknown feature: "${feature}". Valid: ${[...VALID_FEATURES, ...Object.keys(FEATURE_HANDLERS)].join(', ')}`,
      ],
      warnings: [],
      generatedFiles: [],
    }
  }

  const configFile = readProjectConfig(destinationDir)
  if (!configFile) {
    warnings.push('No kitsu.jsonc found. Using ts-turbo defaults.')
  }

  const config = buildProjectConfig(destinationDir, feature, params)
  const validation = validateConfig(config)
  if (!validation.valid) {
    return {
      success: false,
      feature,
      errors: validation.errors,
      warnings: validation.warnings,
      generatedFiles: [],
    }
  }

  const handler = FEATURE_HANDLERS[feature]
  if (handler) {
    const files = await handler(destinationDir, config)
    generatedFiles.push(...files)
  }

  // Update kitsu.jsonc to record the addon
  if (configFile) {
    configFile.choices = {
      ...configFile.choices,
      addons: [...((configFile.choices.addons as string[]) || []), feature],
    }
    writeGeneratedFile(destinationDir, 'kitsu.jsonc', JSON.stringify(configFile, null, 2) + '\n')
    generatedFiles.push('kitsu.jsonc (updated)')
  }

  return {
    success: true,
    feature,
    errors: [],
    warnings,
    generatedFiles,
  }
}
