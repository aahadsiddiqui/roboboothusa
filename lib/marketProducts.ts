import { products, type ProductData } from '../data/products'
import type { MarketConfig } from '../data/markets'

/** Product lineup shown on regional home, nav, and product hub for a market. */
export function productsForMarket(market: MarketConfig): ProductData[] {
  return products.filter((p) => {
    if (p.slug === 'aerial-booth' && (market.id === 'chicago' || market.id === 'texas')) return false
    if (p.slug === 'ai-booth' && market.id !== 'texas') return false
    return true
  })
}
