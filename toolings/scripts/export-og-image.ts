#!/usr/bin/env bun
/**
 * Regenerate apps/web/public/brand/og-image.png from the dynamic /opengraph-image route.
 * Requires a production build of the web app.
 */
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dir, '../..')
const WEB_ROOT = join(ROOT, 'apps/web')
const OUTPUT = join(WEB_ROOT, 'public/brand/og-image.png')
const PORT = 3199
const BASE_URL = `http://127.0.0.1:${PORT}`

const webEnv: Record<string, string> = {
  ...process.env,
  NODE_ENV: 'production',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? BASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? BASE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Arche',
  NEXT_PUBLIC_SITE_DESCRIPTION:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? 'Personal scaffold CLI and project vault',
}

function run(command: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command[0]!, command.slice(1), {
      cwd,
      env: webEnv,
      stdio: 'inherit',
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command.join(' ')} exited with code ${code ?? 1}`))
    })
  })
}

async function waitForServer(url: string, attempts = 60): Promise<void> {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) })
      if (res.ok) return
    } catch {
      // retry
    }
    await Bun.sleep(500)
  }
  throw new Error(`Timed out waiting for ${url}`)
}

async function main(): Promise<void> {
  console.log('Building web app...')
  await run(['bun', 'run', 'build'], WEB_ROOT)

  console.log(`Starting Next.js on ${BASE_URL}...`)
  const server = spawn('bun', ['run', 'start', '--', '-p', String(PORT)], {
    cwd: WEB_ROOT,
    env: webEnv,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  const killServer = () => {
    if (!server.killed) server.kill('SIGTERM')
  }
  process.on('exit', killServer)
  process.on('SIGINT', () => {
    killServer()
    process.exit(130)
  })

  try {
    await waitForServer(`${BASE_URL}/opengraph-image`)
    const res = await fetch(`${BASE_URL}/opengraph-image`)
    if (!res.ok) {
      throw new Error(`opengraph-image returned ${res.status}`)
    }
    const bytes = await res.arrayBuffer()
    writeFileSync(OUTPUT, Buffer.from(bytes))
    console.log(`Wrote ${OUTPUT} (${bytes.byteLength} bytes)`)
  } finally {
    killServer()
  }
}

if (import.meta.main) {
  await main()
}
