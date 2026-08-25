import React, { useState, useEffect, useCallback, useMemo } from 'react'
import type { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowRight, FiCheck, FiPhone, FiChevronDown, FiChevronUp,
  FiClock, FiX, FiImage, FiShare2, FiStar, FiUsers, FiZap, FiShield, FiTarget, FiTrendingUp
} from 'react-icons/fi'
import { appendUtmParams } from '../lib/utmParams'
import { trackChicagoFormSubmit } from '../lib/trackChicagoFormSubmit'
import { getMarketForPath } from '../data/markets'
import { getRegionalLandingSsp } from '../lib/regionalLandingSsp'
import { localizeMarketingCopy, trustedCompaniesMarqueeLine } from '../lib/marketBranding'

/* ─── Reveal ─── */
const Reveal = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay }} className={className}>
    {children}
  </motion.div>
)

/* ─── Subtle CTA ─── */
const SubtleCTA = ({ label, onQuote }: { label: string; onQuote: () => void }) => (
  <div className="flex justify-center pt-4 pb-2">
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onQuote}
      className="bg-[#fce4a6] text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-md shadow-[#fce4a6]/20 hover:shadow-lg transition-all group">
      {label} <FiArrowRight className="inline ml-1.5 group-hover:translate-x-1 transition-transform" />
    </motion.button>
  </div>
)

/* ════════════════════════════════════════════════════════════════
   TRADE SHOW & EXPO — dedicated Chicago ad funnel.
   Public URL: /chicago/trade-show-events (rewrites to /trade-show-events).
   Distinct from /chicago/events/trade-show-expo, which is the organic
   event landing built on EventPageLayout.
   Hybrid lockdown: no site nav in the header, footer stays for contact
   + social. noindex. Single quote form fires Chicago form_submit.
   ════════════════════════════════════════════════════════════════ */
export const getServerSideProps = getRegionalLandingSsp('/trade-show-events')

export default function TradeShowEvents({ browserPath }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const market = useMemo(() => getMarketForPath(browserPath), [browserPath])
  const publicPath = useMemo(
    () => (market.id === 'national' ? '/trade-show-events' : `${market.basePath}/trade-show-events`),
    [market.basePath, market.id],
  )
  const L = useCallback((s: string) => localizeMarketingCopy(s, market), [market])
  const areaPhrase = market.id === 'chicago' ? 'Serving Chicago & surrounding areas' : market.id === 'texas' ? 'Serving Texas' : 'Serving the USA'
  const [showModal, setShowModal] = useState(false)
  const [packageType, setPackageType] = useState<'bronze' | 'gold' | 'platinum' | ''>('')
  const [form, setForm] = useState({ firstName: '', email: '', phone: '', eventDate: '', budget: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showSticky, setShowSticky] = useState(false)
  const [urgencyDismissed, setUrgencyDismissed] = useState(false)

  useEffect(() => {
    const fn = () => setShowSticky(window.scrollY > 400)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { const t = setTimeout(() => setShowModal(true), 25000); return () => clearTimeout(t) }, [])
  useEffect(() => { showModal ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden'); return () => document.body.classList.remove('overflow-hidden') }, [showModal])
  useEffect(() => {
    const handlePlay = (e: Event) => {
      document.querySelectorAll('video').forEach(v => { if (v !== e.target) v.pause() })
    }
    document.addEventListener('play', handlePlay, true)
    return () => document.removeEventListener('play', handlePlay, true)
  }, [])

  const openQuote = useCallback(() => { setPackageType(''); setShowModal(true) }, [])
  const openBronzePackage = useCallback(() => { setPackageType('bronze'); setShowModal(true) }, [])
  const openGoldPackage = useCallback(() => { setPackageType('gold'); setShowModal(true) }, [])
  const openPlatinumPackage = useCallback(() => { setPackageType('platinum'); setShowModal(true) }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('first-name', form.firstName); fd.append('phone-number', form.phone); fd.append('email', form.email)
      fd.append('event-date', form.eventDate); fd.append('budget', form.budget); fd.append('event-type', 'Trade Show & Expo')
      fd.append('package', packageType === 'gold' ? 'Gold Package (Robot Photobooth + Event Photography)' : packageType === 'platinum' ? 'Platinum Package (Robot + Photography + Second Booth)' : packageType === 'bronze' ? 'Bronze Package (Robot Photobooth Only)' : 'General Inquiry')
      fd.append('_replyto', form.email)
      fd.append('source', market.id === 'national' ? 'Trade Show Funnel' : `Trade Show Funnel (${market.analyticsRegion})`)
      fd.append('intake-market', market.id)
      appendUtmParams(fd)
      const res = await fetch(market.contactFormPostUrl, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      // Chicago-only funnel: fire the deduped `form_submit` on verified success only. No Lead event.
      if (res.ok) { setSuccess(true); if (market.id === 'chicago') trackChicagoFormSubmit() } else { alert('Failed to submit. Please try again.') }
    } catch { alert('Failed to submit. Please try again.') } finally { setSubmitting(false) }
  }

  return (
    <>
      <Head>
        <title>{L('Trade Show & Expo Photobooth Chicago | Robo Booth')}</title>
        <meta
          name="description"
          content={L(
            "Draw the biggest crowd at your next trade show with Chicago's first Robot Photobooth. Branded photos and lead capture built in. Serving Chicago & surrounding areas.",
          )}
        />
        <meta name="keywords" content="trade show photobooth Chicago, expo booth activation Chicago, robot photobooth trade show, exhibitor lead capture Chicago, branded photo booth Chicago" />
        <meta property="og:title" content={L("Trade Show & Expo Robot Photobooth | Robo Booth")} />
        <meta property="og:description" content="Turn your booth into the most-visited destination on the show floor. Branded photos, built-in lead capture, fully managed." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://roboboothusa.com${publicPath}`} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preload" href="/images/robot1.jpg" as="image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={showModal ? 'blur-sm pointer-events-none select-none' : ''}>
        <div className="min-h-screen bg-black text-white overflow-x-hidden">

          {/* ── Funnel top bar: logo only (non-clickable), tel CTA allowed ── */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 h-16 md:h-[4.5rem] flex items-center justify-between">
              <img src="/images/1.png" alt="Robo Booth logo" className="h-10 md:h-12 w-auto object-contain" />
              <a
                href={market.phoneTel}
                className="inline-flex items-center gap-1.5 bg-[#fce4a6] text-black px-4 py-2 rounded-full font-semibold text-sm hover:bg-white transition-colors"
              >
                <FiPhone className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{market.phoneDisplay}</span>
                <span className="sm:hidden">Call Now</span>
              </a>
            </div>
          </div>

          {/* ── Urgency Banner ── */}
          {!urgencyDismissed && (
            <div className="fixed top-16 md:top-[4.5rem] left-0 right-0 z-40 bg-[#fce4a6] text-black text-center py-2 px-4">
              <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold">
                <FiClock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Trade show dates are booking up — <button onClick={openQuote} className="underline font-bold">check availability now</button></span>
                <button onClick={() => setUrgencyDismissed(true)} className="ml-2 text-black/50 hover:text-black"><FiX className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}

          {/* ══ HERO ══ */}
          <section className={`relative ${urgencyDismissed ? 'pt-20 md:pt-24' : 'pt-[7rem] md:pt-[8rem]'} pb-6 md:pb-8 px-4`}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#fce4a620_0%,_transparent_50%)] pointer-events-none" />
            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🏢</span>
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                    <span className="text-white/60 text-xs font-medium">5.0 Rating · {areaPhrase}</span>
                  </div>
                  <p className="text-[#fce4a6]/70 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-2">Trade Show &amp; Expo Activation</p>
                  <h1 className="text-[1.65rem] leading-[1.15] md:text-4xl lg:text-5xl font-black md:leading-[1.1] mb-4">
                    The Trade Show Booth That <span className="text-[#fce4a6]">Draws the Biggest Crowd</span>
                  </h1>
                  <p className="text-white/80 text-sm md:text-base lg:text-lg leading-relaxed mb-5 max-w-xl">
                    {L(
                      "Stop competing for floor traffic. USA's first Robot Photobooth turns your booth into the event's most-visited destination — with branded photos putting your company name in every attendee's pocket.",
                    )}{' '}
                    <span className="text-white font-semibold">Built-in lead capture ensures every interaction becomes a qualified contact.</span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openQuote}
                      className="w-full sm:w-auto bg-[#fce4a6] text-black px-6 py-3.5 rounded-full font-bold text-sm md:text-base shadow-lg shadow-[#fce4a6]/20 hover:shadow-xl transition-all group text-center">
                      Check Availability <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    <a href={market.phoneTel} className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-[#fce4a6]/40 text-[#fce4a6] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#fce4a6]/10 transition-all text-center">
                      <FiPhone className="w-4 h-4" /> Call {market.phoneDisplay}
                    </a>
                  </div>
                  <p className="text-white/40 text-[11px] md:text-xs">Responses in &lt;15 mins&ensp;|&ensp;No credit card required</p>
                </motion.div>

                {/* Desktop hero video */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="hidden md:block">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                    <video className="w-full h-[480px] lg:h-[520px] object-contain" controls loop playsInline preload="metadata" poster="/images/robot1.jpg" style={{ display: 'block' }}>
                      <source src="/videos/equifaxrobot.mov" type="video/quicktime" />
                      <source src="/videos/equifaxrobot.mov" type="video/mp4" />
                    </video>
                  </div>
                </motion.div>

                {/* Mobile hero video */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="md:hidden -mx-4">
                  <div className="overflow-hidden bg-black">
                    <video className="w-full max-h-[50vh] object-contain" controls loop playsInline preload="metadata" poster="/images/robot1.jpg" style={{ display: 'block' }}>
                      <source src="/videos/equifaxrobot.mov" type="video/quicktime" />
                      <source src="/videos/equifaxrobot.mov" type="video/mp4" />
                    </video>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── Logo Marquee ── */}
          <section className="py-4 md:py-6 border-y border-[#fce4a6]/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-3">
              <p className="text-center text-[#fce4a6]/60 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase">{trustedCompaniesMarqueeLine(market)}</p>
            </div>
            <div className="relative w-full overflow-hidden">
              <div className="animate-marquee flex items-center gap-10 md:gap-14 px-4">
                {[...(market.id === 'chicago' ? chicagoCompanyLogos : companyLogos), ...(market.id === 'chicago' ? chicagoCompanyLogos : companyLogos)].map((logo, i) => (
                  <div key={i} className="flex-shrink-0 w-32 md:w-44 h-20 md:h-24 flex items-center justify-center">
                    <img src={logo} alt="Client" className={`w-full h-full object-contain opacity-60 hover:opacity-100 transition-opacity ${logo.includes('ritz.webp') || logo.includes('hilton.png') ? 'filter invert grayscale' : logo.includes('td.png') ? '' : 'filter brightness-0 invert'}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── How It Works ── */}
          <section className="py-8 md:py-10 px-4">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">How It <span className="text-[#fce4a6]">Works</span></h2>
                <p className="text-white/50 text-xs md:text-sm">Simple, fully managed, and stress-free</p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {howItWorks.map((step, i) => (
                  <Reveal key={i} delay={i * 0.12} className="relative">
                    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 md:p-6 text-center hover:border-[#fce4a6]/30 transition-colors group h-full">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#fce4a6]/10 border border-[#fce4a6]/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#fce4a6]/20 transition-colors">
                        <span className="text-[#fce4a6] font-black text-lg md:text-xl">{i + 1}</span>
                      </div>
                      <h3 className="font-bold text-sm md:text-base mb-1.5 text-white">{step.title}</h3>
                      <p className="text-white/50 text-xs md:text-sm leading-relaxed">{step.desc}</p>
                    </div>
                    {i < 2 && <div className="hidden md:block absolute top-1/2 -right-3 w-6 text-[#fce4a6]/30 text-2xl">→</div>}
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.2} className="mt-8">
                <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <video className="w-full max-h-[60vh] object-contain" controls loop playsInline preload="metadata" poster="/images/robottd.jpg" style={{ display: 'block' }}>
                    <source src="/videos/bmorobot.MOV" type="video/quicktime" />
                    <source src="/videos/bmorobot.MOV" type="video/mp4" />
                  </video>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── Packages ── */}
          <section className="py-10 md:py-14 px-4">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2">Choose Your <span className="text-[#fce4a6]">Package</span></h2>
                <p className="text-white/50 text-sm md:text-base">Every show is different — pick the package that fits your booth.</p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-stretch">

                {/* Bronze */}
                <Reveal>
                  <div className="relative rounded-3xl border border-white/20 bg-white/[0.04] p-6 md:p-7 h-full flex flex-col">
                    <div className="flex justify-center mb-4">
                      <span className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
                        Bronze Package
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-center mb-2">Robot Photobooth <span className="text-white/50">Only</span></h3>
                    <p className="text-white/50 text-xs text-center mb-6">The standalone trade show activation — the fastest way to make your booth the busiest on the floor.</p>
                    <div className="space-y-2.5 mb-8 flex-1">
                      {[
                        'Company branding and product imagery integrated into every photo overlay for instant brand recall',
                        'Robot draws attendees to your booth from across the show floor — no passive waiting for walk-bys',
                        'Instant photo delivery to attendee phones via SMS — your brand in their pocket before they leave your booth',
                        'Custom sales voice messaging introduces your company, product line, or key value proposition',
                        'Dedicated on-site operator runs the activation so your sales team can stay focused on conversations',
                      ].map((b, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <FiCheck className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                          <p className="text-white/60 text-xs leading-relaxed">{b}</p>
                        </div>
                      ))}
                    </div>
                    <div className="text-center">
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openBronzePackage}
                        className="border-2 border-white/30 text-white px-4 py-3 rounded-full font-bold text-xs md:text-sm hover:bg-white/10 transition-all group w-full">
                        Book Bronze Package <FiArrowRight className="inline ml-1 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                      <p className="text-white/30 text-[10px] mt-2">Responses in &lt;15 mins · No credit card required</p>
                    </div>
                  </div>
                </Reveal>

                {/* Gold */}
                <Reveal delay={0.1}>
                  <div className="relative rounded-3xl overflow-hidden border-2 border-[#fce4a6]/50 bg-gradient-to-br from-[#fce4a6]/10 via-black to-black p-6 md:p-7 shadow-2xl shadow-[#fce4a6]/10 h-full flex flex-col">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#fce4a625_0%,_transparent_65%)] pointer-events-none" />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-center mb-4">
                        <span className="inline-flex items-center gap-2 bg-[#fce4a6] text-black text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg">
                          ⭐ Most Popular · Gold
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-center mb-2">Robot Photobooth + <span className="text-[#fce4a6]">Event Photography</span></h3>
                      <p className="text-white/60 text-xs text-center mb-6">Capture every trade show moment — the crowds, the energy, and the product — for post-show marketing.</p>
                      <div className="space-y-2.5 mb-8 flex-1">
                        {[
                          'Everything in the Bronze Package, fully customised to your trade show booth',
                          'Professional photographer documents your booth traffic, product demonstrations, and team in action',
                          'High-quality imagery of your booth at peak crowd density — proof of engagement for stakeholders',
                          'Coordinated content capture so robot activations and photography tell a unified brand story',
                          'Full-resolution gallery delivered within 48 hours — ready for post-show email campaigns',
                          'Full usage rights included — use in sales decks, case studies, and next year\'s show marketing',
                        ].map((b, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <FiCheck className="w-4 h-4 text-[#fce4a6] mt-0.5 flex-shrink-0" />
                            <p className="text-white/70 text-xs leading-relaxed">{b}</p>
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openGoldPackage}
                          className="bg-[#fce4a6] text-black px-4 py-3 rounded-full font-black text-xs md:text-sm shadow-lg shadow-[#fce4a6]/30 hover:shadow-xl transition-all group w-full">
                          Book Gold Package <FiArrowRight className="inline ml-1 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                        <p className="text-white/30 text-[10px] mt-2">Responses in &lt;15 mins · No credit card required</p>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Platinum */}
                <Reveal delay={0.2}>
                  <div className="relative rounded-3xl overflow-hidden border-2 border-white/40 bg-gradient-to-br from-white/[0.08] via-black to-black p-6 md:p-7 h-full flex flex-col" style={{ boxShadow: '0 0 40px rgba(255,255,255,0.06)' }}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.07)_0%,_transparent_60%)] pointer-events-none" />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-center mb-4">
                        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-white/20 to-white/10 text-white text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full border border-white/30">
                          💎 Platinum Package
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-center mb-2">Robot + Photography + <span className="text-white/80">Second Booth</span></h3>
                      <p className="text-white/60 text-xs text-center mb-6">The ultimate booth presence — add a Premium Photobooth or 360 Booth to dominate the show floor from multiple angles.</p>
                      <div className="space-y-2.5 mb-8 flex-1">
                        {[
                          'Everything in the Gold Package, scaled for maximum booth impact',
                          'Add-on: Premium Photobooth or 360 Booth positioned strategically within your booth',
                          'Multiple content moments in a single booth visit increases dwell time and brand engagement',
                          'Different activations attract different attendee personas — broader reach, one booth footprint',
                          'Higher branded content volume amplifies your post-show social presence and organic reach',
                          'Dedicated coordination team manages all activations so your staff can focus entirely on selling',
                        ].map((b, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <FiCheck className="w-4 h-4 text-white/70 mt-0.5 flex-shrink-0" />
                            <p className="text-white/70 text-xs leading-relaxed">{b}</p>
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openPlatinumPackage}
                          className="bg-white text-black px-4 py-3 rounded-full font-black text-xs md:text-sm hover:bg-white/90 transition-all group w-full shadow-lg shadow-white/10">
                          Book Platinum Package <FiArrowRight className="inline ml-1 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                        <p className="text-white/30 text-[10px] mt-2">Responses in &lt;15 mins · No credit card required</p>
                      </div>
                    </div>
                  </div>
                </Reveal>

              </div>
            </div>
          </section>

          {/* ── CTA 1 ── */}
          <SubtleCTA label="Check Availability" onQuote={openQuote} />

          {/* ── Gallery pair 1 ── */}
          <section className="px-4 py-6 md:py-8">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-5">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">Booth <span className="text-[#fce4a6]">Activations</span></h2>
                <p className="text-white/50 text-xs md:text-sm">Real exhibitor activations. Real floor traffic. Real leads.</p>
              </Reveal>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Reveal>
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img src="/images/robotbell.jpg" alt="Robot Photobooth at a trade show booth" className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover" loading="lazy" />
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img src="/images/robottd.jpg" alt="Branded trade show photo activation" className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover" loading="lazy" />
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ── Why Exhibitors Choose Us ── */}
          <section className="py-8 md:py-10 px-4 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">Why Exhibitors <span className="text-[#fce4a6]">Choose Us</span></h2>
                <p className="text-white/50 text-xs md:text-sm">The booth activation that draws the entire floor</p>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {whyExhibitors.map((item, i) => (
                  <Reveal key={i} delay={i * 0.06} className="bg-white/[0.04] border border-white/10 rounded-xl p-4 md:p-5 hover:border-[#fce4a6]/30 transition-colors group">
                    <div className="text-[#fce4a6] mb-2 md:mb-3 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                    <h3 className="font-bold text-sm md:text-base mb-1">{L(item.title)}</h3>
                    <p className="text-white/50 text-[11px] md:text-xs leading-relaxed">{L(item.desc)}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Gallery pair 2 ── */}
          <section className="px-4 py-6 md:py-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Reveal>
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img src="/images/robot1.jpg" alt="Expo floor robot activation" className="w-full h-56 sm:h-64 md:h-80 lg:h-96 object-cover" loading="lazy" />
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img src="/images/robothalloween.JPG" alt="Branded booth photo experience" className="w-full h-56 sm:h-64 md:h-80 lg:h-96 object-cover" loading="lazy" />
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ── CTA 2 ── */}
          <SubtleCTA label="Get a Quote" onQuote={openQuote} />

          {/* ── Customization ── */}
          <section className="py-8 md:py-10 px-4 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">Built Around <span className="text-[#fce4a6]">Your Booth</span></h2>
                <p className="text-white/50 text-xs md:text-sm">Company branding, lead capture, and roaming floor mode all available</p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {customizations.map((item, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="bg-gradient-to-br from-[#fce4a6]/10 to-transparent border border-[#fce4a6]/20 rounded-2xl p-5 md:p-6 h-full hover:border-[#fce4a6]/40 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-[#fce4a6]/10 border border-[#fce4a6]/30 flex items-center justify-center mb-4 text-[#fce4a6] group-hover:bg-[#fce4a6]/20 transition-colors">
                        {item.icon}
                      </div>
                      <h3 className="font-bold text-base md:text-lg text-white mb-2">{L(item.title)}</h3>
                      <p className="text-white/60 text-xs md:text-sm leading-relaxed">{L(item.desc)}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA 3 ── */}
          <SubtleCTA label="Book Now" onQuote={openQuote} />

          {/* ── Testimonials ── */}
          <section className="py-8 md:py-10 px-4 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-5">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">What Clients <span className="text-[#fce4a6]">Are Saying</span></h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <a href="https://g.co/kgs/v9p1CzT" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#fce4a6] hover:text-white transition-colors text-xs md:text-sm">
                    <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-white/50 text-[10px] md:text-xs">5.0 on Google</span>
                  </a>
                </div>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {testimonials.map((t, i) => (
                  <Reveal key={i} delay={i * 0.08} className="bg-white/[0.04] border border-white/10 rounded-xl p-4 md:p-5 hover:border-[#fce4a6]/20 transition-colors">
                    <div className="flex text-[#fce4a6]/60 text-xs mb-3">★★★★★</div>
                    <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#fce4a6]/20 flex items-center justify-center text-[#fce4a6] text-[10px] font-bold">{t.name[0]}</div>
                      <div>
                        <div className="text-white text-[10px] md:text-xs font-bold">{t.name}</div>
                        <div className="text-white/40 text-[10px]">{t.role}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Lead capture highlights ── */}
          <section className="py-8 md:py-10 px-4 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
              <Reveal className="text-center mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">Built for <span className="text-[#fce4a6]">Lead Capture</span></h2>
              </Reveal>
              <div className="space-y-2.5">
                {leadCapturepoints.map((p, i) => (
                  <Reveal key={i} delay={i * 0.05}>
                    <div className="flex items-start gap-3 bg-white/[0.04] border border-white/10 rounded-xl p-4">
                      <FiTarget className="w-4 h-4 text-[#fce4a6] mt-0.5 flex-shrink-0" />
                      <p className="text-white/70 text-xs md:text-sm leading-relaxed">{L(p)}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA 4 ── */}
          <SubtleCTA label="Check Availability" onQuote={openQuote} />

          {/* ── FAQs ── */}
          <section className="py-8 md:py-10 px-4">
            <div className="max-w-3xl mx-auto">
              <Reveal className="text-center mb-5">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">Common <span className="text-[#fce4a6]">Questions</span></h2>
              </Reveal>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <Reveal key={i} delay={i * 0.04}>
                    <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full text-left bg-white/[0.04] border border-white/10 rounded-xl p-3.5 md:p-4 hover:border-[#fce4a6]/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs md:text-base text-white/90 pr-4">{L(faq.question)}</h3>
                        {expandedFaq === i ? <FiChevronUp className="text-[#fce4a6] w-4 h-4 flex-shrink-0" /> : <FiChevronDown className="text-[#fce4a6] w-4 h-4 flex-shrink-0" />}
                      </div>
                      <AnimatePresence>
                        {expandedFaq === i && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-white/60 text-xs md:text-sm mt-2 leading-relaxed">
                            {L(faq.answer)}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Final CTA ── */}
          <section className="py-10 md:py-14 px-4 border-t border-white/5">
            <Reveal className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl md:text-2xl lg:text-4xl font-black mb-2 md:mb-3">
                Have the Most Visited Booth <span className="text-[#fce4a6]">at Your Next Expo.</span>
              </h2>
              <p className="text-white/60 text-xs md:text-sm lg:text-base mb-5 max-w-lg mx-auto">
                Stop blending in. The Robot Photobooth makes your booth the one everyone&apos;s talking about — with every interaction captured as a qualified lead.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openQuote}
                  className="w-full sm:w-auto bg-[#fce4a6] text-black px-7 py-3.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-base shadow-lg shadow-[#fce4a6]/20 hover:shadow-xl transition-all group">
                  Check Availability & Get a Quote <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <a href={market.phoneTel} className="flex items-center gap-2 text-[#fce4a6] text-sm font-semibold hover:text-white transition-colors">
                  <FiPhone className="w-4 h-4" /> {market.phoneDisplay}
                </a>
              </div>
              <p className="text-white/30 text-[10px] md:text-xs mt-2">Responses in &lt;15 mins&ensp;|&ensp;No credit card required</p>
            </Reveal>
          </section>

          <div className="h-20 md:h-16" />
        </div>
      </div>

      {/* ── Lead Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-md p-0 md:p-4">
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
              className="bg-white rounded-t-2xl md:rounded-2xl p-5 md:p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => { setShowModal(false); setPackageType('') }} className="absolute top-3 right-4 text-black/40 hover:text-black text-2xl">×</button>
              {packageType === 'bronze' && (
                <div className="bg-white/90 border border-black/10 rounded-xl px-4 py-2.5 mb-3 flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-black text-xs font-black">🥉 Bronze Package Selected</span>
                  <span className="text-black/60 text-[10px]">Robot Photobooth Only</span>
                </div>
              )}
              {packageType === 'gold' && (
                <div className="bg-[#fce4a6] rounded-xl px-4 py-2.5 mb-3 flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-black text-xs font-black">⭐ Gold Package Selected</span>
                  <span className="text-black/60 text-[10px]">Robot Photobooth + Event Photography</span>
                </div>
              )}
              {packageType === 'platinum' && (
                <div className="bg-gradient-to-r from-white/95 to-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 mb-3 flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-black text-xs font-black">💎 Platinum Package Selected</span>
                  <span className="text-black/60 text-[10px]">Robot + Photography + Second Booth</span>
                </div>
              )}
              <h2 className="text-lg md:text-2xl font-black text-black mb-1 text-center">
                {packageType === 'gold' ? 'Book Gold Package' : packageType === 'bronze' ? 'Book Bronze Package' : packageType === 'platinum' ? 'Book Platinum Package' : 'Get a Trade Show Quote'}
              </h2>

              <p className="text-black/60 text-xs md:text-sm mb-4 text-center">Tell us your show dates and we&apos;ll confirm availability within 15 minutes.</p>
              {success ? (
                <div className="text-green-600 text-center font-bold py-6">Thank you! We&apos;ll be in touch soon.</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-3">
                  <input type="text" name="firstName" value={form.firstName} onChange={handleInput} required placeholder="First Name *"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#fce4a6] focus:border-transparent outline-none text-black" />
                  <input type="tel" name="phone" value={form.phone} onChange={handleInput} required placeholder="Phone Number *"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#fce4a6] focus:border-transparent outline-none text-black" />
                  <input type="email" name="email" value={form.email} onChange={handleInput} required placeholder="Work Email *"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#fce4a6] focus:border-transparent outline-none text-black" />
                  <input type="date" name="eventDate" value={form.eventDate} onChange={handleInput} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#fce4a6] focus:border-transparent outline-none text-black" />
                  <select name="budget" value={form.budget} onChange={handleInput} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#fce4a6] focus:border-transparent outline-none text-black">
                    <option value="">Estimated Budget *</option>
                    <option value="$1500-$2500">$1,500–$2,500</option>
                    <option value="$2500-$4000">$2,500–$4,000</option>
                    <option value="$4000+">$4,000+</option>
                  </select>
                  <button type="submit" disabled={submitting}
                    className="w-full bg-[#fce4a6] text-black py-3.5 rounded-xl font-bold text-sm hover:bg-[#e8d08e] transition-colors">
                    {submitting ? 'Sending…' : 'Get My Quote →'}
                  </button>
                  <p className="text-center text-black/30 text-[10px]">No spam. We respond within 15 minutes during business hours.</p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky CTA ── */}
      <AnimatePresence>
        {!showModal && showSticky && (
          <>
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-[#fce4a6]/30 px-3 py-3 safe-area-pb">
              <div className="flex gap-2">
                <a href={market.phoneTel} className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-[#fce4a6]/30 text-[#fce4a6] py-3 rounded-full font-bold text-sm">
                  <FiPhone className="w-4 h-4" /> Call Now
                </a>
                <button onClick={openQuote} className="flex-[2] flex items-center justify-center gap-2 bg-[#fce4a6] text-black py-3 rounded-full font-bold text-sm shadow-lg shadow-[#fce4a6]/20">
                  Get a Quote <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            <motion.button initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openQuote}
              className="hidden md:flex fixed bottom-6 right-6 z-40 bg-[#fce4a6] text-black font-bold px-6 py-3.5 rounded-full shadow-xl shadow-black/40 hover:bg-white transition-colors text-sm items-center gap-2">
              Get a Trade Show Quote <FiArrowRight className="w-4 h-4" />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── DATA ─── */
const howItWorks = [
  { title: 'Reserve Your Spot', desc: 'Share your booth number, show dates, and brand assets. We design branded photo overlays and program custom sales voice messaging tailored to your products, services, and target buyer.' },
  { title: 'We Set Up In Your Booth', desc: 'Our team arrives during exhibitor load-in, integrates the robot into your booth layout, and has everything running before the show floor opens. No power hookup required from the venue.' },
  { title: 'The Floor Comes to You', desc: 'Attendees from across the expo floor are drawn to your booth by the robot. Every interaction is a qualified lead moment — and every branded photo keeps your company name alive in their phone after they leave.' },
]

const whyExhibitors = [
  { icon: <FiUsers className="w-5 h-5 md:w-6 md:h-6" />, title: 'Biggest Crowd on the Floor', desc: 'A roaming robot is the most visually distinctive thing at any trade show. Attendees cross the floor specifically to interact with it — and they bring their colleagues. Your booth becomes the must-visit destination of the show.' },
  { icon: <FiShare2 className="w-5 h-5 md:w-6 md:h-6" />, title: 'Instant Brand Distribution', desc: 'Every attendee who gets a photo leaves with your company name on their phone. They share it. Their industry contacts see it. Your brand reaches well beyond the show floor without any additional media spend.' },
  { icon: <FiTarget className="w-5 h-5 md:w-6 md:h-6" />, title: 'Lead Generation Built In', desc: 'Photo delivery via SMS creates a natural moment to capture contact information. Every interaction is a warm lead — attendees who\'ve already engaged with your brand and have a positive memory attached to it.' },
  { icon: <FiShield className="w-5 h-5 md:w-6 md:h-6" />, title: 'No Venue Power Needed', desc: 'Trade show power drops are expensive and limiting. The robot operates completely independently — no power outlets, no venue fees, no cables crossing your booth floor. Just show up and activate.' },
  { icon: <FiImage className="w-5 h-5 md:w-6 md:h-6" />, title: 'Physical Branded Prints', desc: 'Offer physical printed photos at your booth — branded with your company name and contact details. Attendees take them home. Your brand sits on their desk, not buried in a swag bag.' },
  { icon: <FiStar className="w-5 h-5 md:w-6 md:h-6" />, title: 'Fully Managed Activation', desc: 'Our operator manages every aspect of the robot activation. Your sales team doesn\'t operate anything — they simply benefit from the steady stream of attendees the robot delivers to your booth all day long.' },
]

const customizations = [
  { icon: <FiImage className="w-5 h-5" />, title: 'Company Branding & Product Overlays', desc: 'Custom photo overlays featuring your company logo, product imagery, and show-specific messaging. Every photo looks like a professional marketing asset — not an event snapshot. Attendees share it because it looks great.' },
  { icon: <FiZap className="w-5 h-5" />, title: 'Custom Sales Voice Messaging', desc: 'Script the robot to introduce your company, announce a show special, highlight your flagship product, or drive attendees to a demo station. A roaming sales tool that works the floor while your team handles one-on-one conversations.' },
  { icon: <FiTrendingUp className="w-5 h-5" />, title: 'Roaming Expo Floor Mode', desc: 'Need to reach attendees beyond your booth perimeter? The robot can roam the broader show floor, directing traffic back to your booth. Pre-approved by show organisers, it\'s the most proactive lead generation tool on the market.' },
]

const leadCapturepoints = [
  'Best for lead capture — built so every booth interaction turns into a qualified contact for your sales team.',
  'We can roam the trade show or expo floor with our attendant on the robot, drawing far more leads than a static display alone.',
  'After the event we export every captured lead to CSV and send you the full file so follow-up is immediate and organised.',
  'Completely brandable: your company branding on the robot, the photo overlays, and the digital delivery.',
  'We can dress and style the robot to match your booth\'s brand elements so the activation feels like part of your stand.',
]

const testimonials = [
  { name: 'Greg F.', role: 'VP Sales, B2B Technology Company', text: 'We\'ve exhibited at the same show for six years and always had to chase foot traffic. This year we had more visitors in the first hour than we normally get in an entire day. The robot drew a crowd that naturally converted into real sales conversations. Pipeline impact was significant.' },
  { name: 'Leila A.', role: 'Marketing Director, Manufacturing Firm', text: 'The branded photos gave us something tangible to follow up on. We knew every person who received a photo had been to our booth and had a positive brand interaction. Our post-show email open rates were the highest we\'ve ever seen — the photo created a memorable connection.' },
  { name: 'Carlos M.', role: 'Head of Partnerships, SaaS Company', text: 'Our booth neighbours asked us afterward how we generated so much traffic. The robot is genuinely the most effective trade show booth investment I\'ve made in 12 years of exhibiting. It pays for itself before lunch on day one.' },
]

const faqs = [
  { question: 'Do I need to get approval from the show organiser before booking?', answer: 'This depends on the specific show and venue. Many trade shows welcome interactive activations and the robot is entirely self-contained with no power or WiFi requirements. We recommend checking with your show organiser early — and we can provide documentation about the activation on request to support your approval process.' },
  { question: 'Can the robot operate outside of our assigned booth footprint?', answer: 'In some shows, yes — the roaming floor mode allows the robot to move beyond your booth perimeter and direct floor traffic back to your stand. This requires prior approval from show management. Our team can advise on how to request this and what parameters are typically permitted.' },
  { question: 'How does the photo lead capture work?', answer: 'When attendees receive their photo via SMS, their phone number is logged. Attendees can also scan a QR code and complete a short survey. This creates a contact list of everyone who engaged with your booth, which we export to CSV after the show. We advise on compliant, opt-in implementation.' },
  { question: 'Can the robot\'s messaging be updated between show days?', answer: 'Yes. If your show runs multiple days, we can update voice lines or overlay messaging between days to promote different products, announce a daily show special, or refresh the experience for repeat visitors. This is particularly effective for longer expo runs.' },
  { question: 'What\'s the minimum booth size required for the robot to operate effectively?', answer: 'The robot can work in booths as small as a standard 10x10 inline space. For smaller booths, it can operate primarily within your booth footprint. For larger island or peninsula booths, it roams the perimeter and draws attention from a wider area. Our team will assess your specific booth layout during planning.' },
  { question: 'How far in advance should we book?', answer: 'We recommend booking 6–8 weeks before your show so there is time for branding design, voice scripting, and any organiser approvals. Peak trade show season fills quickly — contact us now to check availability for your dates.' },
]

const companyLogos = [
  '/images/adamas.png', '/images/bell.png', '/images/bgo.png', '/images/equifax.svg',
  '/images/geotab.png', '/images/hilton.png', '/images/infosys.png', '/images/meta.png',
  '/images/pdsb.png', '/images/remax.png', '/images/ritz.webp', '/images/rlp.svg',
  '/images/stonex.png', '/images/talent.png', '/images/td.png', '/images/torontopearson.png', '/images/BMO.svg.png',
]

const chicagoCompanyLogos = [
  '/images/adamas.png', '/images/equifax.svg', '/images/hilton.png', '/images/infosys.png',
  '/images/meta.png', '/images/remax.png', '/images/ritz.webp', '/images/stonex.png', '/images/talent.png',
]
