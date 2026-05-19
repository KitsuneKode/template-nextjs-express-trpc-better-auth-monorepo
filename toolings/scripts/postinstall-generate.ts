/**
 * Root postinstall: generate Prisma client after install.
 * Skipped in Docker/CI (SKIP_POSTINSTALL=1) — the image runs db:generate in the builder stage.
 */
if (process.env.SKIP_POSTINSTALL === '1') {
  process.exit(0)
}

const proc = Bun.spawnSync({
  cmd: ['bun', 'run', 'db:generate'],
  stdout: 'inherit',
  stderr: 'inherit',
  stdin: 'inherit',
  env: process.env,
})

process.exit(proc.exitCode ?? 1)
