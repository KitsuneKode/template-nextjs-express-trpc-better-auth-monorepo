import { loader } from 'fumadocs-core/source'
import { docs } from '#fumadocs'

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
})
