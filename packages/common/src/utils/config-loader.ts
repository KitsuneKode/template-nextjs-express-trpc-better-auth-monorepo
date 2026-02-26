import { clientLogger, type LoggerType } from './client-logger'

export type ConfigSchema<T extends Record<string, unknown>> = {
  [K in keyof T]: () => T[K]
}

export class ConfigValidationError extends Error {
  public readonly issues: readonly string[]

  constructor(message: string, issues: readonly string[] = []) {
    super(message)
    this.name = 'ConfigValidationError'
    this.issues = issues
  }
}

interface ConfigLoaderOptions {
  key?: string
  logger: LoggerType
  allowSchemaMismatch?: boolean
}

type ConfigLoaderEntry = {
  schemaKeySignature: string
  instance: ConfigLoader<Record<string, unknown>>
}

const formatIssues = (issues: readonly string[]): string => {
  return issues.map((issue) => `- ${issue}`).join('\n')
}

const formatUnknownError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

const isMissingConfigValue = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return true
  }

  if (typeof value === 'string') {
    return value.trim().length === 0
  }

  if (typeof value === 'number') {
    return Number.isNaN(value)
  }

  return false
}

const getSchemaKeySignature = <T extends Record<string, unknown>>(
  schema: ConfigSchema<T>,
): string => {
  return Object.keys(schema).sort().join('|')
}

const parseGetInstanceOptions = (
  keyOrOptions: string | ConfigLoaderOptions | undefined,
  logger: LoggerType | undefined,
): Required<Pick<ConfigLoaderOptions, 'key' | 'logger'>> &
  Pick<ConfigLoaderOptions, 'allowSchemaMismatch'> => {
  if (typeof keyOrOptions === 'string') {
    if (!logger) {
      throw new Error(
        'ConfigLoader.getInstance requires logger when using key as the second argument.',
      )
    }

    return {
      key: keyOrOptions,
      logger,
      allowSchemaMismatch: false,
    }
  }

  if (keyOrOptions) {
    return {
      key: keyOrOptions.key ?? 'default',
      logger: keyOrOptions.logger,
      allowSchemaMismatch: keyOrOptions.allowSchemaMismatch ?? false,
    }
  }

  if (!logger) {
    throw new Error(
      'ConfigLoader.getInstance requires a logger. Pass (schema, key, logger) or (schema, { logger }).',
    )
  }

  return {
    key: 'default',
    logger,
    allowSchemaMismatch: false,
  }
}

export class ConfigLoader<T extends Record<string, unknown>> {
  private static instanceMap = new Map<string, ConfigLoaderEntry>()

  private readonly config: Readonly<T>
  private readonly logger: LoggerType
  private readonly schemaKeys: readonly (keyof T)[]
  private readonly instanceKey: string

  private constructor(schema: ConfigSchema<T>, logger: LoggerType, instanceKey: string) {
    this.logger = logger
    this.instanceKey = instanceKey
    this.schemaKeys = Object.keys(schema) as (keyof T)[]

    const resolvedConfig = {} as T
    const resolutionIssues: string[] = []

    for (const key of this.schemaKeys) {
      try {
        resolvedConfig[key] = schema[key]()
      } catch (error) {
        resolutionIssues.push(`${String(key)}: ${formatUnknownError(error)}`)
      }
    }

    if (resolutionIssues.length > 0) {
      const message =
        `Configuration resolution failed for "${this.instanceKey}".\n` +
        'Fix the following environment variables:\n' +
        `${formatIssues(resolutionIssues)}`

      this.logger.error(message)
      throw new ConfigValidationError(message, resolutionIssues)
    }

    this.config = Object.freeze(resolvedConfig)
  }

  public static getInstance<T extends Record<string, unknown>>(
    schema: ConfigSchema<T>,
    key: string,
    logger: LoggerType,
  ): ConfigLoader<T>

  public static getInstance<T extends Record<string, unknown>>(
    schema: ConfigSchema<T>,
    options: ConfigLoaderOptions,
  ): ConfigLoader<T>

  public static getInstance<T extends Record<string, unknown>>(
    schema: ConfigSchema<T>,
    keyOrOptions?: string | ConfigLoaderOptions,
    logger?: LoggerType,
  ): ConfigLoader<T> {
    const parsedOptions = parseGetInstanceOptions(keyOrOptions, logger)
    const key = parsedOptions.key
    const schemaKeySignature = getSchemaKeySignature(schema)

    const existingEntry = ConfigLoader.instanceMap.get(key)
    if (existingEntry) {
      if (
        !parsedOptions.allowSchemaMismatch &&
        existingEntry.schemaKeySignature !== schemaKeySignature
      ) {
        throw new ConfigValidationError(
          `ConfigLoader key "${key}" is already initialized with a different schema. Use a unique key per schema.`,
        )
      }

      return existingEntry.instance as ConfigLoader<T>
    }

    const instance = new ConfigLoader(schema, parsedOptions.logger, key)

    ConfigLoader.instanceMap.set(key, {
      schemaKeySignature,
      instance: instance as ConfigLoader<Record<string, unknown>>,
    })

    return instance
  }

  public static clearInstances(): void {
    ConfigLoader.instanceMap.clear()
  }

  public getConfig<K extends keyof T>(key: K): T[K] {
    return this.config[key]
  }

  public getAllConfigs(): Readonly<T> {
    return this.config
  }

  public validate(requiredKeys: readonly (keyof T)[] = this.schemaKeys): void {
    const errors: string[] = []

    for (const key of requiredKeys) {
      if (isMissingConfigValue(this.config[key])) {
        errors.push(`${String(key)} is required but not provided.`)
      }
    }

    if (errors.length === 0) {
      return
    }

    const message =
      `Configuration validation failed for "${this.instanceKey}".\n` +
      'Missing or invalid config values:\n' +
      `${formatIssues(errors)}`

    this.logger.error(message)
    throw new ConfigValidationError(message, errors)
  }

  public validateAll(): void {
    this.validate(this.schemaKeys)
  }
}

interface EnvStringOptions {
  defaultValue?: string
  trim?: boolean
  allowEmpty?: boolean
}

interface EnvNumberOptions {
  defaultValue?: number
  integer?: boolean
  min?: number
  max?: number
}

const MISSING_ENV_VALUE = Symbol('MISSING_ENV_VALUE')

const getRawEnvValue = (envName: string, fallback: string | typeof MISSING_ENV_VALUE): string => {
  const rawValue = process.env[envName]
  if (rawValue === undefined || rawValue === null) {
    if (fallback !== MISSING_ENV_VALUE) {
      return fallback
    }

    throw new Error(`Missing required environment variable: ${envName}`)
  }

  return rawValue
}

export const readEnvString = (envName: string, options: EnvStringOptions = {}): string => {
  const rawValue = getRawEnvValue(envName, options.defaultValue ?? MISSING_ENV_VALUE)
  const value = options.trim === false ? rawValue : rawValue.trim()

  if (!options.allowEmpty && value.length === 0) {
    throw new Error(`Environment variable ${envName} cannot be empty.`)
  }

  return value
}

export const readEnvNumber = (envName: string, options: EnvNumberOptions = {}): number => {
  const fallback =
    options.defaultValue === undefined ? MISSING_ENV_VALUE : String(options.defaultValue)

  const value = readEnvString(envName, {
    defaultValue: fallback === MISSING_ENV_VALUE ? undefined : fallback,
  })

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${envName} must be a valid number.`)
  }

  if (options.integer && !Number.isInteger(parsed)) {
    throw new Error(`Environment variable ${envName} must be an integer.`)
  }

  if (options.min !== undefined && parsed < options.min) {
    throw new Error(`Environment variable ${envName} must be >= ${options.min}.`)
  }

  if (options.max !== undefined && parsed > options.max) {
    throw new Error(`Environment variable ${envName} must be <= ${options.max}.`)
  }

  return parsed
}

export const readEnvUrl = (envName: string, options: EnvStringOptions = {}): string => {
  const value = readEnvString(envName, options)

  try {
    // Ensure the value is a valid absolute URL.
    new URL(value)
  } catch {
    throw new Error(`Environment variable ${envName} must be a valid URL.`)
  }

  return value
}

export const readEnvEnum = <T extends readonly [string, ...string[]]>(
  envName: string,
  allowedValues: T,
  options: { defaultValue?: T[number] } = {},
): T[number] => {
  const value = readEnvString(envName, {
    defaultValue: options.defaultValue,
  })

  if ((allowedValues as readonly string[]).includes(value)) {
    return value as T[number]
  }

  throw new Error(`Environment variable ${envName} must be one of: ${allowedValues.join(', ')}.`)
}

const NODE_ENVS = ['development', 'test', 'production'] as const

type ClientNodeEnv = (typeof NODE_ENVS)[number]

type ClientConfig = {
  appUrl: string
  apiBaseUrl: string
  nodeEnv: ClientNodeEnv
}

const clientEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
} as const

const readClientEnvString = (
  envName: keyof typeof clientEnv,
  options: EnvStringOptions = {},
): string => {
  const rawValue = clientEnv[envName]

  if (rawValue === undefined || rawValue === null) {
    if (options.defaultValue !== undefined) {
      return options.defaultValue
    }

    throw new Error(`Missing required environment variable: ${envName}`)
  }

  const value = options.trim === false ? rawValue : rawValue.trim()
  if (!options.allowEmpty && value.length === 0) {
    throw new Error(`Environment variable ${envName} cannot be empty.`)
  }

  return value
}

const readClientEnvUrl = (
  envName: keyof Pick<typeof clientEnv, 'NEXT_PUBLIC_APP_URL' | 'NEXT_PUBLIC_API_URL'>,
): string => {
  const value = readClientEnvString(envName)

  try {
    new URL(value)
  } catch {
    throw new Error(`Environment variable ${envName} must be a valid URL.`)
  }

  return value
}

const clientConfigSchema: ConfigSchema<ClientConfig> = {
  appUrl: () => readClientEnvUrl('NEXT_PUBLIC_APP_URL'),
  apiBaseUrl: () => readClientEnvUrl('NEXT_PUBLIC_API_URL'),
  nodeEnv: () => {
    const value = readClientEnvString('NODE_ENV', { defaultValue: 'development' })

    if ((NODE_ENVS as readonly string[]).includes(value)) {
      return value as ClientNodeEnv
    }

    throw new Error(`Environment variable NODE_ENV must be one of: ${NODE_ENVS.join(', ')}.`)
  },
}

type ClientConfigAccessor = Pick<
  ConfigLoader<ClientConfig>,
  'getConfig' | 'getAllConfigs' | 'validate' | 'validateAll'
>

let clientConfigInstance: ConfigLoader<ClientConfig> | null = null

const getClientConfigInstance = (): ConfigLoader<ClientConfig> => {
  if (!clientConfigInstance) {
    clientConfigInstance = ConfigLoader.getInstance(clientConfigSchema, {
      key: 'client',
      logger: clientLogger,
    })
  }

  return clientConfigInstance
}

export const clientConfig: ClientConfigAccessor = {
  getConfig<K extends keyof ClientConfig>(key: K): ClientConfig[K] {
    return getClientConfigInstance().getConfig(key)
  },
  getAllConfigs(): Readonly<ClientConfig> {
    return getClientConfigInstance().getAllConfigs()
  },
  validate(requiredKeys?: readonly (keyof ClientConfig)[]): void {
    getClientConfigInstance().validate(requiredKeys)
  },
  validateAll(): void {
    getClientConfigInstance().validateAll()
  },
}
