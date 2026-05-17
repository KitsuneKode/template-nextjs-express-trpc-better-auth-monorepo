import { RedisClient } from 'bun'
import { backendConfig, workerConfig } from '../utils/config'

type ServiceType = 'server' | 'worker'

const getEnvironment = (service: ServiceType) => {
  if (service == 'worker') {
    return workerConfig.REDIS_URL
  } else {
    return backendConfig.REDIS_URL
  }
}

export const redisClient = (service: ServiceType) => {
  const url = getEnvironment(service)
  return new RedisClient(url)
}
