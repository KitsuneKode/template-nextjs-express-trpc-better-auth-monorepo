import { existsSync } from 'node:fs'
import { access, cp, mkdir, readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { basename, dirname, join, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Family, ProjectConfig, CleanupTarget, PackageManager } from '../types/schemas'
import {
  renderDockerCompose,
  renderDockerComposeProd,
  renderGithubActionsWorkflow,
  renderNginxConfig,
  buildServerEnv,
  buildWebEnv,
  renderDeploymentGuide,
  applyBackendTransform,
  applyDatabaseTransform,
  applyOrmTransform,
  buildRootAgentsMd,
  buildContextMd,
  buildClaudeMd,
  buildStoreRulesMd,
  buildWebRulesMd,
  buildTrpcRulesMd,
  buildReadme,
  buildShowcaseMdx,
  writeSkillConfigs,
  applyBundleTransforms,
} from './generators'
import { pmInstall } from './pm'
import { runCommand, tryCommand } from './spawn'

export interface ScaffoldResult {
  destinationDir: string
  packageName: string
  cleanupTargets: CleanupTarget[]
  generatedFiles: string[]
}

const EXCLUDED_SEGMENTS = new Set([
  '.git',
  '.turbo',
  '.vercel',
  'node_modules',
  '.claude',
  '.cursor',
  '.vscode',
  'logs',
])

// Files that should not appear in scaffolded output
const EXCLUDED_FILES = new Set([
  'bun.lock',
  'docs/cli-development.md',
  'docs/bootstrap-cli.md',
  // Never copy actual .env files — only .env.example
  '.env',
  'apps/server/.env',
  'apps/web/.env',
  'apps/worker/.env',
  'packages/auth/.env',
  'packages/store/.env',
  'apps/server/.env.example',
  'apps/web/.env.example',
])

// Node.js compatible path resolution (works in both Node and Bun)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Detect if running from bundled dist or source
// Source: apps/cli/src/lib/scaffold.ts (4 levels to root)
// Bundled: apps/cli/dist/index.js (3 levels to root)
const isBundled = __dirname.includes('/dist') || !__dirname.includes('/src/')
const ROOT_DIR = resolve(__dirname, isBundled ? '../../..' : '../../../..')

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._ -]/g, '')
    .replace(/[._ ]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function sanitizeProjectName(input: string): string {
  const normalized = slugify(basename(input))
  if (!normalized) {
    throw new Error('Project name must contain at least one alphanumeric character.')
  }
  return normalized
}

/** Map family to template source directory. Falls back to ROOT_DIR. */
function resolveTemplateSource(family: Family): string {
  const localTemplatesDir = resolve(__dirname, '../templates')
  const familyDir = join(localTemplatesDir, family)
  if (existsSync(familyDir)) {
    return familyDir
  }
  return ROOT_DIR
}

/** Families that get backend/database/ORM transforms from the ts-turbo pipeline */
function hasTransformPipeline(family: Family): boolean {
  return family === 'ts-turbo' || family === 'backend'
}

/** Families that should strip the web workspace */
function shouldStripWeb(family: Family): boolean {
  return family === 'backend'
}

/** Families that should strip the server workspace */
function shouldStripServer(family: Family): boolean {
  return family === 'next' || family === 'mobile'
}

/** Families that should strip the worker workspace */
function shouldDefaultStripWorker(family: Family): boolean {
  return family !== 'ts-turbo'
}

export function buildCleanupTargets(
  options: Pick<ProjectConfig, 'includeShowcase' | 'includeWorker' | 'testing' | 'family'>,
): CleanupTarget[] {
  const targets = new Set<CleanupTarget>(['readme'])

  // Showcase is only relevant for ts-turbo
  if (!options.includeShowcase || options.family !== 'ts-turbo') {
    targets.add('showcase')
    targets.add('seed')
  }

  // Worker stripping
  if (!options.includeWorker) {
    targets.add('worker')
  }

  // Non-ts-turbo families strip worker by default
  if (shouldDefaultStripWorker(options.family)) {
    targets.add('worker')
  }

  if (options.testing === 'none') {
    targets.add('tests')
  }

  return [...targets]
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function ensureDestinationAvailable(destinationDir: string): Promise<void> {
  if (!(await pathExists(destinationDir))) return

  const entries = await readdir(destinationDir)
  if (entries.length > 0) {
    throw new Error(`Destination directory is not empty: ${destinationDir}`)
  }
}

function shouldCopyPath(relativePath: string): boolean {
  if (!relativePath) return true

  const segments = relativePath.split('/').filter(Boolean)
  if (segments[0] === 'apps' && segments[1] === 'cli') return false
  if (segments.some((segment) => EXCLUDED_SEGMENTS.has(segment))) return false
  if (EXCLUDED_FILES.has(relativePath)) return false

  const fileName = segments.at(-1) ?? ''
  if (fileName.startsWith('.env') && !fileName.endsWith('.example')) return false

  return true
}

interface KitsuFilesManifest {
  version: string
  include: string[]
}

async function loadManifest(sourceDir: string): Promise<KitsuFilesManifest | null> {
  const manifestPath = join(sourceDir, '.kitsufiles.json')
  try {
    const raw = await readFile(manifestPath, 'utf8')
    return JSON.parse(raw) as KitsuFilesManifest
  } catch {
    return null
  }
}

async function copyWithManifest(
  destinationDir: string,
  sourceDir: string,
  manifest: KitsuFilesManifest,
): Promise<void> {
  for (const relativePath of manifest.include) {
    const srcPath = join(sourceDir, relativePath)
    const destPath = join(destinationDir, relativePath)
    try {
      const srcStat = await stat(srcPath)
      if (srcStat.isDirectory()) {
        await mkdir(destPath, { recursive: true })
      } else {
        await mkdir(dirname(destPath), { recursive: true })
        await cp(srcPath, destPath)
      }
    } catch {
      // Skip files that don't exist in the source
    }
  }
}

async function copyTemplate(destinationDir: string, sourceDir: string): Promise<void> {
  // Check for inclusion manifest
  const manifest = await loadManifest(sourceDir)
  if (manifest) {
    await copyWithManifest(destinationDir, sourceDir, manifest)
    return
  }

  // Fall back to exclusion-based copy (for ts-turbo which uses ROOT_DIR)
  await cp(sourceDir, destinationDir, {
    recursive: true,
    filter: (sourcePath) => {
      const relativePath = sourcePath === sourceDir ? '' : sourcePath.slice(sourceDir.length + 1)
      return shouldCopyPath(relativePath)
    },
  })
}

// Scripts that reference the CLI workspace and should not appear in scaffolded output
const CLI_SCRIPTS = new Set(['dev:cli', 'build:cli'])

async function updateRootPackageJson(
  destinationDir: string,
  packageName: string,
  options: ProjectConfig,
): Promise<void> {
  const packageJsonPath = join(destinationDir, 'package.json')
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as Record<string, unknown>
  packageJson.name = packageName

  // Strip CLI-only scripts that reference the excluded CLI workspace
  if (packageJson.scripts && typeof packageJson.scripts === 'object') {
    const scripts = packageJson.scripts as Record<string, unknown>
    for (const key of CLI_SCRIPTS) {
      delete scripts[key]
    }
  }

  // Portfolio metadata for kitsunekode.in auto-discovery
  packageJson.portfolio = {
    type: options.family,
    tags: [options.backend || 'none', options.database || 'none', options.orm || 'none'],
    featured: false,
  }

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
}

async function writeGeneratedFile(
  destinationDir: string,
  relativePath: string,
  content: string,
): Promise<void> {
  const filePath = join(destinationDir, relativePath)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, content)
}

function buildKitsuConfig(options: ProjectConfig): string {
  const config = {
    $schema: 'https://kitsunekode.in/schemas/kitsu.json',
    version: '0.2.0',
    createdAt: new Date().toISOString(),
    family: options.family,
    packageManager: options.packageManager,
    choices: {
      backend: options.backend,
      database: options.database,
      orm: options.orm,
      bundles: options.bundles,
      testing: options.testing,
      deployment: options.deployment,
      includeWorker: options.includeWorker,
      includeShowcase: options.includeShowcase,
      presets: options.presets,
    },
    reproducible: `npx @kitsu/create ${options.projectName} --yes --family=${options.family} --backend=${options.backend} --database=${options.database} --orm=${options.orm}`,
  }
  return JSON.stringify(config, null, 2) + '\n'
}

export async function scaffoldProject(
  options: ProjectConfig,
  dryRun = false,
): Promise<ScaffoldResult> {
  const packageName = sanitizeProjectName(options.projectName)
  const destinationDir = resolve(options.destinationDir)
  const family = options.family
  const pm = options.packageManager ?? 'bun'

  await ensureDestinationAvailable(destinationDir)

  const templateSource = resolveTemplateSource(family)
  await copyTemplate(destinationDir, templateSource)
  await updateRootPackageJson(destinationDir, packageName, options)

  // Family-specific transforms
  if (hasTransformPipeline(family)) {
    await applyBackendTransform(destinationDir, options)
    if (options.orm !== 'drizzle') {
      await applyDatabaseTransform(destinationDir, options)
    }
    await applyOrmTransform(destinationDir, options)
  }

  runCommand([pmExecTool(pm, 'bun'), 'toolings/scripts/rename-scope.ts', '--quiet'], {
    cwd: destinationDir,
  })

  const cleanupTargets = buildCleanupTargets(options)
  if (cleanupTargets.length > 0) {
    runCommand(
      [
        pmExecTool(pm, 'bun'),
        'toolings/scripts/template-cleanup.ts',
        `--remove=${cleanupTargets.join(',')}`,
        '--yes',
      ],
      { cwd: destinationDir },
    )
  }

  // Write kitsu.jsonc for reproducibility
  await writeGeneratedFile(destinationDir, 'kitsu.jsonc', buildKitsuConfig(options))

  // Apply bundle transforms (realtime, growth, infra, ai)
  const bundleFiles = applyBundleTransforms(destinationDir, options)

  const generatedFiles: string[] = ['kitsu.jsonc', ...bundleFiles]

  // Family-aware env generation
  const hasServer = !shouldStripServer(family)
  const hasWeb = !shouldStripWeb(family)

  if (hasServer) {
    const serverEnvContent = buildServerEnv(options)
    await writeGeneratedFile(destinationDir, 'apps/server/.env.example', serverEnvContent)
    generatedFiles.push('apps/server/.env.example')
    await writeGeneratedFile(destinationDir, 'apps/server/.env', serverEnvContent)
    generatedFiles.push('apps/server/.env')
  }

  if (hasWeb) {
    const webEnvContent = buildWebEnv()
    await writeGeneratedFile(destinationDir, 'apps/web/.env.example', webEnvContent)
    generatedFiles.push('apps/web/.env.example')
    await writeGeneratedFile(destinationDir, 'apps/web/.env', webEnvContent)
    generatedFiles.push('apps/web/.env')
  }

  // Docker Compose (config-aware: adapts to database selection)
  if (options.includeDocker) {
    await writeGeneratedFile(destinationDir, 'docker-compose.yml', renderDockerCompose(options))
    generatedFiles.push('docker-compose.yml')

    await writeGeneratedFile(
      destinationDir,
      'docker-compose.prod.yml',
      renderDockerComposeProd(options),
    )
    generatedFiles.push('docker-compose.prod.yml')

    await writeGeneratedFile(destinationDir, 'nginx/nginx.conf', renderNginxConfig(options))
    generatedFiles.push('nginx/nginx.conf')
  }

  // GitHub Actions CI (config-aware: adapts to testing/runtime)
  if (options.includeCi) {
    await writeGeneratedFile(
      destinationDir,
      '.github/workflows/ci.yml',
      renderGithubActionsWorkflow(options),
    )
    generatedFiles.push('.github/workflows/ci.yml')
  }

  // Agent documentation (AI-development-ready from day one)
  await writeGeneratedFile(destinationDir, 'AGENTS.md', buildRootAgentsMd(options))
  generatedFiles.push('AGENTS.md')
  await writeGeneratedFile(destinationDir, 'CONTEXT.md', buildContextMd(options))
  generatedFiles.push('CONTEXT.md')
  await writeGeneratedFile(destinationDir, 'CLAUDE.md', buildClaudeMd())
  generatedFiles.push('CLAUDE.md')

  // Agent skill configuration
  writeSkillConfigs(destinationDir, options)

  // Generate .claude/rules/ directory for path-scoped agent rules
  if (hasServer) {
    await writeGeneratedFile(destinationDir, '.claude/rules/store.md', buildStoreRulesMd(options))
    generatedFiles.push('.claude/rules/store.md')
  }
  if (hasWeb) {
    await writeGeneratedFile(destinationDir, '.claude/rules/web.md', buildWebRulesMd())
    generatedFiles.push('.claude/rules/web.md')
    await writeGeneratedFile(destinationDir, '.claude/rules/trpc.md', buildTrpcRulesMd())
    generatedFiles.push('.claude/rules/trpc.md')
  }

  // SHOWCASE.mdx (portfolio-ready) — only ts-turbo has showcase
  if (options.includeShowcase && family === 'ts-turbo') {
    await writeGeneratedFile(destinationDir, 'SHOWCASE.mdx', buildShowcaseMdx(options))
    generatedFiles.push('SHOWCASE.mdx')
  }

  // Project README
  await writeGeneratedFile(destinationDir, 'README.md', buildReadme(options))
  generatedFiles.push('README.md')

  // Deployment guide (config-aware: adapts to backend/database/docker)
  if (options.deployment !== 'none') {
    await writeGeneratedFile(destinationDir, 'docs/deployment.md', renderDeploymentGuide(options))
    generatedFiles.push('docs/deployment.md')
  }

  if (options.initializeGit) {
    tryCommand(['git', 'init', '-b', 'main'], { cwd: destinationDir })
  }

  if (options.installDependencies && !dryRun) {
    runCommand([pmInstall(pm)], { cwd: destinationDir })
  }

  return {
    destinationDir,
    packageName,
    cleanupTargets,
    generatedFiles,
  }
}

/** Get the executable runner for a given package manager (bun vs npx vs pnpm dlx) */
function pmExecTool(pm: PackageManager, defaultTool: string): string {
  if (pm === 'bun') return 'bun'
  if (pm === 'pnpm') return 'pnpm'
  return 'npx'
}
