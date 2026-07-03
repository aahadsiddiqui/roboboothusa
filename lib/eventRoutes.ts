import type { MarketConfig } from '../data/markets'

/** eventTypes[].slug -> national /events/... path */
const EVENT_TYPE_SLUG_TO_NATIONAL: Record<string, string> = {
  'product-launches': '/events/product-launch',
  'retail-pop-ups': '/events/retail-pop-up',
  'conferences-summits': '/events/conference-summit',
  'trade-shows-expos': '/events/trade-show-expo',
  'gala-dinners-award-ceremonies': '/events/gala-dinner',
  'holiday-parties': '/events/holiday-party',
  'milestone-celebrations': '/events/milestone-celebration',
  'engagements': '/events/engagement',
  'bar-bat-mitzvahs': '/events/bar-bat-mitzvah',
  'concerts-festivals': '/events/concert-festival',
  'graduation': '/events/graduation',
}

/**
 * Href for an event type from `data/events` `slug` (e.g. product-launches).
 * Regional: /{chicago|texas}/events/{segment} (rewritten to /events/{segment}).
 */
export function eventTypeHref(market: MarketConfig, eventTypeSlug: string): string {
  const national = EVENT_TYPE_SLUG_TO_NATIONAL[eventTypeSlug] || `/events/${eventTypeSlug}`
  if (market.id === 'national') return national
  const segment = national.replace(/^\/events\//, '')
  return `${market.basePath}/events/${segment}`
}

export function featuredCorporateHref(market: MarketConfig): string {
  return market.id === 'national' ? '/corporate' : `${market.basePath}/corporate`
}

export function featuredBrandActivationsHref(market: MarketConfig): string {
  return market.id === 'national' ? '/brand-activations' : `${market.basePath}/brand-activations`
}

export function featuredWeddingHref(market: MarketConfig): string {
  return market.id === 'national' ? '/wedding' : `${market.basePath}/wedding`
}

export function featuredBirthdayHref(market: MarketConfig): string | null {
  if (market.id !== 'texas') return null
  return '/texas/birthday'
}
