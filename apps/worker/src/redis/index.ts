import { redisClient } from '@template/backend-common/redis'

export const redis = redisClient('worker')

await redis.connect()
