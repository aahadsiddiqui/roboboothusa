import React, { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPhone, FiArrowRight, FiChevronDown, FiMail } from 'react-icons/fi'
import { useRouter } from 'next/router'
import ProductHub from './ProductHub'
import ScrollingTestimonials from './ScrollingTestimonials'
import Navbar from './Navbar'
import { productsForMarket } from '../lib/marketProducts'
import { eventTypes } from '../data/events'
import type { MarketConfig } from '../data/markets'
import { eventTypeHref, featuredBrandActivationsHref, featuredCorporateHref, featuredWeddingHref } from '../lib/eventRoutes'

const stateCards = [
  { name: 'Illinois', href: '/chicago', image: '/images/state-illinois.png' },
  { name: 'Texas', href: '/texas', image: '/images/state-texas.png' },
]

const companyLogos = [
  '/images/adamas.png', '/images/bell.png', '/images/bgo.png', '/images/equifax.svg',
  '/images/geotab.png', '/images/hilton.png', '/images/infosys.png', '/images/meta.png',
  '/images/pdsb.png', '/images/remax.png', '/images/ritz.webp', '/images/rlp.svg',
  '/images/stonex.png', '/images/talent.png', '/images/td.png', '/images/torontopearson.png', '/images/BMO.svg.png',
]

type Props = { market: MarketConfig }

export default function MarketHome({ market }: Props) {
  const showRegionalContact = market.id !== 'national'
  const router = useRouter()
  const [plannerOpen, setPlannerOpen] = useState(false)
  const plannerRef = useRef<HTMLDivElement>(null)
  const m = market.meta

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (plannerRef.current && !plannerRef.current.contains(e.target as Node)) {
        setPlannerOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleEventSelect = (path: string) => {
    setPlannerOpen(false)
    if (path === 'corporate') {
      router.push(featuredCorporateHref(market))
      return
    }
    if (path === 'brand-activation') {
      router.push(featuredBrandActivationsHref(market))
      return
    }
    if (path === 'wedding') {
      router.push(featuredWeddingHref(market))
      return
    }
    router.push(path)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-black">
      <Head>
        <title>{m.title}</title>
        <meta name="description" content={m.description} />
        <meta name="keywords" content={m.keywords} />
        <meta property="og:title" content={m.ogTitle} />
        <meta property="og:description" content={m.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={m.ogUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={m.ogTitle} />
        <meta name="twitter:description" content={m.ogDescription} />
        <link rel="canonical" href={m.canonical} />
      </Head>

      <Navbar />

      <section className="pt-20 md:pt-24 pb-6 md:pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 md:mb-4">
              {market.heroBefore}
              <span className="text-[#fce4a6]">{market.heroHighlight}</span>
              <br className="hidden md:block" />
              <span className="text-white/90"> {market.heroLine2}</span>
            </h1>
            <p className="text-white/60 text-sm md:text-lg lg:text-xl max-w-2xl mx-auto">
              Your one-stop shop for photography and event entertainment
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-2 px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#fce4a6] text-center md:text-left">
            {market.id === 'national' ? 'Choose Your State' : 'Choose Your Event Experience'}
          </p>
        </motion.div>
      </section>

      {market.id === 'national' ? (
        <section className="pb-8 md:pb-12 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {stateCards.map((state, i) => (
              <motion.div
                key={state.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.5 }}
              >
                <Link
                  href={state.href}
                  className="group relative block aspect-[4/3] md:aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 hover:border-[#fce4a6]/50 transition-colors shadow-xl shadow-black/40"
                >
                  <img
                    src={state.image}
                    alt={`${state.name} skyline`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-1">
                      {state.name}
                    </h2>
                    <p className="text-[#fce4a6] text-sm md:text-base font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Explore RoboBooth
                      <FiArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      ) : (
        <ProductHub
          title=""
          subtitle=""
          products={productsForMarket(market)}
          hideHeader
          market={market}
        />
      )}

      <section className="py-8 md:py-10 border-t border-white/5 overflow-hidden bg-black">
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-xl md:text-3xl lg:text-4xl font-black text-white mb-2"
          >
            Companies We&apos;ve <span className="text-[#fce4a6]">Worked With</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-white/40 text-xs md:text-sm"
          >
            {market.regionTrustBlurb}
          </motion.p>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center gap-10 md:gap-16 px-4">
            {[...companyLogos, ...companyLogos].map((logo, i) => (
              <div key={i} className="flex-shrink-0 w-32 md:w-44 h-20 md:h-24 flex items-center justify-center">
                <img
                  src={logo}
                  alt="Client"
                  className={`w-full h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 ${
                    logo.includes('ritz.webp') || logo.includes('hilton.png')
                      ? 'filter invert grayscale'
                      : logo.includes('td.png')
                        ? ''
                        : 'filter brightness-0 invert'
                  }`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {market.id !== 'national' && (
      <section className="py-10 md:py-14 px-4 border-t border-white/5 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[#fce4a6]/60 text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase mb-3">Find Your Perfect Experience</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 md:mb-8 leading-tight">
              I&apos;m planning a<span className="text-[#fce4a6]">...</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            ref={plannerRef}
            className="relative inline-block w-full max-w-md"
          >
            <button
              onClick={() => setPlannerOpen(!plannerOpen)}
              className="w-full flex items-center justify-between bg-white/[0.06] border-2 border-[#fce4a6]/40 hover:border-[#fce4a6]/80 text-white px-5 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg transition-all group"
            >
              <span className={plannerOpen ? 'text-white' : 'text-white/50'}>
                {plannerOpen ? 'Select your event type' : 'Select your event type'}
              </span>
              <FiChevronDown className={`w-5 h-5 text-[#fce4a6] transition-transform duration-200 ${plannerOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {plannerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-black/98 backdrop-blur-xl border border-[#fce4a6]/20 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-50"
                >
                  <div className="py-2 max-h-[60vh] overflow-y-auto">
                    {[
                      { slug: 'corporate', name: 'Corporate Event', emoji: '🏢' },
                      { slug: 'brand-activation', name: 'Brand Activation', emoji: '🚀' },
                      { slug: 'wedding', name: 'Wedding', emoji: '👫' },
                    ].map((item, i) => (
                      <motion.button
                        key={item.slug}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => handleEventSelect(item.slug)}
                        className="w-full flex items-center justify-between px-5 py-3.5 text-left text-white hover:bg-[#fce4a6]/10 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.emoji}</span>
                          <span className="font-bold text-sm md:text-base">{item.name}</span>
                        </div>
                        <FiArrowRight className="w-4 h-4 text-[#fce4a6] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </motion.button>
                    ))}
                    <div className="mx-5 my-1 border-t border-white/10" />
                    {eventTypes.filter((e) => e.slug !== 'weddings').map((event, i) => (
                      <motion.button
                        key={event.slug}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (i + 3) * 0.03 }}
                        onClick={() => handleEventSelect(eventTypeHref(market, event.slug))}
                        className="w-full flex items-center justify-between px-5 py-3.5 text-left text-white/70 hover:text-white hover:bg-[#fce4a6]/10 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{event.emoji}</span>
                          <span className="font-semibold text-sm md:text-base">{event.name}</span>
                        </div>
                        <FiArrowRight className="w-4 h-4 text-[#fce4a6] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-white/30 text-xs mt-4"
          >
            Select your event type to see the perfect package for your celebration
          </motion.p>
        </div>
      </section>
      )}

      <section className="bg-black">
        <ScrollingTestimonials />
      </section>

      {market.id !== 'national' && (
      <section className="py-12 md:py-16 px-4 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white mb-3">
            Ready to Elevate Your <span className="text-[#fce4a6]">Next Event?</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base mb-6 max-w-lg mx-auto">{market.finalCtaBlurb}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              href={market.contactPath}
              className="w-full sm:w-auto bg-[#fce4a6] text-black px-7 py-3.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-base shadow-lg shadow-[#fce4a6]/20 hover:shadow-xl transition-all group text-center"
            >
              Get a Quote <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <a
              href={showRegionalContact ? market.phoneTel : market.contactPath}
              className="flex items-center gap-2 text-[#fce4a6] text-sm font-semibold hover:text-white transition-colors"
            >
              <FiPhone className="w-4 h-4" /> {showRegionalContact ? `Call ${market.phoneDisplay}` : 'Contact Us'}
            </a>
          </div>
          <p className="text-white/30 text-[10px] md:text-xs mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>Responses in &lt;15 mins&ensp;|&ensp;No credit card required</span>
            {showRegionalContact && (
              <>
                <span>|</span>
                <a href={`mailto:${market.intakeEmail}`} className="inline-flex items-center gap-1.5 underline hover:text-white/70">
                  <FiMail className="w-3.5 h-3.5 flex-shrink-0" />
                  {market.intakeEmail}
                </a>
              </>
            )}
          </p>
        </motion.div>
      </section>
      )}

      {market.id !== 'national' && <div className="h-20 md:h-0" />}

      {market.id !== 'national' && (
      <motion.a
        whileTap={{ scale: 0.97 }}
        href={market.contactPath}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-auto z-50 bg-[#fce4a6] text-black font-bold px-6 py-4 rounded-full shadow-xl text-center flex items-center justify-center gap-2"
      >
        Get a Quote <FiArrowRight className="w-4 h-4" />
      </motion.a>
      )}
    </div>
  )
}
