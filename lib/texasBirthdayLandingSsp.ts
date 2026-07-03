import type { GetServerSidePropsContext } from 'next'
import { getMarketForPath } from '../data/markets'

function headerPathFromContext(context: GetServerSidePropsContext): string {
  const raw = context.req?.headers['x-robobooth-path']
  const s = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : ''
  return s ? s.split('?')[0] : ''
}

/** Texas-only landing: /texas/birthday (via rewrite to /birthday). */
export function getTexasBirthdayLandingSsp(fallbackPath = '/birthday') {
  return async (context: GetServerSidePropsContext) => {
    const resolved = context.resolvedUrl?.split('?')[0] || ''
    const browserPath = headerPathFromContext(context) || resolved || fallbackPath
    if (getMarketForPath(browserPath).id !== 'texas') {
      return { notFound: true as const }
    }
    return { props: { browserPath } }
  }
}
