import cors from 'cors'
import express from 'express'

const app = express()

app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export { app }
