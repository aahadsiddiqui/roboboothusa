import { getMarketForPath } from '../data/markets'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

/**
 * Chicago Meta Pixel. This module NEVER touches the Texas pixel
 * (999550036295470) — Texas is a separate business (see AGENTS.md).
 */
const CHICAGO_META_PIXEL_ID = '1222147680976957'

/**
 * Synchronous re-entrancy / dedup guard.
 *
 * A double/triple-click that slips past the disabled submit button before
 * React re-renders can trigger this helper more than once for what is really
 * a single user action. `lastFiredAt` collapses such a burst into a single
 * `form_submit`. Legitimate, well-separated submissions (network round-trips
 * make them seconds apart) still fire normally.
 */
let lastFiredAt = 0
const DEDUP_WINDOW_MS = 2000

function makeEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `chi-form-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Fire a Chicago-only custom `form_submit` event after a *verified* successful
 * form submission (i.e. `response.ok` — never on click, form_start, or failure).
 *
 * Why `trackSingleCustom` instead of `trackCustom`:
 *   `fbq('trackCustom', ...)` fires on EVERY pixel currently initialized in the
 *   shared `fbq` singleton. Because markets are reachable via client-side
 *   navigation, a previously-initialized Texas pixel could otherwise also
 *   receive this event. `trackSingleCustom` delivers to exactly one pixel id,
 *   so the Texas pixel (999550036295470) can never be hit.
 *
 * Dedup: a unique `eventID` per submission lets Meta collapse accidental
 * re-fires, and the synchronous guard above blocks rapid re-entrant calls.
 *
 * @param eventId optional dedup id (a unique one is generated if omitted).
 */
export function trackChicagoFormSubmit(eventId: string = makeEventId()): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return

  // Only ever fire on a live Chicago route (public URL, post-rewrite), so the
  // Chicago pixel is never active on a Texas or national route.
  if (getMarketForPath(window.location.pathname).id !== 'chicago') return

  const now = Date.now()
  if (now - lastFiredAt < DEDUP_WINDOW_MS) return
  lastFiredAt = now

  window.fbq('trackSingleCustom', CHICAGO_META_PIXEL_ID, 'form_submit', { eventID: eventId })
}
