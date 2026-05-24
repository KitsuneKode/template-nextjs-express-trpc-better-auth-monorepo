import { describe, expect, it } from 'bun:test'
import { renderBunRootPackageJson } from '../src/render/workspace/bun'
import { renderPnpmRootPackageJson, renderPnpmWorkspaceYaml } from '../src/render/workspace/pnpm'
import { renderTurboRootScripts } from '../src/render/workspace/turbo'

const catalog = {
  typescript: '^5.7.3',
  turbo: '^2.3.3',
  vitest: '^4.0.0',
  '@types/node': '^24.10.13',
  '@types/bun': '^1.3.11',
}

describe('workspace renderers', () => {
  it('renders Bun-native workspaces and catalogs', () => {
    const pkg = renderBunRootPackageJson({
      name: 'acme',
      packages: ['apps/*', 'packages/*', 'tooling/*'],
      catalog,
      bunVersion: '1.3.11',
      nodeVersion: '24.13.1',
    })

    expect(pkg.packageManager).toBe('bun@1.3.11')
    expect(pkg.workspaces.packages).toContain('apps/*')
    expect(pkg.workspaces.catalog.typescript).toBe('^5.7.3')
    expect(pkg.engines).toEqual({ bun: '^1.3.11', node: '^24.13.1' })
  })

  it('renders pnpm-native workspace catalogs and root metadata', () => {
    const yaml = renderPnpmWorkspaceYaml({
      packages: ['apps/*', 'packages/*', 'tooling/*'],
      catalog,
    })
    const pkg = renderPnpmRootPackageJson({
      name: 'acme',
      pnpmVersion: '10.12.1',
      bunVersion: '1.3.11',
      nodeVersion: '24.13.1',
    })

    expect(yaml).toContain('packages:')
    expect(yaml).toContain('  - apps/*')
    expect(yaml).toContain('catalog:')
    expect(yaml).toContain('  typescript: ^5.7.3')
    expect(yaml).toContain('  "@types/node": ^24.10.13')
    expect(pkg.packageManager).toBe('pnpm@10.12.1')
    expect(pkg.engines).toEqual({ bun: '^1.3.11', node: '^24.13.1' })
  })

  it('uses turbo run in root scripts', () => {
    expect(renderTurboRootScripts()).toEqual({
      dev: 'turbo run dev',
      build: 'turbo run build',
      typecheck: 'turbo run typecheck',
      lint: 'turbo run lint',
      test: 'turbo run test',
      fmt: 'oxfmt',
      'fmt:check': 'oxfmt --check',
    })
  })
})
