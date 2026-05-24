import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ['@arche-template/ui'],
  cacheComponents: true,
  turbopack: {
    resolveAlias: {
      '#fumadocs': './.source/source.config.mjs',
    },
  },
}

const withMDX = createMDX()

export default withMDX(config)
