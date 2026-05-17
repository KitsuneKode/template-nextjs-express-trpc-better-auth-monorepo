import { toNodeHandler, auth } from '@template/auth/server'
import { prisma } from '@template/store'
import { expressMiddleWare } from '@template/trpc'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { serverAdapter as bullBoardAdapter } from '@/admin/bull-board'
import { noCache } from '@/middlewares/cache-middleware'
import { authRateLimit, apiRateLimit } from '@/middlewares/rate-limit-middleware'
import { timingMiddleWare } from '@/middlewares/timing-middleware'
import { tracingMiddleware } from '@/middlewares/tracing-middleware'
import { config } from '@/utils/config'

const app = express()

app.use(tracingMiddleware)
app.use(helmet())
app.use(compression())

app.use(
  cors({
    origin: config.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

app.use('/admin/queues', bullBoardAdapter.getRouter())

app.all('/api/auth/*splat', timingMiddleWare, authRateLimit, toNodeHandler(auth))

app.use(express.json({ limit: '1mb' }))
app.use('/api/trpc', apiRateLimit, expressMiddleWare)

app.use('/health', noCache, async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'OK', database: 'connected' })
  } catch {
    res.status(503).json({ status: 'ERROR', database: 'disconnected' })
  }
})

app.all('/{*splat}', (req, res) => {
  res.status(404).json({
    message: 'Not Found',
  })
})

export default app
