import { env } from '@/common/env'
import { app } from './app.js'

const port = env.PORT

app.listen(port, () => {
  console.log(`API server running on port ${port}`)
})
