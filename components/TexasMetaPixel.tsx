import Script from 'next/script'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getMarketForPath } from '../data/markets'

const TEXAS_META_PIXEL_ID = '999550036295470'

/**
 * Meta Pixel — loads only on /texas routes (including rewrites
 * like /texas/corporate, /texas/products/*, /texas/events/*).
 */
export default function TexasMetaPixel() {
  const router = useRouter()
  const pathname = router.asPath.split('?')[0]
  const isTexasRoute = getMarketForPath(pathname).id === 'texas'

  useEffect(() => {
    if (!isTexasRoute) return

    const trackPageView = () => {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView')
      }
    }

    router.events.on('routeChangeComplete', trackPageView)
    return () => router.events.off('routeChangeComplete', trackPageView)
  }, [isTexasRoute, router.events])

  if (!isTexasRoute) return null

  return (
    <>
      <Script id="meta-pixel-texas" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${TEXAS_META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${TEXAS_META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
