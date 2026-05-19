/**
 * BullMQ-compatible Redis connection factory.
 */

import IORedis from 'ioredis'
import { resolveRedisUrl } from '../utils/redis-enabled'

let bullConnection: IORedis | null = null

export function getBullConnection(): IORedis {
  if (bullConnection) return bullConnection

  const url = resolveRedisUrl()
  if (!url) {
    throw new Error('BullMQ requires REDIS_URL (queues are disabled when ENABLE_REDIS=false)')
  }

  bullConnection = new IORedis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  })

  return bullConnection
}

/** Separate connection for worker processes. */
export function createWorkerBullConnection(): IORedis {
  const url = resolveRedisUrl()
  if (!url) {
    throw new Error('Worker requires REDIS_URL')
  }

  return new IORedis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  })
}
