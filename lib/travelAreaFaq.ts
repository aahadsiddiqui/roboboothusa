import type { MarketConfig } from '../data/markets'
import { TEXAS_SERVICE_AREA, texasServingLine } from './texasServiceArea'

/** Illinois suburbs named on Chicago-area marketing (no Canadian cities). */
export const CHICAGO_METRO_SUBURBS =
  'Evanston, Schaumburg, Naperville, Skokie, Arlington Heights, Oak Park, and surrounding suburbs'

/** Hero rating line on event landing pages (market-aware). */
export function eventPageRatingLine(market: MarketConfig): string {
  if (market.id === 'chicago') {
    return `5.0 Rating · Chicago area & ${CHICAGO_METRO_SUBURBS}`
  }
  if (market.id === 'texas') {
    return texasServingLine.replace('Serving ', '5.0 Rating · Serving ')
  }
  return '5.0 Rating · Serving Chicago & USA'
}

const TRAVEL_FAQ_QUESTION_LEGACY = 'Do you travel outside Chicago?'

export function travelAreaFaqPair(market: MarketConfig): { question: string; answer: string } {
  if (market.id === 'chicago') {
    return {
      question: TRAVEL_FAQ_QUESTION_LEGACY,
      answer: `Yes. We serve downtown Chicago and the greater metro area, including ${CHICAGO_METRO_SUBURBS}. Tell us your venue and we will confirm coverage.`,
    }
  }
  if (market.id === 'texas') {
    return {
      question: 'Do you travel for events in Texas?',
      answer:
        `Yes — we serve the Texas Triangle (Austin, Dallas, Houston), San Antonio, and surrounding areas. Contact us with your venue and date.`,
    }
  }
  return {
    question: 'Do you travel for events?',
    answer:
      'Yes — we travel for events across the USA. Contact us with your venue and we will confirm coverage and timing.',
  }
}

type Faq = { question: string; answer: string }

/** Replaces the legacy “Do you travel outside Chicago?” row with market-appropriate copy. */
export function withMarketTravelFaq<T extends Faq>(faqs: T[], market: MarketConfig): T[] {
  const pair = travelAreaFaqPair(market)
  return faqs.map((f) => (f.question === TRAVEL_FAQ_QUESTION_LEGACY ? { ...f, ...pair } : f))
}
