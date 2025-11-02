import type { NextFunction, Request, Response } from 'express'
import { logger } from '@/utils/logger'

export const errorHandlerMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    route: req.originalUrl,
    method: req.method,
    time: Date.now(),
  }

  logger.error(`Error on Route : ${errorDetails.route}`, error, errorHandlerMiddleware)

  // Send a generic, user-friendly error response to the client
  res.status(500).send('Internal Server Error')
}
