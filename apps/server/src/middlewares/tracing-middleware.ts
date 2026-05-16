import type { NextFunction, Request, Response } from 'express'
import crypto from 'node:crypto'

export const tracingMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const requestId = crypto.randomUUID()
  req.headers['x-request-id'] = requestId
  ;(req as unknown as Record<string, unknown>).requestId = requestId
  next()
}
