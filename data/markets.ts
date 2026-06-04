/**
 * Regional markets: separate landing routes, contact URLs, phones, and intake emails.
 * Set NEXT_PUBLIC_CHICAGO_* and NEXT_PUBLIC_TEXAS_* in production; until then, Chicago/Texas
 * contact forms use Formspree; national uses NEXT_PUBLIC_DEFAULT_FORMSPREE_URL or /api/contact.
 * fall back to the regional defaults below so the site still runs locally.
 */

import {
  TEXAS_SERVICE_AREA,
  texasAcrossPhrase,
  texasServingLine,
} from '../lib/texasServiceArea'

export type MarketId = 'national' | 'chicago' | 'texas'

export type MarketConfig = {
  id: MarketId
  basePath: string
  contactPath: string
  heroBefore: string
  heroHighlight: string
  heroLine2: string
  meta: {
    title: string
    description: string
    ogTitle: string
    ogDescription: string
    ogUrl: string
    canonical: string
    keywords: string
  }
  regionTrustBlurb: string
  finalCtaBlurb: string
  phoneDisplay: string
  phoneTel: string
  intakeEmail: string
  analyticsRegion: string
  formSource: string
  /** Client-side POST target (Formspree HTTPS or same-origin e.g. /api/contact). */
  contactFormPostUrl: string
}

const SITE = 'https://roboboothusa.com'

const nationalPhoneDisplay =
  process.env.NEXT_PUBLIC_DEFAULT_PHONE_DISPLAY ?? '(289) 301-4039'
const nationalPhoneTel = process.env.NEXT_PUBLIC_DEFAULT_PHONE_TEL ?? 'tel:+12893014039'
const nationalEmail = process.env.NEXT_PUBLIC_DEFAULT_INTAKE_EMAIL ?? 'info@roboboothusa.com'

const chicagoPhoneDisplay =
  process.env.NEXT_PUBLIC_CHICAGO_INTAKE_PHONE_DISPLAY ?? '(224) 212-1280'
const chicagoPhoneTel =
  process.env.NEXT_PUBLIC_CHICAGO_INTAKE_PHONE_TEL ?? 'tel:+12242121280'
const chicagoEmail = process.env.NEXT_PUBLIC_CHICAGO_INTAKE_EMAIL ?? 'chicago@roboboothusa.com'

const defaultContactFormPostUrl =
  process.env.NEXT_PUBLIC_DEFAULT_FORMSPREE_URL ?? '/api/contact'
const chicagoContactFormPostUrl =
  process.env.NEXT_PUBLIC_CHICAGO_FORMSPREE_URL ?? 'https://formspree.io/f/xzdykapb'

const texasPhoneDisplay =
  process.env.NEXT_PUBLIC_TEXAS_INTAKE_PHONE_DISPLAY ?? '737-273-3015'
const texasPhoneTel =
  process.env.NEXT_PUBLIC_TEXAS_INTAKE_PHONE_TEL ?? 'tel:+17372733015'
const texasEmail = process.env.NEXT_PUBLIC_TEXAS_INTAKE_EMAIL ?? 'texas@roboboothusa.com'
const texasContactFormPostUrl =
  process.env.NEXT_PUBLIC_TEXAS_FORMSPREE_URL ?? 'https://formspree.io/f/maqzypoa'

export const MARKETS: Record<MarketId, MarketConfig> = {
  national: {
    id: 'national',
    basePath: '',
    contactPath: '/contact',
    heroBefore: "USA's First ",
    heroHighlight: 'Robot PhotoBooth',
    heroLine2: 'Serving USA and Surrounding Areas',
    meta: {
      title: `RoboBooth | USA's First Robot PhotoBooth`,
      description:
        "USA's first Robot PhotoBooth serving the USA and surrounding areas. Your one-stop shop for photography and event entertainment.",
      ogTitle: `RoboBooth | USA's First Robot PhotoBooth`,
      ogDescription:
        "USA's first Robot PhotoBooth. Your one-stop shop for photography and event entertainment across the USA.",
      ogUrl: SITE,
      canonical: SITE,
      keywords: 'robot photo booth, USA photo booth, event entertainment, 360 booth, premium photobooth',
    },
    regionTrustBlurb: 'Trusted by leading brands across USA',
    finalCtaBlurb: 'Get a custom quote in minutes. We proudly serve events across the USA.',
    phoneDisplay: nationalPhoneDisplay,
    phoneTel: nationalPhoneTel,
    intakeEmail: nationalEmail,
    analyticsRegion: 'USA',
    formSource: 'Contact Page',
    contactFormPostUrl: defaultContactFormPostUrl,
  },
  chicago: {
    id: 'chicago',
    basePath: '/chicago',
    contactPath: '/chicago/contact',
    heroBefore: "Chicago's First ",
    heroHighlight: 'Robot Photobooth',
    heroLine2: 'Serving Chicago & Surrounding Areas',
    meta: {
      title: `RoboBooth Chicago | Chicago's First Robot Photobooth`,
      description:
        "Chicago's first robot photobooth for weddings, corporate events, and brand activations across Chicago and surrounding areas.",
      ogTitle: `RoboBooth Chicago | Chicago's First Robot Photobooth`,
      ogDescription:
        "Chicago's first robot photobooth. Book RoboBooth for your next Chicago-area event.",
      ogUrl: `${SITE}/chicago`,
      canonical: `${SITE}/chicago`,
      keywords:
        'Chicago photo booth, robot photo booth Chicago, event entertainment Chicago, wedding photo booth Chicago',
    },
    regionTrustBlurb: 'Trusted by leading brands across Chicago',
    finalCtaBlurb: 'Get a custom quote in minutes. We proudly serve events across Chicago and surrounding areas.',
    phoneDisplay: chicagoPhoneDisplay,
    phoneTel: chicagoPhoneTel,
    intakeEmail: chicagoEmail,
    analyticsRegion: 'Chicago',
    formSource: 'Contact Page (Chicago)',
    contactFormPostUrl: chicagoContactFormPostUrl,
  },
  texas: {
    id: 'texas',
    basePath: '/texas',
    contactPath: '/texas/contact',
    heroBefore: "Texas's First ",
    heroHighlight: 'Robot Photobooth',
    heroLine2: texasServingLine,
    meta: {
      title: `RoboBooth Texas | Texas's First Robot Photobooth`,
      description:
        `Texas's first robot photobooth for weddings, corporate events, and brand activations ${texasAcrossPhrase}.`,
      ogTitle: `RoboBooth Texas | Texas's First Robot Photobooth`,
      ogDescription:
        `Texas's first robot photobooth. Book RoboBooth for your next event in ${TEXAS_SERVICE_AREA}.`,
      ogUrl: `${SITE}/texas`,
      canonical: `${SITE}/texas`,
      keywords:
        'Texas photo booth, robot photo booth Texas, Austin photo booth, Dallas photo booth, Houston photo booth, San Antonio photo booth',
    },
    regionTrustBlurb: `Trusted by leading brands ${texasAcrossPhrase}`,
    finalCtaBlurb: `Get a custom quote in minutes. We proudly serve events ${texasAcrossPhrase}.`,
    phoneDisplay: texasPhoneDisplay,
    phoneTel: texasPhoneTel,
    intakeEmail: texasEmail,
    analyticsRegion: 'Texas',
    formSource: 'Contact Page (Texas)',
    contactFormPostUrl: texasContactFormPostUrl,
  },
}

export function getMarketForPath(pathname: string | undefined): MarketConfig {
  if (!pathname) return MARKETS.national
  if (pathname === '/chicago' || pathname.startsWith('/chicago/')) return MARKETS.chicago
  if (pathname === '/texas' || pathname.startsWith('/texas/')) return MARKETS.texas
  if (pathname === '/corporate-headshots') return MARKETS.chicago
  return MARKETS.national
}
