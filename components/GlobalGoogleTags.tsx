import Script from 'next/script'
import { useRouter } from 'next/router'
import { getMarketForPath } from '../data/markets'

/**
 * Loads GTM + GA globally — skipped on /chicago/* routes so Chicago
 * can run its own independent Google Tags account.
 */
export default function GlobalGoogleTags() {
  const router = useRouter()
  const pathname = router.asPath.split('?')[0]
  const isChicago = getMarketForPath(pathname).id === 'chicago'

  if (isChicago) return null

  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-2S593P23DG"
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2S593P23DG');
        `}
      </Script>

      {/* Google Tag Manager */}
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NWKRRGVB');`}
      </Script>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-NWKRRGVB"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}
