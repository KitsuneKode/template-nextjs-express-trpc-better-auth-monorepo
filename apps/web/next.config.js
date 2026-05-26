import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ['@arche-template/ui', '@arche-template/registry'],
  cacheComponents: true,
  async redirects() {
    return [
      { source: '/docs', destination: '/docs/getting-started', permanent: false },
      { source: '/docs/auth', destination: '/docs/packages/auth', permanent: false },
      { source: '/docs/store', destination: '/docs/packages/store', permanent: false },
      { source: '/docs/trpc', destination: '/docs/packages/trpc', permanent: false },
      { source: '/docs/deploy', destination: '/docs/operations/deploy', permanent: false },
      { source: '/docs/scaling', destination: '/docs/operations/scaling', permanent: false },
      { source: '/docs/security', destination: '/docs/operations/security', permanent: false },
    ]
  },
  turbopack: {
    resolveAlias: {
      '#fumadocs': './.source/source.config.mjs',
    },
  },
}

const withMDX = createMDX()

export default withMDX(config)
