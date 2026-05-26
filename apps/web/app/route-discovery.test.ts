import { describe, expect, it } from 'bun:test'

process.env.CI = 'true'
process.env.NEXT_PUBLIC_SITE_URL = 'https://arche.test'
process.env.NEXT_PUBLIC_APP_URL = 'https://arche.test'
process.env.NEXT_PUBLIC_API_URL = 'https://api.arche.test'

describe('route discovery controls', () => {
  it('keeps design lab out of public discovery routes', async () => {
    const [{ default: robots }, { default: sitemap }] = await Promise.all([
      import('./robots'),
      import('./sitemap'),
    ])

    const rules = robots().rules
    expect(Array.isArray(rules) ? rules : [rules]).toContainEqual(
      expect.objectContaining({
        disallow: expect.arrayContaining(['/__design-lab/']),
      }),
    )

    expect(sitemap().map((entry) => entry.url)).not.toContain('https://arche.test/__design-lab')
    expect(sitemap().map((entry) => entry.url)).not.toContain('https://arche.test/showcase')
  })
})
