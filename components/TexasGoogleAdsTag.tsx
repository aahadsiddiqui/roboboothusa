import Script from 'next/script'
import { useRouter } from 'next/router'
import { getMarketForPath } from '../data/markets'

const TEXAS_GOOGLE_ADS_ID = 'AW-18237439792'

/**
 * Google Ads conversion tag — loads only on /texas routes (including rewrites
 * like /texas/corporate, /texas/products/*, /texas/events/*).
 */
export default function TexasGoogleAdsTag() {
  const router = useRouter()
  const pathname = router.asPath.split('?')[0]
  const isTexasRoute = getMarketForPath(pathname).id === 'texas'

  if (!isTexasRoute) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${TEXAS_GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-texas" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${TEXAS_GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  )
}
