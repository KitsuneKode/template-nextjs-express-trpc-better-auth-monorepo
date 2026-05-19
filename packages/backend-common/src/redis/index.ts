import IORedis from 'ioredis'
import { resolveRedisUrl } from '../utils/redis-enabled'

/** Lifecycle Redis handle for server/worker boot. BullMQ uses `@template/backend-common/redis/bull`. */
export type AppRedisClient = {
  connect(): Promise<void>
  close(): Promise<void>
}

export const redisClient = (): AppRedisClient => {
  const url = resolveRedisUrl()
  if (!url) {
    throw new Error('REDIS_URL is not configured (set REDIS_URL or ENABLE_REDIS=false)')
  }

  const client = new IORedis(url, { lazyConnect: true })

  return {
    async connect() {
      await client.connect()
    },
    async close() {
      await client.quit()
    },
  }
}
