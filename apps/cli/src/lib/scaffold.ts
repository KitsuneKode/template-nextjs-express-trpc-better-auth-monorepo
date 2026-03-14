import {
  renderDockerCompose,
  buildServerEnv,
  buildWebEnv,
  renderGithubActionsWorkflow,
  renderDeploymentGuide,
  applyBackendTransform,
  applyDatabaseTransform,
} from './generators'
import { access, cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import type { ProjectConfig, CleanupTarget } from '../types/schemas'
import { basename, dirname, join, resolve } from 'node:path'
import { runCommand, tryCommand } from './spawn'
import { fileURLToPath } from 'node:url'

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
const EXCLUDED_FILES = new Set(['bun.lock', 'docs/cli-development.md', 'docs/bootstrap-cli.md'])

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

export function buildCleanupTargets(
  options: Pick<ProjectConfig, 'includeShowcase' | 'includeWorker' | 'testing'>,
): CleanupTarget[] {
  const targets = new Set<CleanupTarget>(['readme'])

  if (!options.includeShowcase) {
    targets.add('showcase')
    targets.add('seed')
  }

  if (!options.includeWorker) {
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

async function copyTemplate(destinationDir: string): Promise<void> {
  await cp(ROOT_DIR, destinationDir, {
    recursive: true,
    filter: (sourcePath) => {
      const relativePath = sourcePath === ROOT_DIR ? '' : sourcePath.slice(ROOT_DIR.length + 1)
      return shouldCopyPath(relativePath)
    },
  })
}

// Scripts that reference the CLI workspace and should not appear in scaffolded output
const CLI_SCRIPTS = new Set(['dev:cli', 'build:cli'])

async function updateRootPackageJson(destinationDir: string, packageName: string): Promise<void> {
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

export async function scaffoldProject(options: ProjectConfig): Promise<ScaffoldResult> {
  const packageName = sanitizeProjectName(options.projectName)
  const destinationDir = resolve(options.destinationDir)

  await ensureDestinationAvailable(destinationDir)
  await copyTemplate(destinationDir)
  await updateRootPackageJson(destinationDir, packageName)

  // Apply backend/database transforms BEFORE rename-scope so generated files
  // use @template/ imports and get renamed along with everything else.
  await applyBackendTransform(destinationDir, options)
  await applyDatabaseTransform(destinationDir, options)

  runCommand(['bun', 'toolings/scripts/rename-scope.ts', '--quiet'], { cwd: destinationDir })

  const cleanupTargets = buildCleanupTargets(options)
  if (cleanupTargets.length > 0) {
    runCommand(
      [
        'bun',
        'toolings/scripts/template-cleanup.ts',
        `--remove=${cleanupTargets.join(',')}`,
        '--yes',
      ],
      { cwd: destinationDir },
    )
  }

  const generatedFiles: string[] = []

  // Generate .env.example and .env files using the env generator
  const serverEnvContent = buildServerEnv(options)
  const webEnvContent = buildWebEnv()

  await writeGeneratedFile(destinationDir, 'apps/server/.env.example', serverEnvContent)
  generatedFiles.push('apps/server/.env.example')

  await writeGeneratedFile(destinationDir, 'apps/web/.env.example', webEnvContent)
  generatedFiles.push('apps/web/.env.example')

  await writeGeneratedFile(destinationDir, 'apps/server/.env', serverEnvContent)
  generatedFiles.push('apps/server/.env')

  await writeGeneratedFile(destinationDir, 'apps/web/.env', webEnvContent)
  generatedFiles.push('apps/web/.env')

  // Docker Compose (config-aware: adapts to database selection)
  if (options.includeDocker) {
    await writeGeneratedFile(destinationDir, 'docker-compose.yml', renderDockerCompose(options))
    generatedFiles.push('docker-compose.yml')
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

  // Deployment guide (config-aware: adapts to backend/database/docker)
  if (options.deployment !== 'none') {
    await writeGeneratedFile(destinationDir, 'docs/deployment.md', renderDeploymentGuide(options))
    generatedFiles.push('docs/deployment.md')
  }

  if (options.initializeGit) {
    tryCommand(['git', 'init', '-b', 'main'], { cwd: destinationDir })
  }

  if (options.installDependencies) {
    runCommand(['bun', 'install'], { cwd: destinationDir })
  }

  return {
    destinationDir,
    packageName,
    cleanupTargets,
    generatedFiles,
  }
}
