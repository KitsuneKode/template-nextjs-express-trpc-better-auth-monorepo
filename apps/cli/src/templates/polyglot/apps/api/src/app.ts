import cors from 'cors'
import express from 'express'
import { healthRoutes } from '@/modules/health/health.routes'

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
)

app.use('/health', healthRoutes)

export { app }
