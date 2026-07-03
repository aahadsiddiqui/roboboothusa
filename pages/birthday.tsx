import React, { useState, useEffect, useCallback } from 'react'
import type { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiCheck, FiPhone, FiChevronDown, FiChevronUp, FiClock, FiX, FiZap, FiUsers, FiStar, FiShield, FiImage, FiShare2, FiHeart, FiGift } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import BirthdayGalleryCarousel from '../components/BirthdayGalleryCarousel'
import { appendUtmParams } from '../lib/utmParams'
import { trackTexasMetaLead } from '../lib/trackTexasMetaLead'
import { getTexasBirthdayLandingSsp } from '../lib/texasBirthdayLandingSsp'
import { MARKETS } from '../data/markets'
import { firstRobotBrandPhrase } from '../lib/marketBranding'
import { TEXAS_SERVICE_AREA, texasAcrossPhrase } from '../lib/texasServiceArea'

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
   BIRTHDAY LANDING PAGE (Texas only — /texas/birthday)
   ════════════════════════════════════════════════════════════════ */
export const getServerSideProps = getTexasBirthdayLandingSsp('/birthday')

const market = MARKETS.texas
const publicPath = '/texas/birthday'

export default function Birthday(_props: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
      fd.append('event-date', form.eventDate); fd.append('budget', form.budget); fd.append('event-type', 'Birthday Party')
      fd.append('package', packageType === 'gold' ? 'Gold Package (Birthday Robot + 360 Booth)' : packageType === 'platinum' ? 'Platinum Package (Birthday Robot + Second Robot Photobooth)' : packageType === 'bronze' ? 'Bronze Package (Birthday Robot Only)' : 'General Inquiry')
      fd.append('_replyto', form.email)
      fd.append('source', `Birthday Page (${market.analyticsRegion})`)
      fd.append('intake-market', market.id)
      appendUtmParams(fd)
      const res = await fetch(market.contactFormPostUrl, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      if (res.ok) { setSuccess(true); trackTexasMetaLead(market.id) } else { alert('Failed to submit. Please try again.') }
    } catch { alert('Failed to submit. Please try again.') } finally { setSubmitting(false) }
  }

  return (
    <>
      <Head>
        <title>Birthday Robot Photobooth Texas | Robo Booth</title>
        <meta name="description" content={`Texas's first robot photobooth for birthday parties. From 1st birthdays to milestone celebrations — personalized overlays, table visits, and instant prints. ${TEXAS_SERVICE_AREA}.`} />
        <meta name="keywords" content="birthday photobooth Texas, robot photobooth birthday Austin Dallas Houston, kids birthday photo booth Texas, milestone birthday photobooth" />
        <meta property="og:title" content="Birthday Robot Photobooth | Robo Booth Texas" />
        <meta property="og:description" content="The roaming robot photobooth that makes every Texas birthday unforgettable. Custom themes, personalized prints, and white-glove service." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://roboboothusa.com${publicPath}`} />
        <link rel="canonical" href={`https://roboboothusa.com${publicPath}`} />
        <link rel="preload" href="/images/birthday/hero-poster.png" as="image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={showModal ? 'blur-sm pointer-events-none select-none' : ''}>
        <div className="min-h-screen bg-black text-white overflow-x-hidden">

          <Navbar />

          {!urgencyDismissed && (
            <div className="fixed top-16 md:top-[4.5rem] left-0 right-0 z-40 bg-[#fce4a6] text-black text-center py-2 px-4">
              <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold">
                <FiClock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Weekend birthday dates fill fast — <button onClick={openQuote} className="underline font-bold">check availability now</button></span>
                <button onClick={() => setUrgencyDismissed(true)} className="ml-2 text-black/50 hover:text-black"><FiX className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
              HERO
             ═══════════════════════════════════════ */}
          <section className={`relative bg-black ${urgencyDismissed ? 'pt-20 md:pt-24' : 'pt-[7rem] md:pt-[8rem]'} pb-6 md:pb-8 px-4`}>
            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                    <span className="text-white/60 text-xs font-medium">5.0 Rating · Loved by Families {texasAcrossPhrase}</span>
                  </div>
                  <h1 className="text-[1.65rem] leading-[1.15] md:text-4xl lg:text-5xl font-black md:leading-[1.1] mb-4">
                    {firstRobotBrandPhrase(market)}{' '}
                    <span className="text-[#fce4a6]">Robot Photobooth</span> for Birthday Parties
                  </h1>
                  <p className="text-white/80 text-sm md:text-base lg:text-lg leading-relaxed mb-5 max-w-xl">
                    Our robot photobooth roams your party, visits every table, delivers personalized photos to every guest&apos;s phone in real-time, and prints physical keepsakes on the spot.{' '}
                    <span className="text-white font-semibold">From 1st birthdays to milestone celebrations — we handle everything so you can enjoy the party.</span>
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

                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="hidden md:block">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                    <video className="w-full h-[480px] lg:h-[520px] object-contain" controls loop playsInline preload="metadata" poster="/images/birthday/hero-poster.png" style={{ display: 'block' }}>
                      <source src="/videos/robotbirthday.MOV" type="video/quicktime" />
                      <source src="/videos/robotbirthday.MOV" type="video/mp4" />
                    </video>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="md:hidden -mx-4">
                  <div className="overflow-hidden bg-black">
                    <video className="w-full max-h-[50vh] object-contain" controls loop playsInline preload="metadata" poster="/images/birthday/hero-poster.png" style={{ display: 'block' }}>
                      <source src="/videos/robotbirthday.MOV" type="video/quicktime" />
                      <source src="/videos/robotbirthday.MOV" type="video/mp4" />
                    </video>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── Milestone Marquee ── */}
          <section className="py-4 md:py-6 border-y border-[#fce4a6]/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-3">
              <p className="text-center text-[#fce4a6]/60 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase">Celebrating every birthday {texasAcrossPhrase}</p>
            </div>
            <div className="relative w-full overflow-hidden">
              <div className="animate-marquee flex items-center gap-8 md:gap-12 px-4">
                {[...milestones, ...milestones].map((item, i) => (
                  <div key={i} className="flex-shrink-0 flex items-center gap-2 text-white/50 hover:text-[#fce4a6] transition-colors">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm md:text-base font-semibold whitespace-nowrap">{item.label}</span>
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
                <p className="text-white/50 text-xs md:text-sm">Simple, fully managed, and stress-free for you and your guests</p>
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
                  <video className="w-full max-h-[60vh] object-contain" controls loop playsInline preload="metadata" poster="/images/birthday/how-it-works-poster.png" style={{ display: 'block' }}>
                    <source src="/videos/robotbirthday2.MOV" type="video/quicktime" />
                    <source src="/videos/robotbirthday2.MOV" type="video/mp4" />
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
                <p className="text-white/50 text-sm md:text-base">Every birthday is different — pick the package that fits yours.</p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-stretch">

                <Reveal>
                  <div className="relative rounded-3xl border border-white/20 bg-white/[0.04] p-6 md:p-7 h-full flex flex-col">
                    <div className="flex justify-center mb-4">
                      <span className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
                        Bronze Package
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-center mb-2">Robot Photobooth <span className="text-white/50">Only</span></h3>
                    <p className="text-white/50 text-xs text-center mb-6">The standalone birthday robot photobooth experience — fully set up, operated, and managed by our team.</p>
                    <div className="space-y-2.5 mb-8 flex-1">
                      {[
                        'Birthday Robot Photobooth roaming table-to-table',
                        'Physical prints delivered on the spot',
                        'Custom photo overlays with name, age & theme',
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

                <Reveal delay={0.1}>
                  <div className="relative rounded-3xl overflow-hidden border-2 border-[#fce4a6]/50 bg-gradient-to-br from-[#fce4a6]/10 via-black to-black p-6 md:p-7 shadow-2xl shadow-[#fce4a6]/10 h-full flex flex-col">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#fce4a625_0%,_transparent_65%)] pointer-events-none" />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-center mb-4">
                        <span className="inline-flex items-center gap-2 bg-[#fce4a6] text-black text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg">
                          ⭐ Most Popular · Gold
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-center mb-2">Robot Photobooth + <span className="text-[#fce4a6]">360 Booth</span></h3>
                      <p className="text-white/60 text-xs text-center mb-6">Capture every moment of the celebration from two unforgettable perspectives.</p>
                      <div className="space-y-2.5 mb-8 flex-1">
                        {[
                          "Texas's First Robot Photobooth roaming table-to-table",
                          '360 Booth capturing stunning slow-motion videos',
                          'Cinematic clips guests love sharing on social',
                          'Group photos and cake-cutting moments captured',
                          'Custom themed overlays and personalized Robot Photobooth experience',
                          'Physical prints and instant digital delivery to every guest',
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

                <Reveal delay={0.2}>
                  <div className="relative rounded-3xl overflow-hidden border-2 border-white/40 bg-gradient-to-br from-white/[0.08] via-black to-black p-6 md:p-7 h-full flex flex-col" style={{ boxShadow: '0 0 40px rgba(255,255,255,0.06)' }}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.07)_0%,_transparent_60%)] pointer-events-none" />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-center mb-4">
                        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-white/20 to-white/10 text-white text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full border border-white/30">
                          💎 Platinum Package
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-center mb-2">Robot Photobooth + <span className="text-white/80">Second Robot Photobooth</span></h3>
                      <p className="text-white/60 text-xs text-center mb-6">The ultimate birthday party experience — add a second Robot Photobooth for maximum fun at larger celebrations.</p>
                      <div className="space-y-2.5 mb-8 flex-1">
                        {[
                          'Everything included in the Gold Package',
                          'Second Robot Photobooth roaming simultaneously',
                          'Two interactive robot activations running at once',
                          'Maximum guest engagement for larger parties',
                          'One team coordinating everything seamlessly',
                          `The most talked-about birthday setup ${texasAcrossPhrase}`,
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

          <SubtleCTA label="Check Availability" onQuote={openQuote} />

          {/* ── Birthday Gallery ── */}
          <section className="py-8 md:py-12 px-4 border-t border-white/5">
            <div className="max-w-6xl mx-auto">
              <Reveal className="text-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">Birthday <span className="text-[#fce4a6]">Gallery</span></h2>
                <p className="text-white/50 text-xs md:text-sm">Real celebrations. Real guests. Real memories.</p>
              </Reveal>
              <Reveal delay={0.1}>
                <BirthdayGalleryCarousel />
              </Reveal>
            </div>
          </section>

          {/* ── Why Families Choose Us ── */}
          <section className="py-8 md:py-10 px-4 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">Why Families <span className="text-[#fce4a6]">Choose Us</span></h2>
                <p className="text-white/50 text-xs md:text-sm">The activation that keeps every guest smiling — from toddlers to grandparents</p>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {whyClientsLove.map((item, i) => (
                  <Reveal key={i} delay={i * 0.06} className="bg-white/[0.04] border border-white/10 rounded-xl p-4 md:p-5 hover:border-[#fce4a6]/30 transition-colors group">
                    <div className="text-[#fce4a6] mb-2 md:mb-3 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                    <h3 className="font-bold text-sm md:text-base mb-1">{item.title}</h3>
                    <p className="text-white/50 text-[11px] md:text-xs leading-relaxed">{item.desc}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <SubtleCTA label="Get a Birthday Quote" onQuote={openQuote} />

          {/* ── Customize Your Celebration ── */}
          <section className="py-8 md:py-10 px-4 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">Built Around <span className="text-[#fce4a6]">Your Celebration</span></h2>
                <p className="text-white/50 text-xs md:text-sm">Every detail of the experience can be tailored to your birthday theme</p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {customizations.map((item, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="bg-gradient-to-br from-[#fce4a6]/10 to-transparent border border-[#fce4a6]/20 rounded-2xl p-5 md:p-6 h-full hover:border-[#fce4a6]/40 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-[#fce4a6]/10 border border-[#fce4a6]/30 flex items-center justify-center mb-4 text-[#fce4a6] group-hover:bg-[#fce4a6]/20 transition-colors">
                        {item.icon}
                      </div>
                      <h3 className="font-bold text-base md:text-lg text-white mb-2">{item.title}</h3>
                      <p className="text-white/60 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <SubtleCTA label="Book Now" onQuote={openQuote} />

          {/* ── Testimonials ── */}
          <section className="py-8 md:py-10 px-4 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-5">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">What Families <span className="text-[#fce4a6]">Are Saying</span></h2>
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
                        <h3 className="font-bold text-xs md:text-base text-white/90 pr-4">{faq.question}</h3>
                        {expandedFaq === i ? <FiChevronUp className="text-[#fce4a6] w-4 h-4 flex-shrink-0" /> : <FiChevronDown className="text-[#fce4a6] w-4 h-4 flex-shrink-0" />}
                      </div>
                      <AnimatePresence>
                        {expandedFaq === i && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-white/60 text-xs md:text-sm mt-2 leading-relaxed">
                            {faq.answer}
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
                Make Their Birthday <span className="text-[#fce4a6]">Unforgettable.</span>
              </h2>
              <p className="text-white/60 text-xs md:text-sm lg:text-base mb-5 max-w-lg mx-auto">
                Join hundreds of Texas families who trust Robo Booth to elevate their birthday celebrations. Personalized, fun, and fully managed — we handle everything.
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
                  <span className="text-black/60 text-[10px]">Birthday Robot Photobooth Only</span>
                </div>
              )}
              {packageType === 'gold' && (
                <div className="bg-[#fce4a6] rounded-xl px-4 py-2.5 mb-3 flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-black text-xs font-black">⭐ Gold Package Selected</span>
                  <span className="text-black/60 text-[10px]">Birthday Robot + 360 Booth</span>
                </div>
              )}
              {packageType === 'platinum' && (
                <div className="bg-gradient-to-r from-white/95 to-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 mb-3 flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-black text-xs font-black">💎 Platinum Package Selected</span>
                  <span className="text-black/60 text-[10px]">Second Robot Photobooth</span>
                </div>
              )}
              <h2 className="text-lg md:text-2xl font-black text-black mb-1 text-center">{packageType === 'gold' ? 'Book Gold Package' : packageType === 'bronze' ? 'Book Bronze Package' : packageType === 'platinum' ? 'Book Platinum Package' : 'Get a Birthday Quote'}</h2>
              <p className="text-black/60 text-xs md:text-sm mb-4 text-center">Tell us your party date and we&apos;ll confirm availability within 15 minutes.</p>
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
                    <option value="$1000-$1500">$1,000–$1,500</option>
                    <option value="$1500-$2000">$1,500–$2,000</option>
                    <option value="$2500+">$2,500+</option>
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
              Get a Birthday Quote <FiArrowRight className="w-4 h-4" />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── DATA ─── */
const milestones = [
  { emoji: '🎂', label: '1st Birthdays' },
  { emoji: '🎈', label: 'Sweet 16' },
  { emoji: '🎉', label: '18th Celebrations' },
  { emoji: '🥳', label: '21st Parties' },
  { emoji: '✨', label: '30th Milestones' },
  { emoji: '🎊', label: '40th Birthdays' },
  { emoji: '🥂', label: '50th Celebrations' },
  { emoji: '👑', label: '65th Milestones' },
  { emoji: '🎁', label: '80th Birthdays' },
]

const howItWorks = [
  { title: 'You Book', desc: 'Tell us the birthday date, venue, theme, and guest count. We confirm availability fast and design a custom activation around the celebration.' },
  { title: 'We Show Up', desc: 'Our team arrives early, sets up the fully themed robot (no power or WiFi needed), and handles every detail on-site. Zero work for you.' },
  { title: 'Every Guest Gets a Memory', desc: 'The robot roams your party, visits every table, captures personalized photos, and delivers them instantly to every guest\'s phone — plus prints on the spot.' },
]

const whyClientsLove = [
  { icon: <FiHeart className="w-5 h-5 md:w-6 md:h-6" />, title: 'Every Age Loves It', desc: 'From toddlers at a 1st birthday to grandparents at an 80th — the robot captivates every generation and brings the whole room together.' },
  { icon: <FiUsers className="w-5 h-5 md:w-6 md:h-6" />, title: 'Table-to-Table Visits', desc: 'Our on-site attendant drives the robot throughout your venue, visiting every table so no guest gets left out of the fun.' },
  { icon: <FiStar className="w-5 h-5 md:w-6 md:h-6" />, title: 'Custom Voice Messages', desc: 'Program the robot with a birthday message — from the honoree, a parent, or a loved one — with a special customized message before & after it takes a photo.' },
  { icon: <FiGift className="w-5 h-5 md:w-6 md:h-6" />, title: 'Keepsake Prints', desc: 'Every guest walks away with a physical print in hand — a personalized souvenir they\'ll put on the fridge, not bury in a camera roll.' },
  { icon: <FiZap className="w-5 h-5 md:w-6 md:h-6" />, title: 'Zero Setup Burden', desc: 'No power outlets, no WiFi, no special venue requirements. Our team handles full setup and teardown — invisible to your party planning.' },
  { icon: <FiShare2 className="w-5 h-5 md:w-6 md:h-6" />, title: 'Instant Digital Sharing', desc: 'Photos delivered to every guest\'s phone via QR code, AirDrop, SMS, or email — shareable moments before the cake is even cut.' },
  { icon: <FiImage className="w-5 h-5 md:w-6 md:h-6" />, title: 'Fully Themed Experience', desc: 'Custom overlays with name, age, and theme — Winnie the Pooh, princess, casino, racing cars, and more. Every print celebrates the honoree.' },
  { icon: <FiShield className="w-5 h-5 md:w-6 md:h-6" />, title: 'White-Glove Service', desc: 'A dedicated on-site attendant manages everything. You focus on the party — we handle the tech from start to finish.' },
]

const customizations = [
  { icon: <FiImage className="w-5 h-5" />, title: 'Themed Overlays & Branding', desc: 'Every photo features the honoree\'s name, age, and your party theme — from Winnie the Pooh to princess, casino, or racing cars. Custom graphics, colors, and decorative elements on every print.' },
  { icon: <FiZap className="w-5 h-5" />, title: 'Custom Voice & Messaging', desc: 'Program the robot with birthday greetings — record a message from the honoree, their parents, or a loved one. The robot delivers it at every table for a personal touch guests never forget.' },
  { icon: <FiHeart className="w-5 h-5" />, title: 'Any Venue, Any Size', desc: 'Banquet halls, backyard parties, restaurant private rooms, hotel ballrooms — we\'ve done them all. The robot adapts to your space and guest count seamlessly.' },
]

const testimonials = [
  { name: 'Priya M.', role: 'Mom, 1st Birthday Party', text: 'The robot was the highlight of our son\'s first birthday. Every table got a visit, the Winnie the Pooh overlays were perfect, and guests are still talking about it weeks later. Worth every penny.' },
  { name: 'David R.', role: '50th Birthday Host', text: 'We wanted something different for my wife\'s 50th — not another standard photobooth stuck in a corner. The robot roamed the entire room and every guest got a personalized print. Absolute hit.' },
  { name: 'Sarah K.', role: 'Sweet 16 Planner', text: 'The teenagers loved it and so did the grandparents. The custom overlays matched our pink balloon theme perfectly. Our attendant was amazing — handled everything without us lifting a finger.' },
]

const faqs = [
  { question: 'How big is the Robot Photobooth?', answer: 'The robot stands at 5ft 4in tall — roughly the same height and footprint as a person. It doesn\'t require any dedicated space or booth setup, so it roams freely through your venue without disrupting your party layout.' },
  { question: 'Is this suitable for kids\' birthday parties?', answer: 'Absolutely. Our operators are experienced with mixed-age groups including young children. The robot moves slowly and carefully, and our team manages interactions to ensure every guest — from toddlers to teens — has a safe, joyful experience.' },
  { question: 'Can the photos match our birthday theme?', answer: 'Yes. Every photo comes with a custom overlay featuring the honoree\'s name, age, date, and your party theme. We\'ve done Winnie the Pooh, princess, casino, racing cars, balloon themes, and everything in between.' },
  { question: 'Does the setup require WiFi or power from the venue?', answer: 'No. The robot runs on battery and uses its own connectivity. No cables, no venue WiFi, no special requirements. We handle everything independently.' },
  { question: 'How are photos shared with guests?', answer: 'Instantly via QR code, AirDrop, SMS, or email — all right at the party. Guests receive their personalized photo within seconds of it being taken, plus a physical print to take home.' },
  { question: 'Is an attendant included?', answer: 'Yes. Every birthday booking includes a dedicated on-site attendant who manages the robot, visits every table, guides guests, and ensures a flawless experience from arrival to teardown.' },
  { question: 'How far in advance should we book?', answer: 'We recommend booking at least 4–6 weeks in advance for birthday parties. Weekend dates — especially during peak season — fill up quickly. Contact us now to check availability for your date.' },
]
