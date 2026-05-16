/**
 * Next.js Performance Optimization Config
 *
 * Production-ready configuration for optimal performance and user experience.
 */

export const performanceConfig = {
  /**
   * Image Optimization
   * - Use next/image for automatic optimization
   * - Enable AVIF format for modern browsers
   * - Set sizes for responsive images
   */
  image: {
    formats: ['image/avif', 'image/webp'],
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  },

  /**
   * Bundle Analysis
   * - Track bundle size over time
   * - Identify large dependencies
   * - Use dynamic imports for code splitting
   *
   * Run: `ANALYZE=true bun run build`
   */
  bundleAnalysis: process.env.ANALYZE === 'true',

  /**
   * Caching Strategy
   * - ISR: For pages that update infrequently
   * - SSG: For static pages
   * - Revalidate on-demand for urgent updates
   */
  defaultRevalidate: 3600, // 1 hour

  /**
   * Compression
   * - Gzip and Brotli are handled by Node/Nginx
   * - Minification happens at build time
   * - Enable compression middleware on server
   */

  /**
   * Font Optimization
   * - Use font-display: swap to prevent FOUT
   * - Preload critical fonts
   * - Use variable fonts to reduce requests
   */

  /**
   * Script Optimization
   * - Use <Script strategy="beforeInteractive" /> for critical scripts
   * - Use <Script strategy="lazyOnload" /> for analytics
   * - Defer non-critical JavaScript
   */
}

/**
 * Development vs Production Optimizations
 *
 * Development:
 * - Source maps enabled
 * - Fast refresh enabled
 * - Verbose error messages
 * - No compression
 *
 * Production:
 * - Source maps disabled (or separate files)
 * - Tree-shaking enabled
 * - Dead code elimination
 * - Compression enabled
 * - HTTP/2 push for critical assets
 */
