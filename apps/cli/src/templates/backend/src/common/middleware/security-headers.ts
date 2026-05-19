import type { NextFunction, Request, Response } from 'express'

export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.removeHeader('X-Powered-By')
  next()
}
