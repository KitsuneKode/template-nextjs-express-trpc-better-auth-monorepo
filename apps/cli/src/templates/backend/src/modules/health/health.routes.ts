import { Router } from 'express'
import { asyncHandler } from '@/common/middleware/async-handler'
import { healthController } from './health.controller'

export const healthRoutes = Router()

healthRoutes.get(
  '/',
  asyncHandler(async (req, res) => healthController.getHealth(req, res)),
)
