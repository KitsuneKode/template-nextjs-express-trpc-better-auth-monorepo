import {
  ConfigLoader,
  readEnvEnum,
  readEnvNumber,
  readEnvString,
  readEnvUrl,
} from '@template/common/config-loader'
import { backendLogger, workerLogger } from './logger'

const NODE_ENVS = ['development', 'test', 'production'] as const

const workerConfigSchema = {
  databaseUrl: () => readEnvString('DATABASE_URL'),
  nodeEnv: () => readEnvEnum('NODE_ENV', NODE_ENVS, { defaultValue: 'development' }),
  redisUrl: () => readEnvUrl('REDIS_URL'),
}

const backendConfigSchema = {
  port: () => readEnvNumber('PORT', { defaultValue: 8080, integer: true, min: 1, max: 65535 }),
  frontendUrl: () => readEnvUrl('FRONTEND_URL'),
  databaseUrl: () => readEnvString('DATABASE_URL'),
  nodeEnv: () => readEnvEnum('NODE_ENV', NODE_ENVS, { defaultValue: 'development' }),
  redisUrl: () => readEnvUrl('REDIS_URL'),
  betterAuthUrl: () => readEnvUrl('BETTER_AUTH_URL'),
  betterAuthSecret: () => readEnvString('BETTER_AUTH_SECRET'),
}

export const backendConfig = ConfigLoader.getInstance(backendConfigSchema, {
  key: 'server',
  logger: backendLogger,
})
export const workerConfig = ConfigLoader.getInstance(workerConfigSchema, {
  key: 'worker',
  logger: workerLogger,
})
