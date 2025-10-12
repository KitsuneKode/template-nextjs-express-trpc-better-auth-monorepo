import { ConfigLoader } from '@template/common/config-loader'
import { backendLogger, workerLogger } from './logger'

const workerConfigSchema = {
  jwtSecret: () => process.env.JWT_SECRET,
  databaseUrl: () => process.env.DATABASE_URL,
  nodeEnv: () => process.env.NODE_ENV || 'development',
  redisUrl: () => process.env.REDIS_URL,
}

const backendConfigSchema = {
  jwtSecret: () => process.env.JWT_SECRET,
  port: () => Number(process.env.PORT),
  frontendUrl: () => process.env.FRONTEND_URL,
  databaseUrl: () => process.env.DATABASE_URL,
  nodeEnv: () => process.env.NODE_ENV || 'development',
  redisUrl: () => process.env.REDIS_URL,
  betterAuthUrl: () => process.env.BETTER_AUTH_URL,
  betterAuthSecret: () => process.env.BETTER_AUTH_SECRET,
}

export const backendConfig = ConfigLoader.getInstance(backendConfigSchema, 'server', backendLogger)
export const workerConfig = ConfigLoader.getInstance(workerConfigSchema, 'worker', workerLogger)
