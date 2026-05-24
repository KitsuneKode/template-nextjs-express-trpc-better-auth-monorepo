#!/usr/bin/env bun
import { spawnSync } from 'node:child_process'

function run(command: string[]): void {
  const [binary, ...args] = command
  if (!binary) throw new Error('release command cannot be empty')

  const result = spawnSync(binary, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.error) {
    throw result.error
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (process.env.NPM_TRUSTED_PUBLISHING_ENABLED !== 'true') {
  console.log(
    'Skipping npm publish: set NPM_TRUSTED_PUBLISHING_ENABLED=true after configuring npm Trusted Publishing.',
  )
  process.exit(0)
}

run(['bun', 'run', 'pkg:check'])
run(['bun', 'run', 'release:publish'])
