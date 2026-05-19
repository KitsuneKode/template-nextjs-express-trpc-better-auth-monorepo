import { redisClient } from '@template/backend-common/redis'

export const redis = redisClient()

await redis.connect()
