import { describe, expect, it } from 'bun:test'
import { buildCleanupPlan } from '../../../toolings/scripts/template-cleanup'

describe('template-cleanup', () => {
  it('plans a starter seed replacement when requested', async () => {
    const actions = await buildCleanupPlan(['seed'])
    expect(actions).toHaveLength(1)
    expect(actions[0]?.type).toBe('write')
    expect(actions[0]?.path).toBe('packages/store/src/scripts/seed.ts')
  })

  it('includes showcase cleanup writes in the recommended web reset', async () => {
    const actions = await buildCleanupPlan(['showcase'])
    const paths = actions.map((action) => action.path)
    expect(paths).toContain('apps/web/app/layout.tsx')
    expect(paths).toContain('apps/web/app/page.tsx')
    expect(paths).toContain('apps/web/components/landing')
  })
})
