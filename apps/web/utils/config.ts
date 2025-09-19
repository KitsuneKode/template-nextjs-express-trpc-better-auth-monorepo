import { ConfigLoader } from '@template/common/config-loader'

const clientConfigSchema = {
  frontendUrl: () => process.env.NEXT_PUBLIC_APP_URL || '',
  apiBaseUrl: () => process.env.NEXT_PUBLIC_API_URL || '',
  jwtSecret: () => process.env.JWT_SECRET || '',
  databaseUrl: () => process.env.DATABASE_URL || '',
  nodeEnv: () => process.env.NODE_ENV || 'development',
}

const config = ConfigLoader.getInstance(clientConfigSchema, 'client')

config.validate([
  'frontendUrl',
  'apiBaseUrl',
  'jwtSecret',
  'databaseUrl',
  'nodeEnv',
])

console.log('Configuration loaded:', config.getConfig('apiBaseUrl'))

export default config
