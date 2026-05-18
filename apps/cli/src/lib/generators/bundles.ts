import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ProjectConfig } from '../../types/schemas'

function realtimeBundle(dest: string): string[] {
  const files: string[] = []
  const wsDir = join(dest, 'apps/server/src/ws')

  mkdirSync(wsDir, { recursive: true })
  writeFileSync(
    join(wsDir, 'handler.ts'),
    `import type { ServerWebSocket } from 'bun'

const clients = new Set<ServerWebSocket<unknown>>()

export function handleWsOpen(ws: ServerWebSocket<unknown>): void {
  clients.add(ws)
  ws.send(JSON.stringify({ type: 'connected', clientCount: clients.size }))
}

export function handleWsMessage(ws: ServerWebSocket<unknown>, message: string): void {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  }
}

export function handleWsClose(ws: ServerWebSocket<unknown>): void {
  clients.delete(ws)
}
`,
  )
  files.push('apps/server/src/ws/handler.ts')

  // Add tRPC subscription router
  const trpcDir = join(dest, 'packages/trpc/src/routers')
  mkdirSync(trpcDir, { recursive: true })
  writeFileSync(
    join(trpcDir, 'realtime.ts'),
    `import { publicProcedure } from '../trpc'
import type { TRPCRouterRecord } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { EventEmitter } from 'node:events'

const ee = new EventEmitter()

export const realtimeRouter = {
  onEvent: publicProcedure.subscription(() => {
    return observable<string>((emit) => {
      const handler = (data: string) => emit.next(data)
      ee.on('event', handler)
      return () => ee.off('event', handler)
    })
  }),
} satisfies TRPCRouterRecord
`,
  )
  files.push('packages/trpc/src/routers/realtime.ts')

  return files
}

function growthBundle(dest: string): string[] {
  const files: string[] = []

  const analyticsDir = join(dest, 'packages/analytics/src')
  mkdirSync(analyticsDir, { recursive: true })
  writeFileSync(
    join(analyticsDir, 'index.ts'),
    `export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'production') {
    // Connect to your analytics provider
    console.log('[analytics]', name, properties)
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  console.log('[analytics] identify', userId, traits)
}
`,
  )
  files.push('packages/analytics/src/index.ts')

  writeFileSync(
    join(analyticsDir, '../package.json'),
    JSON.stringify(
      {
        name: '@acme/analytics',
        private: true,
        type: 'module',
        main: './src/index.ts',
        scripts: { build: 'tsc', dev: 'tsc --watch' },
        devDependencies: { typescript: '^5' },
      },
      null,
      2,
    ) + '\n',
  )
  files.push('packages/analytics/package.json')

  return files
}

function infraBundle(dest: string): string[] {
  const files: string[] = []

  const monitorDir = join(dest, 'packages/monitoring/src')
  mkdirSync(monitorDir, { recursive: true })
  writeFileSync(
    join(monitorDir, 'index.ts'),
    `export function initMonitoring(): void {
  if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    // Initialize OpenTelemetry exporter
    console.log('[monitoring] OTEL configured')
  }
}

export function recordMetric(name: string, value: number, tags?: Record<string, string>): void {
  console.log('[metric]', name, value, tags)
}
`,
  )
  files.push('packages/monitoring/src/index.ts')

  writeFileSync(
    join(monitorDir, '../package.json'),
    JSON.stringify(
      {
        name: '@acme/monitoring',
        private: true,
        type: 'module',
        main: './src/index.ts',
        scripts: { build: 'tsc', dev: 'tsc --watch' },
        devDependencies: { typescript: '^5' },
      },
      null,
      2,
    ) + '\n',
  )
  files.push('packages/monitoring/package.json')

  return files
}

function aiBundle(dest: string): string[] {
  const files: string[] = []

  const aiDir = join(dest, 'packages/ai/src')
  mkdirSync(aiDir, { recursive: true })
  writeFileSync(
    join(aiDir, 'index.ts'),
    `import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export async function generate(prompt: string): Promise<string> {
  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
  })
  return text
}

export { openai, generateText }
`,
  )
  files.push('packages/ai/src/index.ts')

  writeFileSync(
    join(aiDir, '../package.json'),
    JSON.stringify(
      {
        name: '@acme/ai',
        private: true,
        type: 'module',
        main: './src/index.ts',
        scripts: { build: 'tsc', dev: 'tsc --watch' },
        dependencies: { ai: '^4.0.0', '@ai-sdk/openai': '^1.0.0' },
        devDependencies: { typescript: '^5' },
      },
      null,
      2,
    ) + '\n',
  )
  files.push('packages/ai/package.json')

  return files
}

const BUNDLE_HANDLERS: Record<string, (dest: string) => string[]> = {
  realtime: realtimeBundle,
  growth: growthBundle,
  infra: infraBundle,
  ai: aiBundle,
}

/** Apply bundle transforms — generate additive packages and configs */
export function applyBundleTransforms(destinationDir: string, config: ProjectConfig): string[] {
  const generated: string[] = []

  for (const bundle of config.bundles) {
    const handler = BUNDLE_HANDLERS[bundle]
    if (handler) {
      const files = handler(destinationDir)
      generated.push(...files)
    }
  }

  return generated
}
