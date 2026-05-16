/**
 * Error handling middleware with proper recovery and logging
 *
 * Catches all Express errors and responds with structured error objects.
 * Logs errors for debugging and monitoring.
 */

import type { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export function errorHandlerMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = (error as any).status || 500
  const code = (error as any).code || 'INTERNAL_SERVER_ERROR'
  const message = error.message || 'An unexpected error occurred'

  // Log error with context
  logger.error({
    code,
    status,
    message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  })

  // Respond with structured error
  res.status(status).json({
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  })
}

/**
 * Wrap async route handlers to catch errors
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
