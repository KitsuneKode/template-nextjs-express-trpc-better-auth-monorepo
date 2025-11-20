#!/usr/bin/env bun
import { join } from 'path'

// --- CONFIGURATION ---
const CONFIG = {
  oldScope: '@template',
  extensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx', 'json'],
  ignore: ['node_modules', '.git', '.turbo', 'dist', '.next', 'build', 'out'],
  dryRun: process.argv.includes('--dry-run') || process.argv.includes('-d'),
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
  quiet: process.argv.includes('--quiet') || process.argv.includes('-q'),
}

// --- TYPES ---
interface ChangeMetrics {
  packageJsonFiles: string[]
  sourceFiles: string[]
  packagesRenamed: Map<string, string>
  dependenciesUpdated: Map<string, string[]>
  totalReplacements: number
}

// --- UTILITIES ---
const log = {
  info: (msg: string) => !CONFIG.quiet && console.log(`ℹ️  ${msg}`),
  success: (msg: string) => console.log(`✅ ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
  warning: (msg: string) => console.warn(`⚠️  ${msg}`),
  update: (msg: string) => CONFIG.verbose && console.log(`📝 ${msg}`),
  debug: (msg: string) => CONFIG.verbose && console.log(`🔍 ${msg}`),
  metric: (msg: string) => console.log(`📊 ${msg}`),
}

function shouldIgnore(path: string): boolean {
  return CONFIG.ignore.some((dir) => path.includes(`/${dir}/`) || path.startsWith(`${dir}/`))
}

async function readJson(path: string): Promise<Record<string, unknown>> {
  const file = Bun.file(path)
  if (!(await file.exists())) {
    throw new Error(`File not found: ${path}`)
  }
  return file.json()
}

async function writeJson(path: string, data: Record<string, unknown>): Promise<void> {
  await Bun.write(path, JSON.stringify(data, null, 2) + '\n')
}

// --- STEP 1: Detect Root Name & Generate New Scope ---
async function detectNewScope(): Promise<string> {
  const rootPackagePath = join(process.cwd(), 'package.json')
  const rootJson = await readJson(rootPackagePath)
  const rootName = rootJson.name as string | undefined

  if (!rootName || typeof rootName !== 'string') {
    throw new Error('Root package.json does not have a valid "name" field')
  }

  // Construct the new scope: prefix with @ if not already present
  return rootName.startsWith('@') ? rootName : `@${rootName}`
}

// --- STEP 2: Update package.json Files ---
async function updatePackageJsonFiles(
  oldScope: string,
  newScope: string,
  metrics: ChangeMetrics,
): Promise<void> {
  const jsonGlob = new Bun.Glob('**/package.json')

  for await (const filePath of jsonGlob.scan('.')) {
    if (shouldIgnore(filePath)) continue

    const json = await readJson(filePath)
    let isModified = false
    const depsUpdated: string[] = []

    // 1. Rename the package itself
    if (typeof json.name === 'string' && json.name.startsWith(`${oldScope}/`)) {
      const oldName = json.name
      json.name = json.name.replace(oldScope, newScope)
      metrics.packagesRenamed.set(oldName, json.name as string)
      log.debug(`Package renamed: ${oldName} → ${json.name}`)
      isModified = true
    }

    // 2. Rename dependencies in all dependency fields
    const depFields = ['dependencies', 'devDependencies', 'peerDependencies'] as const

    for (const depType of depFields) {
      const deps = json[depType]
      if (!deps || typeof deps !== 'object') continue

      const depsObj = deps as Record<string, string>
      for (const dep of Object.keys(depsObj)) {
        if (dep.startsWith(`${oldScope}/`)) {
          const newDepName = dep.replace(oldScope, newScope)
          depsObj[newDepName] = depsObj[dep] ?? ''
          delete depsObj[dep]
          depsUpdated.push(`${dep} → ${newDepName}`)
          isModified = true
        }
      }
    }

    if (isModified) {
      if (!CONFIG.dryRun) {
        await writeJson(filePath, json)
      }
      metrics.packageJsonFiles.push(filePath)
      if (depsUpdated.length > 0) {
        metrics.dependenciesUpdated.set(filePath, depsUpdated)
      }
      log.update(`${CONFIG.dryRun ? '[DRY RUN] ' : ''}Updated: ${filePath}`)
    }
  }
}

// --- STEP 3: Update Source Code Imports ---
async function updateSourceFiles(
  oldScope: string,
  newScope: string,
  metrics: ChangeMetrics,
): Promise<void> {
  const extPattern = `**/*.{${CONFIG.extensions.join(',')}}`
  const sourceGlob = new Bun.Glob(extPattern)

  for await (const filePath of sourceGlob.scan('.')) {
    if (shouldIgnore(filePath) || filePath.endsWith('package.json')) continue

    const file = Bun.file(filePath)
    const text = await file.text()

    // Count and replace occurrences
    if (text.includes(oldScope)) {
      const occurrences = (text.match(new RegExp(oldScope, 'g')) || []).length
      const newText = text.replaceAll(oldScope, newScope)

      if (!CONFIG.dryRun) {
        await Bun.write(filePath, newText)
      }

      metrics.sourceFiles.push(filePath)
      metrics.totalReplacements += occurrences
      log.update(
        `${CONFIG.dryRun ? '[DRY RUN] ' : ''}Updated: ${filePath} (${occurrences} replacement${occurrences > 1 ? 's' : ''})`,
      )
    }
  }
}

// --- METRICS & REPORTING ---
function printMetrics(metrics: ChangeMetrics, oldScope: string, newScope: string): void {
  console.log('')
  console.log('═'.repeat(60))
  log.metric('Change Summary')
  console.log('═'.repeat(60))

  // Overview
  const totalFiles = metrics.packageJsonFiles.length + metrics.sourceFiles.length
  if (totalFiles === 0) {
    log.success(`No changes needed - project already uses "${newScope}"`)
    console.log('')
    log.info('Your project is already configured with the correct scope.')
    return
  }

  log.metric(`Migration: "${oldScope}" → "${newScope}"`)
  console.log('')

  // Package.json changes
  if (metrics.packageJsonFiles.length > 0) {
    log.metric(`📦 Package Metadata (${metrics.packageJsonFiles.length} files)`)
    if (CONFIG.verbose) {
      metrics.packageJsonFiles.forEach((file) => console.log(`   • ${file}`))
    } else {
      console.log(`   Modified ${metrics.packageJsonFiles.length} package.json file(s)`)
    }
    console.log('')
  }

  // Packages renamed
  if (metrics.packagesRenamed.size > 0) {
    log.metric(`🏷️  Packages Renamed (${metrics.packagesRenamed.size})`)
    if (CONFIG.verbose) {
      metrics.packagesRenamed.forEach((newName, oldName) => {
        console.log(`   • ${oldName} → ${newName}`)
      })
    } else {
      console.log(`   Renamed ${metrics.packagesRenamed.size} package(s)`)
    }
    console.log('')
  }

  // Dependencies updated
  if (metrics.dependenciesUpdated.size > 0) {
    const totalDeps = Array.from(metrics.dependenciesUpdated.values()).reduce(
      (sum, deps) => sum + deps.length,
      0,
    )
    log.metric(`🔗 Dependencies Updated (${totalDeps} references)`)
    if (CONFIG.verbose) {
      metrics.dependenciesUpdated.forEach((deps, file) => {
        console.log(`   ${file}:`)
        deps.forEach((dep) => console.log(`      • ${dep}`))
      })
    } else {
      console.log(`   Updated ${totalDeps} dependency reference(s)`)
    }
    console.log('')
  }

  // Source files
  if (metrics.sourceFiles.length > 0) {
    log.metric(
      `📝 Source Files (${metrics.sourceFiles.length} files, ${metrics.totalReplacements} replacements)`,
    )
    if (CONFIG.verbose) {
      metrics.sourceFiles.forEach((file) => console.log(`   • ${file}`))
    } else {
      console.log(`   Modified ${metrics.sourceFiles.length} source file(s)`)
      console.log(`   Replaced ${metrics.totalReplacements} import reference(s)`)
    }
    console.log('')
  }

  console.log('═'.repeat(60))
}

// --- MAIN EXECUTION ---
async function main() {
  try {
    // Show help
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
      console.log(`
Usage: bun rename-scope.ts [options]

Renames package scope from "${CONFIG.oldScope}" to match root package name.

Options:
  -d, --dry-run    Preview changes without modifying files
  -v, --verbose    Show detailed logs of all changes
  -q, --quiet      Minimal output (errors and summary only)
  -h, --help       Show this help message

Examples:
  bun rename-scope.ts --dry-run    # Preview changes
  bun rename-scope.ts --verbose    # Apply with detailed logs
  bun rename-scope.ts              # Apply changes
`)
      process.exit(0)
    }

    log.info(`Starting scope rename process...`)

    if (CONFIG.dryRun) {
      log.warning('Running in DRY RUN mode - no files will be modified')
    }

    // Initialize metrics
    const metrics: ChangeMetrics = {
      packageJsonFiles: [],
      sourceFiles: [],
      packagesRenamed: new Map(),
      dependenciesUpdated: new Map(),
      totalReplacements: 0,
    }

    // Step 1: Detect new scope
    const newScope = await detectNewScope()
    log.info(`Detected new scope: "${newScope}"`)

    if (CONFIG.oldScope === newScope) {
      console.log('')
      log.success(`Scope already correct: "${newScope}"`)
      log.info('No changes needed. Your project is already configured correctly.')
      process.exit(0)
    }

    log.info(`Migrating from "${CONFIG.oldScope}" to "${newScope}"...`)
    console.log('')

    // Step 2: Update package.json files
    log.info('Scanning package.json files...')
    await updatePackageJsonFiles(CONFIG.oldScope, newScope, metrics)

    // Step 3: Update source files
    log.info('Scanning source files...')
    await updateSourceFiles(CONFIG.oldScope, newScope, metrics)

    // Print metrics
    printMetrics(metrics, CONFIG.oldScope, newScope)

    // Final instructions
    const totalChanges = metrics.packageJsonFiles.length + metrics.sourceFiles.length
    if (totalChanges > 0) {
      if (CONFIG.dryRun) {
        log.success('Dry run completed!')
        log.info('To apply changes, run without --dry-run flag')
      } else {
        log.success('Successfully renamed scope!')
        console.log('')
        log.info('Next steps:')
        log.info('  1. Run "bun install" to link the renamed packages')
        log.info('  2. Run "bun run lint" to verify no issues')
        log.info('  3. Test your application')
        log.info('  4. Commit your changes')
      }
    }

    console.log('')
  } catch (error) {
    log.error(error instanceof Error ? error.message : String(error))
    if (CONFIG.verbose && error instanceof Error && error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

main()
