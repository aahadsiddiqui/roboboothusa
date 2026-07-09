declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

/** Fire Meta Pixel Lead event on successful inline form submission (Texas and Chicago routes). */
export function trackTexasMetaLead(marketId: string) {
  if (marketId !== 'texas' && marketId !== 'chicago') return
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead')
  }
}
