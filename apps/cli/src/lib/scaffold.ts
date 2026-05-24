import { existsSync } from 'node:fs'
import {
  access,
  cp,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  symlink,
  writeFile,
} from 'node:fs/promises'
import { dirname, join, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  renderGeneratedAgentsMd,
  renderInternalDocsIndex,
  renderPlansIndex,
} from '../render/docs/agent-context'
import type { Family, ProjectConfig, CleanupTarget } from '../types/schemas'
import {
  familySupportsBundles,
  familySupportsMonorepoTransforms,
  familySupportsRenameScope,
  familySupportsTemplateCleanup,
} from '../types/schemas'
import { buildCleanupTargets } from './cleanup-targets'
import {
  renderDockerCompose,
  renderDockerComposeProd,
  renderGithubActionsWorkflow,
  renderNginxConfig,
  buildServerEnv,
  buildWebEnv,
  renderDeploymentGuide,
  applyBackendTransform,
  applyRustFamilyTransform,
  applyRustScaffoldTransform,
  renderGitignore,
  applyDatabaseTransform,
  applyOrmTransform,
  buildGeneratedArchitectureMd,
  buildReadme,
  buildShowcaseMdx,
  writeSkillConfigs,
  applyBundleTransforms,
} from './generators'
import { planScaffold } from './plan-scaffold'
import { adaptScripts, pmInstallParts } from './pm'
import { buildReproducibleCommand } from './reproducible'
import { sanitizeProjectName as _sanitizeProjectName } from './slug'

export { buildCleanupTargets } from './cleanup-targets'
export { sanitizeProjectName } from './slug'
export { buildReproducibleCommand } from './reproducible'
export { planScaffold } from './plan-scaffold'
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
  '.opencode',
  '.codebuddy',
  'logs',
])

// Files that should not appear in scaffolded output
const EXCLUDED_FILES = new Set([
  'bun.lock',
  // Root agent files are regenerated so CLAUDE.md can point at canonical AGENTS.md.
  'AGENTS.md',
  'CLAUDE.md',
  'CONTEXT.md',
  'docs/cli-development.md',
  'docs/archive',
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
const TOOLINGS_DIR = join(ROOT_DIR, 'toolings', 'scripts')

/** Map family to template source directory. Falls back to ROOT_DIR. */
function resolveTemplateSource(family: Family): string {
  const localTemplatesDir = resolve(__dirname, '../templates')
  const familyDir = join(localTemplatesDir, family)
  if (existsSync(familyDir)) {
    return familyDir
  }
  return ROOT_DIR
}

/** Monorepo families have the full apps/packages/ structure */
function isMonorepoFamily(family: Family): boolean {
  return family === 'fullstack' || family === 'polyglot'
}

/** Families that should strip the web workspace */
function shouldStripWeb(family: Family): boolean {
  return family === 'backend'
}

/** Families that should strip the server workspace */
function shouldStripServer(family: Family): boolean {
  return family === 'next' || family === 'mobile'
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

function isSubPath(parent: string, child: string): boolean {
  const rel = relative(parent, child)
  if (!rel || rel === '..') return false
  return !rel.startsWith('..') && !rel.startsWith('/')
}

async function ensureDestinationAvailable(
  destinationDir: string,
  sourceDir: string,
): Promise<void> {
  if (isSubPath(sourceDir, destinationDir)) {
    throw new Error(
      `Destination directory must be outside the template source.\n` +
        `  Source: ${sourceDir}\n` +
        `  Destination: ${destinationDir}\n` +
        `Tip: Use a path one level above the monorepo, e.g. ~/projects/my-app`,
    )
  }

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

interface ArcheFilesManifest {
  version: string
  include: string[]
}

async function loadManifest(sourceDir: string): Promise<ArcheFilesManifest | null> {
  const manifestPath = join(sourceDir, '.archefiles.json')
  try {
    const raw = await readFile(manifestPath, 'utf8')
    return JSON.parse(raw) as ArcheFilesManifest
  } catch {
    return null
  }
}

async function copyWithManifest(
  destinationDir: string,
  sourceDir: string,
  manifest: ArcheFilesManifest,
): Promise<void> {
  for (const relativePath of manifest.include) {
    const srcPath = join(sourceDir, relativePath)
    const destPath = join(destinationDir, relativePath)
    try {
      const srcStat = await stat(srcPath)
      if (srcStat.isDirectory()) {
        await cp(srcPath, destPath, { recursive: true })
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

  // Fall back to exclusion-based copy (for fullstack which uses ROOT_DIR)
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
  try {
    await access(packageJsonPath)
  } catch {
    // Non-JS families (rust, solana) have no package.json — nothing to update
    return
  }
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

async function writeGeneratedClaudeSymlink(destinationDir: string): Promise<void> {
  const filePath = join(destinationDir, 'CLAUDE.md')
  await rm(filePath, { force: true })
  await symlink('AGENTS.md', filePath)
}

function buildArcheConfig(options: ProjectConfig): string {
  const config = {
    $schema: 'https://kitsunekode.in/schemas/arche.json',
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
      example: options.example,
      rustAuth: options.rustAuth,
    },
    reproducible: buildReproducibleCommand(options),
  }
  return JSON.stringify(config, null, 2) + '\n'
}

async function adaptPackageManagerScripts(
  destinationDir: string,
  pm: ProjectConfig['packageManager'],
): Promise<void> {
  if (pm === 'bun') return

  async function walk(dir: string): Promise<void> {
    let entries: string[]
    try {
      entries = await readdir(dir)
    } catch {
      return
    }
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.git') continue
      const full = join(dir, entry)
      const st = await stat(full)
      if (st.isDirectory()) {
        await walk(full)
        continue
      }
      if (entry !== 'package.json') continue
      try {
        const raw = await readFile(full, 'utf8')
        const pkg = JSON.parse(raw) as { scripts?: Record<string, string> }
        if (!pkg.scripts) continue
        pkg.scripts = adaptScripts(pkg.scripts, pm)
        await writeFile(full, JSON.stringify(pkg, null, 2) + '\n')
      } catch {
        // skip invalid package.json
      }
    }
  }

  await walk(destinationDir)
}

export async function scaffoldProject(
  options: ProjectConfig,
  dryRun = false,
): Promise<ScaffoldResult> {
  if (dryRun) {
    return planScaffold(options)
  }

  const packageName = _sanitizeProjectName(options.projectName)
  const destinationDir = resolve(options.destinationDir)
  const family = options.family
  const pm = options.packageManager ?? 'bun'

  const templateSource = resolveTemplateSource(family)
  await ensureDestinationAvailable(destinationDir, templateSource)
  await copyTemplate(destinationDir, templateSource)
  await updateRootPackageJson(destinationDir, packageName, options)

  let rustGeneratedFiles: string[] = []
  if (family === 'rust') {
    await applyRustFamilyTransform(destinationDir, options)
    rustGeneratedFiles = await applyRustScaffoldTransform(destinationDir, options)
  }

  if (familySupportsMonorepoTransforms(family)) {
    await applyBackendTransform(destinationDir, options)
    if (options.orm !== 'drizzle') {
      await applyDatabaseTransform(destinationDir, options)
    }
    await applyOrmTransform(destinationDir, options)
  }

  if (familySupportsRenameScope(family)) {
    runCommand(['bun', join(TOOLINGS_DIR, 'rename-scope.ts'), '--quiet'], {
      cwd: destinationDir,
    })
  }

  // Run template-cleanup only for monorepo families that carry showcase/seed/worker
  const cleanupTargets = buildCleanupTargets(options)
  if (familySupportsTemplateCleanup(family) && cleanupTargets.length > 0) {
    runCommand(
      [
        'bun',
        join(TOOLINGS_DIR, 'template-cleanup.ts'),
        `--remove=${cleanupTargets.join(',')}`,
        '--yes',
      ],
      { cwd: destinationDir },
    )
  }

  // Write arche.json for reproducibility
  await writeGeneratedFile(destinationDir, 'arche.json', buildArcheConfig(options))

  const bundleFiles = familySupportsBundles(family)
    ? applyBundleTransforms(destinationDir, options)
    : []

  await adaptPackageManagerScripts(destinationDir, pm)

  const generatedFiles: string[] = ['arche.json', ...bundleFiles, ...rustGeneratedFiles]

  const monorepo = isMonorepoFamily(family)
  const hasServer = !shouldStripServer(family)
  const hasWeb = !shouldStripWeb(family)

  // Server env: only for monorepo families (standalone templates ship their own .env)
  if (hasServer && monorepo) {
    const serverEnvContent = buildServerEnv(options)
    const serverDir = family === 'polyglot' ? 'apps/api' : 'apps/server'
    await writeGeneratedFile(destinationDir, `${serverDir}/.env.example`, serverEnvContent)
    generatedFiles.push(`${serverDir}/.env.example`)
    await writeGeneratedFile(destinationDir, `${serverDir}/.env`, serverEnvContent)
    generatedFiles.push(`${serverDir}/.env`)
  }

  // Web env: only for monorepo families
  if (hasWeb && monorepo) {
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

    if (monorepo) {
      await writeGeneratedFile(
        destinationDir,
        'docker-compose.prod.yml',
        renderDockerComposeProd(options),
      )
      generatedFiles.push('docker-compose.prod.yml')

      await writeGeneratedFile(destinationDir, 'nginx/nginx.conf', renderNginxConfig(options))
      generatedFiles.push('nginx/nginx.conf')
    }
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

  // Agent context uses one canonical instruction file plus scoped internal docs.
  await writeGeneratedFile(
    destinationDir,
    'AGENTS.md',
    renderGeneratedAgentsMd({ projectName: packageName }),
  )
  generatedFiles.push('AGENTS.md')
  await writeGeneratedClaudeSymlink(destinationDir)
  generatedFiles.push('CLAUDE.md')
  await writeGeneratedFile(destinationDir, '.docs/README.md', renderInternalDocsIndex())
  generatedFiles.push('.docs/README.md')
  await writeGeneratedFile(
    destinationDir,
    '.docs/architecture/generated-project.md',
    buildGeneratedArchitectureMd(options),
  )
  generatedFiles.push('.docs/architecture/generated-project.md')
  await writeGeneratedFile(destinationDir, '.plans/README.md', renderPlansIndex())
  generatedFiles.push('.plans/README.md')

  // Agent skill configuration
  const skillFiles = writeSkillConfigs(destinationDir, options)
  generatedFiles.push(...skillFiles)

  // SHOWCASE.mdx (portfolio-ready) — only fullstack has showcase
  if (options.includeShowcase && family === 'fullstack') {
    await writeGeneratedFile(destinationDir, 'SHOWCASE.mdx', buildShowcaseMdx(options))
    generatedFiles.push('SHOWCASE.mdx')
  }

  // Project README
  await writeGeneratedFile(destinationDir, 'README.md', buildReadme(options))
  generatedFiles.push('README.md')

  await writeGeneratedFile(destinationDir, '.gitignore', renderGitignore(options))
  generatedFiles.push('.gitignore')

  // Deployment guide (config-aware: adapts to backend/database/docker)
  if (options.deployment !== 'none') {
    await writeGeneratedFile(destinationDir, 'docs/deployment.md', renderDeploymentGuide(options))
    generatedFiles.push('docs/deployment.md')
  }

  if (options.initializeGit) {
    tryCommand(['git', 'init', '-b', 'main'], { cwd: destinationDir })
  }

  if (options.installDependencies && !dryRun && family !== 'rust') {
    runCommand(pmInstallParts(pm), { cwd: destinationDir })
  }

  return {
    destinationDir,
    packageName,
    cleanupTargets: familySupportsTemplateCleanup(family) ? cleanupTargets : [],
    generatedFiles,
  }
}
