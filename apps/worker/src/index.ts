import { logger } from '@/utils/logger'

while (1) {
  await new Promise(() => setTimeout(() => logger.info('worker started'), 1000))

  break
}
