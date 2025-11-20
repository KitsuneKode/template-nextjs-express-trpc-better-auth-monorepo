import { clientLogger, type LoggerType } from './client-logger'

export class ConfigLoader<T extends Record<string, unknown>> {
  private static instanceMap = new Map<string, ConfigLoader<Record<string, unknown>>>()
  private config: T
  private logger: LoggerType

  private constructor(schema: { [K in keyof T]: () => T[K] }, logger: LoggerType) {
    this.config = Object.keys(schema).reduce((acc, key) => {
      acc[key as keyof T] = schema[key as keyof T]()
      return acc
    }, {} as T)
    this.logger = logger
  }

  public static getInstance<T extends Record<string, unknown>>(
    schema: { [K in keyof T]: () => T[K] },
    key: string = 'default', // optional identifier for multi-config support
    logger: LoggerType,
  ): ConfigLoader<T> {
    if (!ConfigLoader.instanceMap.has(key)) {
      ConfigLoader.instanceMap.set(key, new ConfigLoader(schema, logger))
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

      this.logger.error(`Configuration validation failed:\n Configuration keys ${notAvailableENVs}`)

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

const clientConfigSchema = {
  appUrl: () => process.env.NEXT_PUBLIC_APP_URL,
  apiBaseUrl: () => process.env.NEXT_PUBLIC_API_URL,
  nodeEnv: () => process.env.NODE_ENV || 'development',
}

export const clientConfig = ConfigLoader.getInstance(clientConfigSchema, 'client', clientLogger)
