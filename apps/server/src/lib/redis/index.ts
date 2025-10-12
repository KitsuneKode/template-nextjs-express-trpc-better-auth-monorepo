import { redisClient } from '@template/backend-common/redis'

export const redis = redisClient('server')

await redis.connect()
