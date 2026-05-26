declare module '#fumadocs' {
  import type { Source } from 'fumadocs-core/source'

  export const docs: { toFumadocsSource(): Source }
  export const blog: { toFumadocsSource(): Source }
  export const meta: unknown
}
