import { clientConfig as config } from '@template/common/config-loader'


config.validateAll();

console.log('Configuration loaded:', config.getConfig('apiBaseUrl'))

export default config
