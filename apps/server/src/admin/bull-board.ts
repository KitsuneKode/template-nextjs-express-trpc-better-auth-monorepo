import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { Queue } from 'bullmq'
import { getBullConnection } from '@template/backend-common/redis/bull'

const QUEUE_NAMES = ['email', 'webhook', 'cleanup'] as const

const connection = getBullConnection()

const queues = QUEUE_NAMES.map(
  (name) => new Queue(name, { connection }),
)

const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

createBullBoard({
  queues: queues.map((q) => new BullMQAdapter(q)),
  serverAdapter,
})

export { serverAdapter }
