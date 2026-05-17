/**
 * Server startup script
 *
 * Handles environment validation, graceful shutdown, and cluster management.
 */

import app from './app'
import { config } from './utils/config'
import { logger } from './utils/logger'
import { validateEnvironment } from '@template/backend-common/validate-env'
import { setupGracefulShutdown, onShutdown } from '@template/backend-common/graceful-shutdown'
import { prisma } from '@template/store'
import { redis } from './lib/redis'

// Validate environment on startup
validateEnvironment('server')

const PORT = config.PORT

const server = app.listen(PORT, () => {
  logger.info({
    port: PORT,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// Register shutdown callbacks
onShutdown(async () => {
  logger.info('Closing Prisma connection...')
  await prisma.$disconnect()
})

onShutdown(async () => {
  logger.info('Closing Redis connection...')
  await redis.close()
})

// Setup graceful shutdown
setupGracefulShutdown(server)
