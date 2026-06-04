import type { MarketConfig } from '../data/markets'
import {
  TEXAS_SERVICE_AREA,
  texasAcrossPhrase,
  texasInPhrase,
  texasServingLine,
  texasTrustedBrandsCouplesLine,
  texasTrustedBrandsLine,
  texasTrustedCompaniesLine,
  texasTrustedCouplesLine,
} from './texasServiceArea'

/** Badges and hero lines on product pages for a regional market. */
export function localizeProductBadges(badges: string[], market: MarketConfig): string[] {
  if (market.id === 'national') return badges
  return badges.map((b) => {
    if (b === 'Free delivery in USA' || b.includes('Free delivery in USA')) {
      if (market.id === 'chicago') return 'Free delivery in Chicago & surrounding areas'
      if (market.id === 'texas') return `Free delivery in ${TEXAS_SERVICE_AREA}`
    }
    if (b === 'Rapid turnaround' && market.id === 'chicago') return 'Rapid turnaround for Chicago & surrounding area events'
    if (b === 'Rapid turnaround' && market.id === 'texas') return `Rapid turnaround for events in ${TEXAS_SERVICE_AREA}`
    if (b === 'We come to you' && market.id === 'chicago') return 'We come to you in Chicago & surrounding areas'
    if (b === 'We come to you' && market.id === 'texas') return `We come to you ${texasInPhrase}`
    return b
  })
}

export function productServingLine(market: MarketConfig): string | undefined {
  if (market.id === 'chicago') return 'Serving Chicago & surrounding areas'
  if (market.id === 'texas') return texasServingLine
  return undefined
}

/** “Trusted by…” marquee on custom product landing pages (360, premium, etc.) */
export function getLandingTrustedLine(market: MarketConfig): string {
  if (market.id === 'chicago') return 'Trusted by leading companies across Chicago & surrounding areas'
  if (market.id === 'texas') return texasTrustedCompaniesLine
  return 'Trusted by leading companies across USA'
}

type RobotPageCopy = {
  ratingSubtext: string
  trustedCompanies: string
  packageRobotFeature: string
  platinumEventSetup: string
  finalCtaTitle: string
  metaTitle: string
  metaDescription: string
  ogDescription: string
}

export function getRobotBoothPageCopy(market: MarketConfig): RobotPageCopy {
  if (market.id === 'chicago') {
    return {
      ratingSubtext: "5.0 Rating · Chicago's First Robot Photobooth",
      trustedCompanies: 'Trusted by leading companies across Chicago & surrounding areas',
      packageRobotFeature: "Chicago's First Robot Photobooth roaming guest-to-guest",
      platinumEventSetup: 'The most talked-about event setup in Chicago & surrounding areas',
      finalCtaTitle: "Chicago's First Robot Photobooth.",
      metaTitle: "Robot Photobooth | Chicago's First Robot Photobooth | Robo Booth",
      metaDescription:
        "Chicago's first robot photobooth that roams your event, engages guests, and captures studio-quality photos anywhere. Serving Chicago & surrounding areas. Reserve your date now.",
      ogDescription: "The robot photobooth that comes to your guests. Chicago & surrounding areas.",
    }
  }
  if (market.id === 'texas') {
    return {
      ratingSubtext: "5.0 Rating · Texas's First Robot Photobooth",
      trustedCompanies: texasTrustedCompaniesLine,
      packageRobotFeature: "Texas's First Robot Photobooth roaming guest-to-guest",
      platinumEventSetup: `The most talked-about event setup ${texasInPhrase}`,
      finalCtaTitle: "Texas's First Robot Photobooth.",
      metaTitle: "Robot Photobooth | Texas's First Robot Photobooth | Robo Booth",
      metaDescription:
        `Texas's first robot photobooth that roams your event, engages guests, and captures studio-quality photos anywhere. ${texasServingLine}. Reserve your date now.`,
      ogDescription: `The robot photobooth that comes to your guests. ${TEXAS_SERVICE_AREA}.`,
    }
  }
  return {
    ratingSubtext: "5.0 Rating · USA's First Robot Photobooth",
    trustedCompanies: 'Trusted by leading companies across USA',
    packageRobotFeature: "USA's First Robot Photobooth roaming guest-to-guest",
    platinumEventSetup: 'The most talked-about event setup in the USA',
    finalCtaTitle: "USA's First Robot Photobooth.",
    metaTitle: "Robot Photobooth | USA's First Robot Photobooth | Robo Booth",
    metaDescription:
      "USA's first robot photobooth that roams your event, engages guests, and captures studio-quality photos anywhere. No booth setup, no venue requirements. Reserve your date now.",
    ogDescription: "The robot photobooth that comes to your guests. USA's first.",
  }
}

export function getProductSeoName(market: MarketConfig, name: string): { title: string; desc: (summary: string) => string } {
  if (market.id === 'chicago') {
    return {
      title: `${name} | Robo Booth Chicago`,
      desc: (summary: string) => `${summary} Serving Chicago & surrounding areas.`,
    }
  }
  if (market.id === 'texas') {
    return {
      title: `${name} | Robo Booth Texas`,
      desc: (summary: string) => `${summary} ${texasServingLine}.`,
    }
  }
  return {
    title: `${name} | Robo Booth Product Hub`,
    desc: (summary: string) => summary,
  }
}
