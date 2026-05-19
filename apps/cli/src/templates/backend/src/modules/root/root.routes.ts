import { Router } from 'express'
import { asyncHandler } from '@/common/middleware/async-handler'
import { rootController } from './root.controller'

export const rootRoutes = Router()

rootRoutes.get('/', asyncHandler(rootController.getRoot))
