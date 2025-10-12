import { backendConfig, workerConfig } from '../utils/config'
import { RedisClient } from 'bun'

type ServiceType = 'server' | 'worker'

const getEnvironment = (service: ServiceType) => {
  if (service == 'worker') {
    return workerConfig.getConfig('redisUrl')
  } else {
    return backendConfig.getConfig('redisUrl')
  }
}

export const redisClient = (service: ServiceType) => {
  const url = getEnvironment(service)
  return new RedisClient(url)
}
