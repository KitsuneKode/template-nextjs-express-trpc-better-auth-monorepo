import { sleep } from 'bun'
import type { NextFunction, Request, Response } from 'express'
import { config } from '@/utils/config'
import { logger } from '@/utils/logger'

export const timingMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint()

  if (config.NODE_ENV === 'development') {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100
    await sleep(waitMs)
  }

  res.on('finish', () => {
    const end = process.hrtime.bigint()
    const latencyMs = Number(end - start) / 1_000_000
    logger.info(`${req.method} ${req.originalUrl} → ${latencyMs.toFixed(2)} ms`)
  })

  next()
}
