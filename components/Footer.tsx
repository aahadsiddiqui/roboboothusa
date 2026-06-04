import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getMarketForPath } from '../data/markets'
import { TEXAS_SERVICE_AREA } from '../lib/texasServiceArea'

export default function Footer() {
  const router = useRouter()
  const path = (router.asPath || router.pathname || '/').split('?')[0] || '/'
  const market = getMarketForPath(path)

  const homeHref = market.id === 'national' ? '/' : market.basePath

  const quickLinks = [
    { href: homeHref, label: 'Home' },
    { href: market.contactPath, label: 'Contact' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
  ]

  const regionTagline =
    market.id === 'national'
      ? 'Proudly serving the USA.'
      : market.id === 'texas'
        ? `Proudly serving ${TEXAS_SERVICE_AREA}.`
        : `Proudly serving ${market.analyticsRegion} and surrounding areas.`

  return (
    <div className="bg-black w-full">
      <footer className="bg-black text-white border-t border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Robo Booth</h3>
              <p className="text-white/70">The Future of Event Photography</p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Contact</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Use our{' '}
                <Link
                  href={market.contactPath}
                  className="text-[#fce4a6] hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  contact form
                </Link>{' '}
                and our team will reply quickly.
              </p>
              {market.id !== 'national' && (
                <div className="mt-4 space-y-2 text-white/70 text-sm">
                  <p>
                    <a href={market.phoneTel} className="text-[#fce4a6] hover:text-white transition-colors">
                      {market.phoneDisplay}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${market.intakeEmail}`}
                      className="text-[#fce4a6] hover:text-white transition-colors break-all"
                    >
                      {market.intakeEmail}
                    </a>
                  </p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70">
            <p>{regionTagline}</p>
            <p className="mt-1">© {new Date().getFullYear()} Robo Booth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const socialLinks = [
  {
    href: 'https://instagram.com/roboboothusa.com',
    label: 'Instagram',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
]
