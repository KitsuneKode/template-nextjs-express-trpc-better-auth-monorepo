import config from '@/utils/config'
import { logger } from '@/utils/logger'
import type { NextFunction, Request, Response } from 'express'

export const timingMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now()

  if (config.getConfig('nodeEnv') === 'development') {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  const result = await next()

  const end = Date.now()
  logger.info(`[AUTH] ${req.path} took ${end - start}ms to execute`)

  return result
}
