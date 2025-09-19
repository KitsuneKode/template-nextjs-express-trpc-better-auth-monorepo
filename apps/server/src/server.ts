import os from 'os'
import app from '@/app'
import cluster from 'cluster'
import config from '@/utils/config'
import { logger } from '@/utils/logger'

try {
  config.validate([
    'jwtSecret',
    'port',
    'frontendUrl',
    'databaseUrl',
    'betterAuthSecret',
    'betterAuthUrl',
  ])
} catch (error) {
  logger.error('Configuration validation failed:', error)
  process.exit(1)
}

const port = config.getConfig('port')

const numCPUs =
  config.getConfig('nodeEnv') === 'development' ? 3 : os.cpus().length

if (cluster.isPrimary) {
  logger.info(`Master process ${process.pid} is running`)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(
      `Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}, Restarting...`,
    )
    cluster.fork()
  })
} else {
  const server = app.listen(port, (err) => {
    if (err) {
      logger.error(`Worker ${process.pid} failed to start server:`, err)
      process.exit(1)
    } else {
      logger.info(`Worker ${process.pid} started server on port ${port}`)
    }
  })

  const gracefulShutdown = () => {
    console.log(
      `Worker ${process.pid} received shutdown signal. Shutting down gracefully...`,
    )
    server.close(() => {
      console.log(`Worker ${process.pid} closed.`)
      process.exit(0)
    })

    setTimeout(() => {
      console.error(
        `Worker ${process.pid} forced to exit after shutdown timeout.`,
      )
      process.exit(1)
    }, 10000)
  }

  process.on('SIGINT', gracefulShutdown)
  process.on('SIGTERM', gracefulShutdown)
}
