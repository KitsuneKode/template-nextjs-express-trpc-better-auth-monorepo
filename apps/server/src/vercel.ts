import { logger } from '@/utils/logger'
import { config } from '@/utils/config'
import app from '@/app'

config.validateAll()

const port = config.getConfig('port')

app.listen(port, (err) => {
  if (err) {
    logger.error(`failed to start server:`, err)
    process.exit(1)
  } else {
    logger.info(`Server started server on port ${port}`)
  }
})
