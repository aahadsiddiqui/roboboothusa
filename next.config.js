const regionalPaths = require('./data/regional-url-paths.json')

/**
 * Regional product landings: public URL /{region}/products/{slug} → same page module as national (see lib/regionalLinks.ts).
 */
const regionalProductRewrites = (region) => [
  { source: `/${region}/products/premium-photobooth`, destination: '/premium-photobooth' },
  { source: `/${region}/products/360-booth`, destination: '/360-booth' },
  { source: `/${region}/products/portrait-booth`, destination: '/portrait-booth' },
  { source: `/${region}/products/photography-videography`, destination: '/corporate-photography' },
  { source: `/${region}/products/headshots`, destination: '/headshots' },
  { source: `/${region}/products/ai-booth`, destination: '/ai-booth' },
  { source: `/${region}/products/robot-photobooth`, destination: '/robot-photobooth' },
]

/** Event landings: /chicago/events/product-launch → /events/product-launch */
const regionalEventRewrites = (region) =>
  regionalPaths.eventSegments.map((seg) => ({
    source: `/${region}/events/${seg}`,
    destination: `/events/${seg}`,
  }))

const regionalFeaturedRewrites = (region) => [
  { source: `/${region}/corporate`, destination: '/corporate' },
  { source: `/${region}/brand-activations`, destination: '/brand-activations' },
  { source: `/${region}/wedding`, destination: '/wedding' },
]

const REGIONS = ['chicago', 'texas']

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        ...regionalProductRewrites('chicago'),
        ...regionalProductRewrites('texas'),
        ...regionalEventRewrites('chicago'),
        ...regionalEventRewrites('texas'),
        ...regionalFeaturedRewrites('chicago'),
        ...regionalFeaturedRewrites('texas'),
      ],
    }
  },
  async redirects() {
    const { eventSegments, productSlugsForRegionalRedirects } = regionalPaths
    const eventOldToNew = REGIONS.flatMap((r) =>
      eventSegments.map((seg) => ({
        source: `/${r}/${seg}`,
        destination: `/${r}/events/${seg}`,
        permanent: true,
      })),
    )
    const productOldToNew = REGIONS.flatMap((r) =>
      productSlugsForRegionalRedirects.map((slug) => ({
        source: `/${r}/${slug}`,
        destination: `/${r}/products/${slug}`,
        permanent: true,
      })),
    )
    return [...eventOldToNew, ...productOldToNew]
  },
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  poweredByHeader: false,
  distDir: '.next',
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false
    }
    return config
  },
}

module.exports = nextConfig
