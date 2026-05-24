import { renderTurboRootScripts } from './turbo'

export interface PnpmWorkspaceYamlOptions {
  packages: string[]
  catalog: Record<string, string>
}

export interface PnpmRootPackageJsonOptions {
  name: string
  pnpmVersion: string
  bunVersion: string
  nodeVersion: string
}

function quoteYamlKey(key: string): string {
  return key.startsWith('@') ? `"${key}"` : key
}

export function renderPnpmWorkspaceYaml(options: PnpmWorkspaceYamlOptions): string {
  const packageLines = options.packages.map((pattern) => `  - ${pattern}`)
  const catalogLines = Object.entries(options.catalog).map(
    ([name, version]) => `  ${quoteYamlKey(name)}: ${version}`,
  )

  return ['packages:', ...packageLines, '', 'catalog:', ...catalogLines, ''].join('\n')
}

export function renderPnpmRootPackageJson(options: PnpmRootPackageJsonOptions) {
  return {
    name: options.name,
    private: true,
    type: 'module',
    scripts: renderTurboRootScripts(),
    engines: {
      bun: `^${options.bunVersion}`,
      node: `^${options.nodeVersion}`,
    },
    packageManager: `pnpm@${options.pnpmVersion}`,
  }
}
