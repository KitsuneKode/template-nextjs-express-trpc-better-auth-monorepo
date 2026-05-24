import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { ProjectConfig } from '../../types/schemas'
import { renderPnpmWorkspaceYaml } from './pnpm'

export const DEFAULT_WORKSPACE_CATALOG: Record<string, string> = {
  '@types/bun': '1.3.14',
  '@types/node': '^25.9.0',
  oxlint: '^1.65.0',
  oxfmt: '^0.50.0',
  turbo: '^2.9.14',
  typescript: '^6.0.3',
  zod: '^4.4.3',
}

const DEFAULT_TOOLCHAIN = {
  bun: '1.3.11',
  node: '24.13.1',
  pnpm: '10.12.1',
} as const

type JsonPackage = {
  packageManager?: string
  workspaces?: string[] | { packages: string[]; catalog?: Record<string, string> }
  engines?: Record<string, string>
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

function normalizeTurboScripts(scripts: Record<string, string> | undefined): void {
  if (!scripts) return

  for (const [name, command] of Object.entries(scripts)) {
    const filtered = /^turbo -F ([^ ]+) ([^ ]+)(.*)$/.exec(command)
    if (filtered) {
      scripts[name] = `turbo run ${filtered[2]} --filter=${filtered[1]}${filtered[3]}`
      continue
    }

    const task = /^turbo (db:[^ ]+)$/.exec(command)
    if (task) scripts[name] = `turbo run ${task[1]}`
  }
}

function applyCatalogReferences(pkg: JsonPackage): void {
  for (const group of [pkg.dependencies, pkg.devDependencies, pkg.peerDependencies]) {
    if (!group) continue
    for (const dependency of Object.keys(DEFAULT_WORKSPACE_CATALOG)) {
      if (group[dependency] && !group[dependency].startsWith('workspace:')) {
        group[dependency] = 'catalog:'
      }
    }
  }
}

async function updatePackageJsonFiles(directory: string): Promise<void> {
  for (const entry of await readdir(directory)) {
    if (entry === 'node_modules' || entry === '.git') continue
    const filePath = join(directory, entry)
    const info = await stat(filePath)

    if (info.isDirectory()) {
      await updatePackageJsonFiles(filePath)
      continue
    }
    if (entry !== 'package.json') continue

    const pkg = JSON.parse(await readFile(filePath, 'utf8')) as JsonPackage
    applyCatalogReferences(pkg)
    await writeFile(filePath, JSON.stringify(pkg, null, 2) + '\n')
  }
}

async function directoryExists(directory: string): Promise<boolean> {
  try {
    return (await stat(directory)).isDirectory()
  } catch {
    return false
  }
}

async function workspacePackages(destinationDir: string, root: JsonPackage): Promise<string[]> {
  const packages = Array.isArray(root.workspaces)
    ? root.workspaces
    : (root.workspaces?.packages ?? ['apps/*', 'packages/*', 'toolings/*'])

  if (
    (await directoryExists(join(destinationDir, 'services'))) &&
    !packages.includes('services/*')
  ) {
    return [...packages, 'services/*']
  }

  return packages
}

export async function applyJavaScriptPackageManagerFoundation(
  destinationDir: string,
  packageManager: ProjectConfig['packageManager'],
  monorepo: boolean,
): Promise<string[]> {
  if (packageManager === 'npm') return []

  const packageJsonPath = join(destinationDir, 'package.json')
  const root = JSON.parse(await readFile(packageJsonPath, 'utf8')) as JsonPackage
  normalizeTurboScripts(root.scripts)
  root.engines = {
    ...root.engines,
    bun: `^${DEFAULT_TOOLCHAIN.bun}`,
    node: `^${DEFAULT_TOOLCHAIN.node}`,
  }

  const generatedFiles: string[] = []
  if (!monorepo) {
    root.packageManager =
      packageManager === 'bun' ? `bun@${DEFAULT_TOOLCHAIN.bun}` : `pnpm@${DEFAULT_TOOLCHAIN.pnpm}`
    if (packageManager === 'pnpm' && root.scripts?.preinstall?.includes('only-allow bun')) {
      delete root.scripts.preinstall
    }
    await writeFile(packageJsonPath, JSON.stringify(root, null, 2) + '\n')
    return generatedFiles
  }

  const packages = await workspacePackages(destinationDir, root)

  if (packageManager === 'bun') {
    root.workspaces = { packages, catalog: DEFAULT_WORKSPACE_CATALOG }
    root.packageManager = `bun@${DEFAULT_TOOLCHAIN.bun}`
  } else {
    delete root.workspaces
    if (root.scripts?.preinstall?.includes('only-allow bun')) {
      delete root.scripts.preinstall
    }
    root.packageManager = `pnpm@${DEFAULT_TOOLCHAIN.pnpm}`
    await writeFile(
      join(destinationDir, 'pnpm-workspace.yaml'),
      renderPnpmWorkspaceYaml({ packages, catalog: DEFAULT_WORKSPACE_CATALOG }),
    )
    generatedFiles.push('pnpm-workspace.yaml')
  }

  applyCatalogReferences(root)
  await writeFile(packageJsonPath, JSON.stringify(root, null, 2) + '\n')
  await updatePackageJsonFiles(destinationDir)

  return generatedFiles
}
