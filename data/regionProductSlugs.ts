import { products } from './products'

/**
 * Slugs included on Chicago/Texas landings and regional product routes
 * (matches MarketHome: aerial booth excluded; Texas includes AI Booth).
 * Keep this list aligned with `productSlugsForRegionalRedirects` in `regional-url-paths.json` (next.config redirects).
 */
export const REGIONAL_MARKET_SLUGS = products
  .filter((p) => p.slug !== 'aerial-booth')
  .map((p) => p.slug)

/**
 * Product slugs whose full custom UI is the national page, reached via rewrites
 * (e.g. /chicago/products/premium-photobooth → /premium-photobooth) — not duplicated in chicago/[slug] or texas/[slug].
 */
export const REGIONAL_DEDICATED_REWRITE_SLUGS = [
  'robot-photobooth',
  'premium-photobooth',
  '360-booth',
  'portrait-booth',
  'photography-videography',
  'headshots',
  'ai-booth',
] as const

/** chicago/[slug] and texas/[slug] SSG: robot + products without a dedicated custom rewrite page */
export const REGIONAL_DYNAMIC_SLUGS = REGIONAL_MARKET_SLUGS.filter(
  (s) => !REGIONAL_DEDICATED_REWRITE_SLUGS.includes(s as (typeof REGIONAL_DEDICATED_REWRITE_SLUGS)[number])
)
