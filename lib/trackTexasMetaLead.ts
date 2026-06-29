declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

/** Fire Meta Pixel Lead event on successful inline form submission (Texas routes only). */
export function trackTexasMetaLead(marketId: string) {
  if (marketId !== 'texas') return
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead')
  }
}
