import type { Request, Response } from 'express'

const SERVICE_VERSION = '1.0.0'

export const rootController = {
  async getRoot(_req: Request, res: Response) {
    res.json({
      service: '@template/server',
      title: 'Arche API',
      status: 'ok',
      version: SERVICE_VERSION,
      environment: process.env.NODE_ENV ?? 'development',
      links: {
        health: '/health',
        trpc: '/api/trpc',
        auth: '/api/auth',
      },
      hint: 'Load balancers use GET /health. tRPC clients call /api/trpc.',
    })
  },
}
