import React, { useState, useEffect, useCallback, useMemo } from 'react'
import type { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiCheck, FiPhone, FiChevronDown, FiChevronUp, FiClock, FiX, FiZap, FiUsers, FiStar, FiShield, FiImage, FiShare2 } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import { appendUtmParams } from '../lib/utmParams'
import { getMarketForPath } from '../data/markets'
import { getRegionalLandingSsp } from '../lib/regionalLandingSsp'
import {
  corporateHeroRatingLine,
  localizeMarketingCopy,
  trustedBrandsMarqueeLine,
} from '../lib/marketBranding'

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
   BRAND ACTIVATIONS LANDING PAGE
   ════════════════════════════════════════════════════════════════ */
export const getServerSideProps = getRegionalLandingSsp('/brand-activations')

export default function BrandActivations({ browserPath }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const market = useMemo(() => getMarketForPath(browserPath), [browserPath])
  const publicPath = useMemo(
    () => (market.id === 'national' ? '/brand-activations' : `${market.basePath}/brand-activations`),
    [market.basePath, market.id],
  )
  const L = useCallback((s: string) => localizeMarketingCopy(s, market), [market])
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
      document.querySelectorAll('video').forEach(v => { if (v !== e.target) { v.pause() } })
    }
    document.addEventListener('play', handlePlay, true)
    return () => document.removeEventListener('play', handlePlay, true)
  }, [])

  const openQuote = useCallback(() => { setPackageType(''); setShowModal(true) }, [])
  const openBronzePackage = useCallback(() => { setPackageType('bronze'); setShowModal(true) }, [])
  const openGoldPackage = useCallback(() => { setPackageType('gold'); setShowModal(true) }, [])
  const openPlatinumPackage = useCallback(() => { setPackageType('platinum'); setShowModal(true) }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('first-name', form.firstName); fd.append('phone-number', form.phone); fd.append('email', form.email)
      fd.append('event-date', form.eventDate); fd.append('budget', form.budget); fd.append('event-type', 'Brand Activation')
      fd.append('package', packageType === 'gold' ? 'Gold Package (Robot Photobooth + Event Photography)' : packageType === 'platinum' ? 'Platinum Package (Robot Photobooth + Event Photography + Second Booth)' : packageType === 'bronze' ? 'Bronze Package (Robot Photobooth Only)' : 'General Inquiry')
      fd.append('_replyto', form.email)
      fd.append('source', market.id === 'national' ? 'Brand Activations Page' : `Brand Activations Page (${market.analyticsRegion})`)
      fd.append('intake-market', market.id)
      appendUtmParams(fd)
      const res = await fetch(market.contactFormPostUrl, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      if (res.ok) { setSuccess(true) } else { alert('Failed to submit. Please try again.') }
    } catch { alert('Failed to submit. Please try again.') } finally { setSubmitting(false) }
  }

  return (
    <>
      <Head>
        <title>{L('Brand Activations & Product Launches Chicago USA | Robo Booth')}</title>
        <meta
          name="description"
          content={L(
            "Turn your brand launch into an experience guests can't stop talking about. USA's first Robot Photobooth for brand activations in Chicago & USA.",
          )}
        />
        <meta name="keywords" content="brand activation Chicago, product launch photobooth USA, brand experience robot photobooth, experiential marketing Chicago" />
        <meta property="og:title" content="Brand Activations | Robo Booth" />
        <meta
          property="og:description"
          content={L(
            "Make your brand launch unforgettable. USA's first Robot Photobooth delivers branded content to every guest in real-time.",
          )}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://roboboothusa.com${publicPath}`} />
        <link rel="canonical" href={`https://roboboothusa.com${publicPath}`} />
        <link rel="preload" href="/images/robotbell.jpg" as="image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={showModal ? 'blur-sm pointer-events-none select-none' : ''}>
        <div className="min-h-screen bg-black text-white overflow-x-hidden">

          {/* ── Navbar ── */}
          <Navbar />

          {/* ── Urgency Banner ── */}
          {!urgencyDismissed && (
            <div className="fixed top-16 md:top-[4.5rem] left-0 right-0 z-40 bg-[#fce4a6] text-black text-center py-2 px-4">
              <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold">
                <FiClock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Brand activation dates are filling fast — <button onClick={openQuote} className="underline font-bold">check availability now</button></span>
                <button onClick={() => setUrgencyDismissed(true)} className="ml-2 text-black/50 hover:text-black"><FiX className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
              HERO
             ═══════════════════════════════════════ */}
          <section className={`relative ${urgencyDismissed ? 'pt-20 md:pt-24' : 'pt-[7rem] md:pt-[8rem]'} pb-6 md:pb-8 px-4`}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#fce4a620_0%,_transparent_50%)] pointer-events-none" />
            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                    <span className="text-white/60 text-xs font-medium">{corporateHeroRatingLine(market)}</span>
                  </div>
                  <h1 className="text-[1.65rem] leading-[1.15] md:text-4xl lg:text-5xl font-black md:leading-[1.1] mb-4">
                    The Brand Activation That <span className="text-[#fce4a6]">Gets Everyone Talking</span>
                  </h1>
                  <p className="text-white/80 text-sm md:text-base lg:text-lg leading-relaxed mb-5 max-w-xl">
                    {L(
                      "USA's first Robot Photobooth turns your brand launch into a live, shareable experience. Your logo on every photo, delivered instantly to every guest's phone in real-time.",
                    )}{' '}
                    <span className="text-white font-semibold">White-glove service — we handle the tech, you own the moment.</span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openQuote}
                      className="w-full sm:w-auto bg-[#fce4a6] text-black px-6 py-3.5 rounded-full font-bold text-sm md:text-base shadow-lg shadow-[#fce4a6]/20 hover:shadow-xl transition-all group text-center">
                      Check Availability <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    <a href={market.phoneTel} className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-[#fce4a6]/40 text-[#fce4a6] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#fce4a6]/10 transition-all text-center">
                      <FiPhone className="w-4 h-4" /> Contact Us
                    </a>
                  </div>
                  <p className="text-white/40 text-[11px] md:text-xs">Responses in &lt;15 mins&ensp;|&ensp;No credit card required</p>
                </motion.div>

                {/* Hero video — desktop */}
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
              <p className="text-center text-[#fce4a6]/60 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase">{trustedBrandsMarqueeLine(market)}</p>
            </div>
            <div className="relative w-full overflow-hidden">
              <div className="animate-marquee flex items-center gap-10 md:gap-14 px-4">
                {[...companyLogos, ...companyLogos].map((logo, i) => (
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
                <p className="text-white/50 text-xs md:text-sm">Simple, fully managed, and stress-free for your brand team</p>
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

              {/* How It Works video */}
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

          {/* ── Packages: Bronze + Gold + Platinum ── */}
          <section className="py-10 md:py-14 px-4">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2">Choose Your <span className="text-[#fce4a6]">Package</span></h2>
                <p className="text-white/50 text-sm md:text-base">Every brand is different — pick the activation that fits your launch.</p>
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
                    <p className="text-white/50 text-xs text-center mb-6">The standalone brand activation experience — fully set up, operated, and managed by our team.</p>
                    <div className="space-y-2.5 mb-8 flex-1">
                      {[
                        'Robot Photobooth roaming guest-to-guest at your launch',
                        'Physical prints with your brand delivered on the spot',
                        'Branded photo overlays with your logo and campaign',
                        'Dedicated on-site attendant handling everything',
                        'Guests receive digital copies instantly to their phones',
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
                      <p className="text-white/60 text-xs text-center mb-6">Capture every moment of your brand launch from two unforgettable perspectives.</p>
                      <div className="space-y-2.5 mb-8 flex-1">
                        {[
                          L("USA's First Robot Photobooth roaming your launch event"),
                          'Professional event photographer covering every key moment',
                          'Candid guest and brand interaction photography',
                          'Product reveal and highlight moments captured',
                          'Professionally edited high-resolution images delivered after the event',
                          'Custom photo overlays and fully branded activation experience',
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
                      <h3 className="text-lg md:text-xl font-black text-center mb-2">Full Activation + Photography + <span className="text-white/80">Second Booth</span></h3>
                      <p className="text-white/60 text-xs text-center mb-6">{L('The ultimate brand launch experience — add a 360 Booth, Aerial Booth, or Premium Photobooth.')}</p>
                      <div className="space-y-2.5 mb-8 flex-1">
                        {[
                          'Everything included in the Gold Package',
                          L('Add-on: 360 Booth, Aerial Booth, or Premium Photobooth'),
                          'Two interactive activations running simultaneously',
                          'Maximum brand exposure and guest engagement',
                          'One team coordinating everything seamlessly',
                          L('The most talked-about brand launch setup in the USA'),
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

          {/* ── Brand Activation Image ── */}
          <section className="px-4 py-6 md:py-8">
            <div className="max-w-5xl mx-auto">
              <Reveal>
                <div className="rounded-2xl overflow-hidden border border-white/10">
                  <img src="/images/corporate1.JPG" alt="Brand Activation Robot Photobooth" className="w-full h-auto object-cover max-h-[60vh]" loading="lazy" />
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── Why Brands Choose Us ── */}
          <section className="py-8 md:py-10 px-4 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">Why Brands <span className="text-[#fce4a6]">Choose Us</span></h2>
                <p className="text-white/50 text-xs md:text-sm">The activation that turns your launch into a social moment</p>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {whyBrandsLove.map((item, i) => (
                  <Reveal key={i} delay={i * 0.06} className="bg-white/[0.04] border border-white/10 rounded-xl p-4 md:p-5 hover:border-[#fce4a6]/30 transition-colors group">
                    <div className="text-[#fce4a6] mb-2 md:mb-3 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                    <h3 className="font-bold text-sm md:text-base mb-1">{L(item.title)}</h3>
                    <p className="text-white/50 text-[11px] md:text-xs leading-relaxed">{L(item.desc)}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Gallery ── */}
          <section className="px-4 py-6 md:py-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Reveal>
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img src="/images/robotbell.jpg" alt="Brand Activation at Bell event" className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover" loading="lazy" />
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img src="/images/robottd.jpg" alt="Brand Activation at TD Coliseum" className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover" loading="lazy" />
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ── CTA 2 ── */}
          <SubtleCTA label="Get a Brand Activation Quote" onQuote={openQuote} />

          {/* ── Built Around Your Brand ── */}
          <section className="py-8 md:py-10 px-4 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">Built Around <span className="text-[#fce4a6]">Your Brand</span></h2>
                <p className="text-white/50 text-xs md:text-sm">Every detail of the activation is tailored to your campaign</p>
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

          {/* ── Gallery pair 2 ── */}
          <section className="px-4 py-6 md:py-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Reveal>
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img src="/images/robot1.jpg" alt="Brand Activation Robot Photobooth" className="w-full h-56 sm:h-64 md:h-80 lg:h-96 object-cover" loading="lazy" />
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img src="/images/robothalloween.JPG" alt="Brand Activation themed event" className="w-full h-56 sm:h-64 md:h-80 lg:h-96 object-cover" loading="lazy" />
                  </div>
                </Reveal>
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

          {/* ── Testimonial Videos ── */}
          <section className="px-4 py-6 md:py-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Reveal>
                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
                    <video className="w-full max-h-[60vh] object-contain" controls loop playsInline preload="metadata" style={{ display: 'block' }}>
                      <source src="/videos/tdtestimonial.mov" type="video/quicktime" />
                      <source src="/videos/tdtestimonial.mov" type="video/mp4" />
                    </video>
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
                    <video className="w-full max-h-[60vh] object-contain" controls loop playsInline preload="metadata" style={{ display: 'block' }}>
                      <source src="/videos/robottest1.MOV" type="video/quicktime" />
                      <source src="/videos/robottest1.MOV" type="video/mp4" />
                    </video>
                  </div>
                </Reveal>
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
                Your Brand Launch Should Be <span className="text-[#fce4a6]">Unforgettable.</span>
              </h2>
              <p className="text-white/60 text-xs md:text-sm lg:text-base mb-5 max-w-lg mx-auto">
                Join Chicago&apos;s top brands that trust Robo Booth to make their activations the talk of the room. Branded, automated, and fully managed — we handle everything.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openQuote}
                  className="w-full sm:w-auto bg-[#fce4a6] text-black px-7 py-3.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-base shadow-lg shadow-[#fce4a6]/20 hover:shadow-xl transition-all group">
                  Check Availability & Get a Quote <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <a href={market.phoneTel} className="flex items-center gap-2 text-[#fce4a6] text-sm font-semibold hover:text-white transition-colors">
                  <FiPhone className="w-4 h-4" /> Contact Us
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
              <h2 className="text-lg md:text-2xl font-black text-black mb-1 text-center">{packageType === 'gold' ? 'Book Gold Package' : packageType === 'bronze' ? 'Book Bronze Package' : packageType === 'platinum' ? 'Book Platinum Package' : 'Get a Brand Activation Quote'}</h2>
              <p className="text-black/60 text-xs md:text-sm mb-4 text-center">Tell us your event date and we&apos;ll confirm availability within 15 minutes.</p>
              {success ? (
                <div className="text-green-600 text-center font-bold py-6">Thank you! We&apos;ll be in touch soon.</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-3">
                  <input type="text" name="firstName" value={form.firstName} onChange={handleInput} required placeholder="First Name *"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#fce4a6] focus:border-transparent outline-none text-black" />
                  <input type="tel" name="phone" value={form.phone} onChange={handleInput} required placeholder="Phone Number *"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#fce4a6] focus:border-transparent outline-none text-black" />
                  <input type="email" name="email" value={form.email} onChange={handleInput} required placeholder="Email *"
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
              Get a Brand Activation Quote <FiArrowRight className="w-4 h-4" />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── DATA ─── */
const howItWorks = [
  { title: 'You Brief Us', desc: 'Share your brand, campaign goals, and event details. We confirm availability fast and build a fully custom activation plan around your launch.' },
  { title: 'We Show Up Fully Branded', desc: 'Our team arrives early, sets up the robot with your brand overlays and custom voice — no power or WiFi needed. Zero work for your team.' },
  { title: 'Your Brand Goes Viral', desc: 'The robot roams your launch, creates content, and delivers branded photos instantly to every guest\'s phone. Your logo spreads everywhere in real-time.' },
]

const whyBrandsLove = [
  { icon: <FiShare2 className="w-5 h-5 md:w-6 md:h-6" />, title: 'Instant Brand Reach', desc: 'Every photo is branded with your logo and shared instantly to guests\' phones — turning your launch into a live social media campaign.' },
  { icon: <FiUsers className="w-5 h-5 md:w-6 md:h-6" />, title: 'Hands-On Guest Engagement', desc: 'Our attendant drives the robot through your crowd, creating genuine brand interactions — not just a booth people walk past.' },
  { icon: <FiStar className="w-5 h-5 md:w-6 md:h-6" />, title: 'Custom Voice & Campaign Messaging', desc: 'The robot speaks your brand\'s voice — custom recorded lines that announce the photo and reinforce your campaign message every single time.' },
  { icon: <FiZap className="w-5 h-5 md:w-6 md:h-6" />, title: 'Zero Setup Burden', desc: 'No power outlets, no WiFi, no venue requirements. Our team handles full setup and teardown so your team stays focused on the launch.' },
  { icon: <FiImage className="w-5 h-5 md:w-6 md:h-6" />, title: 'Campaign-Ready Content', desc: 'Every photo is polished, on-brand, and ready for social. Your launch generates a full library of content guests actually want to share.' },
  { icon: <FiShield className="w-5 h-5 md:w-6 md:h-6" />, title: 'White-Glove Service', desc: 'A dedicated on-site team manages everything start to finish. Your brand stays in the spotlight — we stay invisible in the background.' },
]

const customizations = [
  { icon: <FiImage className="w-5 h-5" />, title: 'Logo Overlays, Campaign Branding & Theme', desc: 'Every photo features your logo, campaign name, and brand colors. The robot can also be dressed and themed to match your product launch — making every interaction a branded touchpoint.' },
  { icon: <FiZap className="w-5 h-5" />, title: 'Custom Voice & Campaign Messaging', desc: 'Record custom voice lines in your brand voice or a spokesperson\'s voice — announcing the product, hyping guests, and making every photo moment part of the campaign story.' },
  { icon: <FiStar className="w-5 h-5" />, title: 'Multi-Booth Activations', desc: 'Combine the Robot Photobooth with a 360 Booth, Aerial Booth, or Premium Photobooth for a full brand activation floor — multiple touchpoints, maximum exposure, one unified experience.' },
]

const testimonials = [
  { name: 'Rosanna', role: 'Project Manager, TD USA Trust', text: 'I want to extend a huge THANK YOU to you and your team. The photo booths were very popular among TechCon attendees. You and your team were accommodating, patient and friendly from the beginning to the end of the event. The backdrop and pictures were great quality.' },
  { name: 'Priya S.', role: 'Brand Marketing Manager', text: 'We\'ve done a lot of brand activations — this was by far the most talked-about. The robot was engaging, the branded photos were everywhere on social the next day. Will book again.' },
  { name: 'Marcus L.', role: 'Head of Experiential Marketing', text: 'Our product launch needed something that would make people stop and engage. The robot delivered exactly that — every guest walked away with a branded photo and a story to tell.' },
]

const faqs = [
  { question: 'What types of brand activations do you cover?', answer: 'We cover product launches, brand reveals, pop-up activations, trade shows, sponsorship activations, and any event where you need to create a memorable branded experience.' },
  { question: 'How big is the Robot Photobooth?', answer: 'The robot stands at 5ft 4in tall — roughly the same height and footprint as a person. It moves through your venue seamlessly without requiring any dedicated booth space.' },
  { question: 'Can we fully brand the photos with our campaign?', answer: 'Yes. Every photo includes a custom overlay with your logo, campaign name, hashtag, event date, and brand colors. It\'s a branded asset every single guest takes home.' },
  { question: 'Does the robot require WiFi or power from the venue?', answer: 'No. The robot is fully self-powered and uses its own connectivity. No cables, no venue WiFi needed. Our team handles everything independently.' },
  { question: 'Can the robot speak in our brand voice?', answer: 'Yes. We can program custom voice lines — even recorded in a spokesperson\'s or team member\'s voice — that greet guests and hype the photo moment as part of your campaign.' },
  { question: 'How far in advance should we book?', answer: 'We recommend booking 4–6 weeks in advance for brand activations. Launch season dates fill quickly. Contact us now to lock in your date.' },
  { question: 'Can we combine multiple booths for a larger activation floor?', answer: 'Absolutely. Our Platinum Package lets you bundle the Robot Photobooth with a 360 Booth, Aerial Booth, or Premium Photobooth — creating multiple brand touchpoints at your event.' },
]

const companyLogos = [
  '/images/adamas.png', '/images/bell.png', '/images/bgo.png', '/images/equifax.svg',
  '/images/geotab.png', '/images/hilton.png', '/images/infosys.png', '/images/meta.png',
  '/images/pdsb.png', '/images/remax.png', '/images/ritz.webp', '/images/rlp.svg',
  '/images/stonex.png', '/images/talent.png', '/images/td.png', '/images/torontopearson.png', '/images/BMO.svg.png',
]
