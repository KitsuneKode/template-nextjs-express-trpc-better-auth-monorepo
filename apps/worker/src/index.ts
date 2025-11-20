import { logger } from '@/utils/logger'

// eslint-disable-next-line no-constant-condition
while (1) {
  await new Promise(() => setTimeout(() => logger.info('worker started'), 1000))

  break
}
