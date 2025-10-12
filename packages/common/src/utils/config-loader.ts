import { backendLogger } from './logger'

class ConfigLoader<T extends Record<string, any>> {
  private static instanceMap = new Map<string, ConfigLoader<any>>()
  private config: T

  private constructor(schema: { [K in keyof T]: () => T[K] }) {
    this.config = Object.keys(schema).reduce((acc, key) => {
      acc[key as keyof T] = schema[key as keyof T]()
      return acc
    }, {} as T)
  }

  public static getInstance<T extends Record<string, any>>(
    schema: { [K in keyof T]: () => T[K] },
    key: string = 'default', // optional identifier for multi-config support
  ): ConfigLoader<T> {
    if (!ConfigLoader.instanceMap.has(key)) {
      ConfigLoader.instanceMap.set(key, new ConfigLoader(schema))
    }
    return ConfigLoader.instanceMap.get(key) as ConfigLoader<T>
  }

  public getConfig<K extends keyof T>(key: K): T[K] {
    return this.config[key]
  }

  public validate(requiredKeys: (keyof T)[]): void {
    const errors: string[] = []
    requiredKeys.forEach((key) => {
      const value = this.config[key]
      if (value === undefined || value === null) {
        errors.push(`${String(key)} is required but not provided`)
      }
    })
    if (errors.length > 0) {
      const notAvailableENVs = errors.reduce((prev, curr) => (prev = `${prev} \n ${curr}`), '')

      backendLogger.error(
        `Configuration validation failed:\n Configuration keys ${notAvailableENVs}`,
      )
      process.exit(1)
    }
  }

  public validateAll(): void {
    this.validate(Object.keys(this.config) as (keyof T)[])
  }

  public getAllConfigs(): T {
    return this.config
  }
}

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

const clientConfigSchema = {
  appUrl: () => process.env.NEXT_PUBLIC_APP_URL,
  apiBaseUrl: () => process.env.NEXT_PUBLIC_API_URL,
  jwtSecret: () => process.env.JWT_SECRET,
  databaseUrl: () => process.env.DATABASE_URL,
  nodeEnv: () => process.env.NODE_ENV || 'development',
}

export const backendConfig = ConfigLoader.getInstance(backendConfigSchema, 'server')
export const workerConfig = ConfigLoader.getInstance(workerConfigSchema, 'worker')
export const clientConfig = ConfigLoader.getInstance(clientConfigSchema, 'client')
