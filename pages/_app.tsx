import React, { useEffect } from 'react'
import Head from 'next/head'
import '../styles/globals.css'
import 'react-calendar/dist/Calendar.css'
import '../styles/calendar.css'
import type { AppProps } from 'next/app'
import Footer from '../components/Footer'
import TexasGoogleAdsTag from '../components/TexasGoogleAdsTag'
import TexasMetaPixel from '../components/TexasMetaPixel'
import { storeUtmParams } from '../lib/utmParams'

import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // Capture UTM params on every page load / route change
  useEffect(() => {
    storeUtmParams()
  }, [router.asPath])

  // Pages where footer should be hidden
  const hideFooter = ['/corporate', '/wedding'].includes(router.pathname)

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <TexasGoogleAdsTag />
      <TexasMetaPixel />
      <main>
        <Component {...pageProps} />
      </main>
      {!hideFooter && <Footer />}
    </>
  )
} 