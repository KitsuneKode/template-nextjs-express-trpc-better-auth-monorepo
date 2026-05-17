/**
 * BullMQ-compatible Redis connection factory.
 *
 * BullMQ requires an ioredis-compatible connection. This module wraps
 * the shared Redis configuration into an IORedis instance for BullMQ.
 */

import IORedis from 'ioredis'
import { backendConfig, workerConfig } from '../utils/config'

let bullConnection: IORedis | null = null

export function getBullConnection(): IORedis {
  if (bullConnection) return bullConnection

  const url = backendConfig.REDIS_URL || 'redis://localhost:6379'

  bullConnection = new IORedis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  })

  return bullConnection
}

/**
 * Creates a separate connection for worker processes.
 * Workers should use this to avoid sharing event loop with the server.
 */
export function createWorkerBullConnection(): IORedis {
  const url = workerConfig.REDIS_URL || 'redis://localhost:6379'

  return new IORedis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  })
}
