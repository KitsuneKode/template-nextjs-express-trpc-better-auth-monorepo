import { renderTurboRootScripts } from './turbo'

export interface BunRootPackageJsonOptions {
  name: string
  packages: string[]
  catalog: Record<string, string>
  bunVersion: string
  nodeVersion: string
}

export function renderBunRootPackageJson(options: BunRootPackageJsonOptions) {
  return {
    name: options.name,
    private: true,
    type: 'module',
    workspaces: {
      packages: options.packages,
      catalog: options.catalog,
    },
    scripts: renderTurboRootScripts(),
    engines: {
      bun: `^${options.bunVersion}`,
      node: `^${options.nodeVersion}`,
    },
    packageManager: `bun@${options.bunVersion}`,
  }
}
