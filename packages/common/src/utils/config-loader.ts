export class ConfigLoader<T extends Record<string, any>> {
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
    requiredKeys.forEach((key) => {
      const value = this.config[key]
      if (value === undefined || value === null) {
        throw new Error(
          `Configuration key "${String(key)}" is required but not provided.`,
        )
      }
    })
  }

  public getAllConfigs(): T {
    return this.config
  }
}
