import type { MarketConfig } from '../data/markets'
import {
  TEXAS_SERVICE_AREA,
  texasAcrossPhrase,
  texasInPhrase,
  texasServingLine,
  texasTrustedBrandsCouplesLine,
  texasTrustedBrandsLine,
  texasTrustedCompaniesLine,
  texasTrustedCouplesLine,
} from './texasServiceArea'

/** "Chicago's First" / "Texas's First" / "USA's First" (headline-style). */
export function firstRobotBrandPhrase(market: MarketConfig): string {
  if (market.id === 'chicago') return "Chicago's First"
  if (market.id === 'texas') return "Texas's First"
  return "USA's First"
}

/** Possessive only: "Chicago's" / "Texas's" / "USA's" */
export function firstRobotPossessive(market: MarketConfig): string {
  if (market.id === 'chicago') return "Chicago's"
  if (market.id === 'texas') return "Texas's"
  return "USA's"
}

/** Marquee under logo strip on several landings. */
export function trustedBrandsMarqueeLine(market: MarketConfig): string {
  if (market.id === 'chicago') return 'Trusted by leading brands across Chicago & surrounding areas'
  if (market.id === 'texas') return texasTrustedBrandsLine
  return 'Trusted by leading brands across USA'
}

/** Corporate landing uses “companies” in the marquee. */
export function trustedCompaniesMarqueeLine(market: MarketConfig): string {
  if (market.id === 'chicago') return 'Trusted by leading companies across Chicago & surrounding areas'
  if (market.id === 'texas') return texasTrustedCompaniesLine
  return 'Trusted by leading companies across USA'
}

export function corporateHeroRatingLine(market: MarketConfig): string {
  if (market.id === 'chicago') return "5.0 Rating · Trusted by Chicago's Top Brands"
  if (market.id === 'texas') return "5.0 Rating · Trusted by Texas's Top Brands"
  return '5.0 Rating · Trusted by Leading Brands Across the USA'
}

export function weddingHeroRatingLine(market: MarketConfig): string {
  if (market.id === 'chicago') return '5.0 Rating · Trusted by couples across Chicago & surrounding areas'
  if (market.id === 'texas') return texasTrustedCouplesLine
  return '5.0 Rating · Trusted by Couples Across the USA'
}

export function weddingMarqueeLine(market: MarketConfig): string {
  if (market.id === 'chicago') return 'Trusted by leading brands & couples across Chicago & surrounding areas'
  if (market.id === 'texas') return texasTrustedBrandsCouplesLine
  return 'Trusted by leading brands & couples across USA'
}

/**
 * Removes Aerial Booth from marketing copy on regional markets that do not offer it.
 */
export function stripAerialBoothCopy(text: string): string {
  let t = text
  t = t.replace(/,?\s*Aerial Booth,?\s*or\s+/gi, ' or ')
  t = t.replace(/,\s*or\s+Aerial Booth\b/gi, '')
  t = t.replace(/\bor\s+Aerial Booth\b/gi, '')
  t = t.replace(/\bAerial Booth\s+or\s+/gi, '')
  t = t.replace(/\bAerial Booth\b/gi, '')
  t = t.replace(/\bor\s+or\b/gi, 'or')
  t = t.replace(/,\s*,/g, ',')
  t = t.replace(/,\s+or\b/g, ' or')
  t = t.replace(/\s{2,}/g, ' ')
  t = t.replace(/,\s+\./g, '.')
  t = t.replace(/,\s+—/g, ' —')
  return t.trim()
}

/**
 * Rewrites national “USA’s first” positioning and mixed Chicago+USA phrases for regional URLs.
 * Does not modify copy when `market` is national.
 */
export function localizeMarketingCopy(text: string, market: MarketConfig): string {
  if (market.id === 'national') return text

  if (market.id === 'texas') {
    let t = text
      .replace(/\bUSA's First\b/g, "Texas's First")
      .replace(/\bUSA's first\b/g, "Texas's first")
    t = t.replace(/\bChicago USA\b/g, 'Texas')
    t = t.replace(/Serving Chicago & USA/g, texasServingLine)
    t = t.replace(/Chicago & USA/g, TEXAS_SERVICE_AREA)
    t = t.replace(/Chicago & the USA/gi, TEXAS_SERVICE_AREA)
    t = t.replace(/serving Chicago & the USA/gi, `serving ${TEXAS_SERVICE_AREA}`)
    t = t.replace(/across Chicago & the USA/gi, texasAcrossPhrase)
    t = t.replace(/Chicago & across USA/g, TEXAS_SERVICE_AREA)
    t = t.replace(/— Chicago & across USA/g, `— ${TEXAS_SERVICE_AREA}`)
    t = t.replace(/\bacross the USA\b/gi, texasAcrossPhrase)
    t = t.replace(/\bacross USA\b/g, texasAcrossPhrase)
    t = t.replace(/\bthroughout the USA\b/gi, `throughout ${TEXAS_SERVICE_AREA}`)
    t = t.replace(/\bin the USA\b/gi, texasInPhrase)
    return stripAerialBoothCopy(t)
  }

  let t = text
    .replace(/\bUSA's First\b/g, "Chicago's First")
    .replace(/\bUSA's first\b/g, "Chicago's first")

  t = t.replace(/Serving Chicago & USA/g, 'Serving Chicago & surrounding areas')
  t = t.replace(/Chicago & USA/g, 'Chicago & surrounding areas')
  t = t.replace(/Chicago & the USA/gi, 'Chicago & surrounding areas')
  t = t.replace(/serving Chicago & the USA/gi, 'serving Chicago & surrounding areas')
  t = t.replace(/across Chicago & the USA/gi, 'across Chicago & surrounding areas')
  t = t.replace(/Chicago & across USA/g, 'Chicago & surrounding areas')
  t = t.replace(/— Chicago & across USA/g, '— Chicago & surrounding areas')
  t = t.replace(/\bacross the USA\b/gi, 'across Chicago & surrounding areas')
  t = t.replace(/\bacross USA\b/g, 'across Chicago & surrounding areas')
  t = t.replace(/\bthroughout the USA\b/gi, 'throughout the Chicago area')
  t = t.replace(/\bin the USA\b/gi, 'in Chicago & surrounding areas')
  t = t.replace(/\bChicago USA\b/g, 'Chicago')

  return stripAerialBoothCopy(t)
}
