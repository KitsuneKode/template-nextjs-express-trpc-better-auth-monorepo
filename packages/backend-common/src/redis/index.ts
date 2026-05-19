import IORedis from 'ioredis'
import { backendConfig, workerConfig } from '../utils/config'

type ServiceType = 'server' | 'worker'

const getRedisUrl = (service: ServiceType): string => {
  if (service === 'worker') return workerConfig.REDIS_URL
  return backendConfig.REDIS_URL
}

/** Lifecycle Redis handle for server/worker boot. BullMQ uses `@template/backend-common/redis/bull`. */
export type AppRedisClient = {
  connect(): Promise<void>
  close(): Promise<void>
}

export const redisClient = (service: ServiceType): AppRedisClient => {
  const client = new IORedis(getRedisUrl(service), { lazyConnect: true })

  return {
    async connect() {
      await client.connect()
    },
    async close() {
      await client.quit()
    },
  }
}
