import { clientConfig as config } from '@template/common/config-loader'
import { createAuthClient } from 'better-auth/react' // make sure to import from better-auth/react

export const authClient = createAuthClient({
  baseURL: config.getConfig('appUrl'),
})
