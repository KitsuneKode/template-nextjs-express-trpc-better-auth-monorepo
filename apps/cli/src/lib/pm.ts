import type { PackageManager } from '../types/schemas'

export type PmCommand = 'run' | 'install' | 'exec' | 'add' | 'remove'

const PM_MAP: Record<PackageManager, Record<PmCommand, string>> = {
  bun: {
    run: 'bun run',
    install: 'bun install',
    exec: 'bunx',
    add: 'bun add',
    remove: 'bun remove',
  },
  pnpm: {
    run: 'pnpm',
    install: 'pnpm install',
    exec: 'pnpm dlx',
    add: 'pnpm add',
    remove: 'pnpm remove',
  },
  npm: {
    run: 'npm run',
    install: 'npm install',
    exec: 'npx',
    add: 'npm install',
    remove: 'npm uninstall',
  },
}

export function pmCmd(pm: PackageManager, command: PmCommand): string {
  return PM_MAP[pm][command]
}

export function pmRun(pm: PackageManager, script: string): string {
  const runner = PM_MAP[pm].run
  return `${runner} ${script}`
}

export function pmInstall(pm: PackageManager): string {
  return PM_MAP[pm].install
}

export function pmExec(pm: PackageManager, pkg: string): string {
  const executor = PM_MAP[pm].exec
  return `${executor} ${pkg}`
}

export function pmExecParts(pm: PackageManager): string[] {
  return PM_MAP[pm].exec.split(' ')
}

export function pmInstallParts(pm: PackageManager): string[] {
  return PM_MAP[pm].install.split(' ')
}

/** Return a package-manager-aware script override map given the base bun scripts */
export function adaptScripts(
  scripts: Record<string, string>,
  pm: PackageManager,
): Record<string, string> {
  if (pm === 'bun') return scripts

  const execBin = pmExec(pm, '').trim().split(' ')[0] || 'npx'
  const runCmd = pmRun(pm, '').trim()
  const installCmd = pmInstall(pm)

  const adapted: Record<string, string> = {}
  for (const [key, value] of Object.entries(scripts)) {
    let script = value
    script = script.replace(/\bbunx\b/g, execBin)
    script = script.replace(/\bbun run\b/g, runCmd)
    script = script.replace(/^bun\s+install/gm, installCmd)
    adapted[key] = script
  }
  return adapted
}
