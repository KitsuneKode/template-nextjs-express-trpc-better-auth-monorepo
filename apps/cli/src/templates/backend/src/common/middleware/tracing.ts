import crypto from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

export const tracingMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  req.headers['x-request-id'] = crypto.randomUUID()
  next()
}
