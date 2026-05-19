/**
 * Server startup script
 *
 * Handles environment validation, graceful shutdown, and cluster management.
 */

import { setupGracefulShutdown, onShutdown } from '@template/backend-common/graceful-shutdown'
import { validateEnvironment } from '@template/backend-common/validate-env'
import app from './app'
import { env } from './common/env'
import { logger } from './common/logger'
import { prisma } from './db/index.js'
import { connectRedis, redis } from './db/redis.js'

validateEnvironment('server')

const PORT = env.PORT
const HOST = process.env.HOST ?? '0.0.0.0'

await connectRedis()

const server = app.listen(PORT, HOST, () => {
  logger.info({
    host: HOST,
    port: PORT,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

onShutdown(async () => {
  logger.info('Closing Prisma connection...')
  await prisma.$disconnect()
})

onShutdown(async () => {
  logger.info('Closing Redis connection...')
  await redis.close()
})

setupGracefulShutdown(server)
