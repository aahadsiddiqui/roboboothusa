import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiCheck, FiPhone, FiChevronDown, FiChevronUp, FiClock, FiX, FiCamera, FiFilm, FiZap, FiImage } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import { useLandingMarket } from '../hooks/useLandingMarket'
import { landingCanonical } from '../lib/landingSeo'
import { getLandingTrustedLine } from '../lib/productLocalize'
import { appendUtmParams } from '../lib/utmParams'
import { trackTexasMetaLead } from '../lib/trackTexasMetaLead'
import { withMarketTravelFaq } from '../lib/travelAreaFaq'
import { texasInPhrase } from '../lib/texasServiceArea'

/* ─── Reveal ─── */
const Reveal = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay }} className={className}>
    {children}
  </motion.div>
)

/* ─── Subtle CTA Button (inline, minimal) ─── */
const SubtleCTA = ({ label, onQuote }: { label: string; onQuote: () => void }) => (
  <div className="flex justify-center pt-4 pb-2">
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onQuote}
      className="bg-[#fce4a6] text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-md shadow-[#fce4a6]/20 hover:shadow-lg transition-all group">
      {label} <FiArrowRight className="inline ml-1.5 group-hover:translate-x-1 transition-transform" />
    </motion.button>
  </div>
)

/* ════════════════════════════════════════════════════════════════
   PHOTOGRAPHY & VIDEOGRAPHY — Landing Page
   ════════════════════════════════════════════════════════════════ */
export default function PhotographyPage() {
  const market = useLandingMarket()
  const faqsForMarket = useMemo(() => withMarketTravelFaq(faqs, market), [market])
  const { canonical, ogUrl } = landingCanonical(market, '/corporate-photography', 'photography-videography')
  const trustedLine = getLandingTrustedLine(market)

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ firstName: '', email: '', phone: '', eventDate: '' })
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

  const openQuote = useCallback(() => setShowModal(true), [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('first-name', form.firstName); fd.append('phone-number', form.phone); fd.append('email', form.email)
      fd.append('event-date', form.eventDate); fd.append('event-type', 'Photography & Videography')
      fd.append('_replyto', form.email)
      fd.append('source', market.id === 'national' ? 'Photography Page' : `Photography Page (${market.analyticsRegion})`)
      fd.append('intake-market', market.id)
      appendUtmParams(fd)
      const res = await fetch(market.contactFormPostUrl, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      if (res.ok) { setSuccess(true); trackTexasMetaLead(market.id) } else { alert('Failed to submit. Please try again.') }
    } catch { alert('Failed to submit. Please try again.') } finally { setSubmitting(false) }
  }

  return (
    <>
      <Head>
        <title>
          {market.id === 'national'
            ? 'Photography & Videography Chicago USA | Robo Booth'
            : `Photography & Videography | Robo Booth ${market.analyticsRegion}`}
        </title>
        <meta
          name="description"
          content={
            market.id === 'chicago'
              ? 'Professional photography & videography for events, corporate, and private sessions in Chicago & surrounding areas. RAW + Edited media delivered within a week.'
              : market.id === 'texas'
                ? `Professional photography & videography for events, corporate, and private sessions ${texasInPhrase}. RAW + Edited media delivered within a week.`
                : 'Professional Photography & Videography for events, corporate, and private sessions across Chicago & USA. RAW + Edited photos delivered within a week. Book now.'
          }
        />
        <meta name="keywords" content="event photography Chicago, videography USA, corporate photography, event videographer, portrait photographer Chicago" />
        <meta
          property="og:title"
          content={market.id === 'national' ? 'Photography & Videography | Robo Booth' : `Photography & Videography | Robo Booth ${market.analyticsRegion}`}
        />
        <meta
          property="og:description"
          content={
            market.id === 'national'
              ? 'Professional event photography & videography. RAW + Edited Videos/Photos delivered within a week. Chicago & USA.'
              : 'Professional event photography & videography. RAW + Edited Videos/Photos delivered within a week.'
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ogUrl} />
        <link rel="canonical" href={canonical} />
        <link rel="preload" href="/images/photography1.jpg" as="image" />
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
                <span>Event season is filling fast — <button onClick={openQuote} className="underline font-bold">check your date now</button></span>
                <button onClick={() => setUrgencyDismissed(true)} className="ml-2 text-black/50 hover:text-black"><FiX className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
              HERO — Single large image
             ═══════════════════════════════════════ */}
          <section className={`relative ${urgencyDismissed ? 'pt-20 md:pt-24' : 'pt-[7rem] md:pt-[8rem]'} pb-6 md:pb-8 px-4`}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#fce4a620_0%,_transparent_50%)] pointer-events-none" />
            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                    <span className="text-white/60 text-xs font-medium">5.0 Rating · Professional Event Coverage</span>
                  </div>
                  <h1 className="text-[1.65rem] leading-[1.15] md:text-4xl lg:text-5xl font-black md:leading-[1.1] mb-4">
                    Professional{' '}
                    <span className="text-[#fce4a6]">Photography & Videography</span>{' '}
                    for Your Event.
                  </h1>
                  <p className="text-white/80 text-sm md:text-base lg:text-lg leading-relaxed mb-5 max-w-xl">
                    From candid moments to cinematic highlights — we capture it all. RAW + Edited Photos & Videos delivered within a week.{' '}
                    <span className="text-white font-semibold">We handle everything so you can focus on your event.</span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openQuote}
                      className="w-full sm:w-auto bg-[#fce4a6] text-black px-6 py-3.5 rounded-full font-bold text-sm md:text-base shadow-lg shadow-[#fce4a6]/20 hover:shadow-xl transition-all group text-center">
                      Reserve Your Date <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    <a href={market.phoneTel} className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-[#fce4a6]/40 text-[#fce4a6] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#fce4a6]/10 transition-all text-center">
                      <FiPhone className="w-4 h-4" /> Contact Us
                    </a>
                  </div>
                  <p className="text-white/40 text-[11px] md:text-xs">Responses in &lt;15 mins&ensp;|&ensp;No credit card required</p>
                </motion.div>

                {/* Hero image */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="hidden md:block">
                  <img src="/images/photography1.jpg" alt="Photography & Videography" className="w-full h-[480px] lg:h-[520px] object-cover rounded-2xl shadow-2xl" loading="eager" fetchPriority="high" />
                </motion.div>

                {/* Mobile hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="md:hidden -mx-4">
                  <img src="/images/photography1.jpg" alt="Photography & Videography" className="w-full h-60 object-cover" loading="eager" fetchPriority="high" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── Logo Marquee ── */}
          <section className="py-4 md:py-6 border-y border-[#fce4a6]/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-3">
              <p className="text-center text-[#fce4a6]/60 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase">{trustedLine}</p>
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

          {/* ── How It Works — 3 Steps ── */}
          <section className="py-8 md:py-10 px-4">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">How It <span className="text-[#fce4a6]">Works</span></h2>
                <p className="text-white/50 text-xs md:text-sm">Simple, stress-free, and handled entirely by us</p>
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
            </div>
          </section>

          {/* ════════════════════════════════════
              PHOTOGRAPHY & VIDEOGRAPHY SECTION
              ════════════════════════════════════ */}
          <section className="py-10 md:py-14 px-4 border-t-2 border-[#fce4a6]/20">
            <div className="max-w-5xl mx-auto">
              <Reveal className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-[#fce4a6]/40" />
                  <div className="flex items-center gap-2 bg-[#fce4a6]/10 border border-[#fce4a6]/40 px-4 py-1.5 rounded-full">
                    <FiCamera className="w-3.5 h-3.5 text-[#fce4a6]" />
                    <FiFilm className="w-3.5 h-3.5 text-[#fce4a6]" />
                    <span className="text-[#fce4a6] text-xs font-bold tracking-widest uppercase">Photography & Videography</span>
                  </div>
                  <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-[#fce4a6]/40" />
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2">Capture Every <span className="text-[#fce4a6]">Moment</span></h2>
                <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto">From candid moments to cinematic highlights — we document your event in stunning detail. RAW + Edited delivered within a week.</p>
              </Reveal>

              {/* Photo/Video image */}
              <Reveal className="mb-6">
                <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <img src="/images/photography3.jpg" alt="Professional event photography and videography" className="w-full h-auto object-contain" style={{ display: 'block', maxHeight: '50vh' }} loading="lazy" />
                </div>
              </Reveal>

              {/* Photo/Video feature cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-5">
                {photoVideoFeatures.map((item, i) => (
                  <Reveal key={i} delay={i * 0.06} className="bg-white/[0.04] border border-white/10 rounded-xl p-4 md:p-5 hover:border-[#fce4a6]/30 transition-colors group">
                    <div className="text-[#fce4a6] mb-2 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                    <h3 className="font-bold text-sm md:text-base mb-1">{item.title}</h3>
                    <p className="text-white/50 text-[11px] md:text-xs leading-relaxed">{item.desc}</p>
                  </Reveal>
                ))}
              </div>

              {/* Photo/Video — action video */}
              <Reveal className="mt-5 mb-2">
                <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <video
                    className="w-full max-h-[50vh] object-contain"
                    style={{ display: 'block' }}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  >
                    <source src="/videos/photography1.MOV" type="video/quicktime" />
                    <source src="/videos/photography1.MOV" type="video/mp4" />
                  </video>
                </div>
              </Reveal>

              <SubtleCTA label="Book Photography & Videography" onQuote={openQuote} />
            </div>
          </section>

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

          {/* ── FAQs ── */}
          <section className="py-8 md:py-10 px-4">
            <div className="max-w-3xl mx-auto">
              <Reveal className="text-center mb-5">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1.5">Common <span className="text-[#fce4a6]">Questions</span></h2>
              </Reveal>
              <div className="space-y-2">
                {faqsForMarket.map((faq, i) => (
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
                Your Event Deserves <span className="text-[#fce4a6]">Professional Coverage.</span>
              </h2>
              <p className="text-white/60 text-xs md:text-sm lg:text-base mb-5 max-w-lg mx-auto">
                Photography & videography — all handled by our team. RAW + Edited photos delivered within a week.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openQuote}
                  className="w-full sm:w-auto bg-[#fce4a6] text-black px-7 py-3.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-base shadow-lg shadow-[#fce4a6]/20 hover:shadow-xl transition-all group">
                  Reserve Your Date Now <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
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
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-4 text-black/40 hover:text-black text-2xl">×</button>
              <h2 className="text-lg md:text-2xl font-black text-black mb-1 text-center">Book Photography & Videography</h2>
              <p className="text-black/60 text-xs md:text-sm mb-4 text-center">Tell us your date and we&apos;ll confirm availability within 15 minutes.</p>
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
                  <button type="submit" disabled={submitting}
                    className="w-full bg-[#fce4a6] text-black py-3.5 rounded-xl font-bold text-sm hover:bg-[#e8d08e] transition-colors">
                    {submitting ? 'Sending…' : 'Reserve My Date →'}
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
                  Reserve Your Date <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            <motion.button initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openQuote}
              className="hidden md:flex fixed bottom-6 right-6 z-40 bg-[#fce4a6] text-black font-bold px-6 py-3.5 rounded-full shadow-xl shadow-black/40 hover:bg-white transition-colors text-sm items-center gap-2">
              Reserve Your Date <FiArrowRight className="w-4 h-4" />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── DATA ─── */
const howItWorks = [
  { title: 'You Book', desc: 'Tell us your event date, type, and what you need covered. We\'ll confirm availability and put together a custom plan.' },
  { title: 'We Show Up', desc: 'Our professional team arrives with all equipment — cameras, lighting, audio — ready to capture every moment from start to finish.' },
  { title: 'You Get Your Content', desc: 'Receive your full gallery of RAW + Edited photos within about a week. Professional color grading, retouching, and full-resolution delivery.' },
]

const photoVideoFeatures = [
  { icon: <FiCamera className="w-5 h-5 md:w-6 md:h-6" />, title: 'Professional Photography', desc: 'High-resolution event photography capturing keynotes, candid moments, details, and the full atmosphere of your event with professional lighting and composition.' },
  { icon: <FiFilm className="w-5 h-5 md:w-6 md:h-6" />, title: 'Cinematic Videography', desc: 'Multi-angle video coverage with cinema-grade equipment. Highlight reels, full event captures, and social-ready clips — all professionally edited.' },
  { icon: <FiImage className="w-5 h-5 md:w-6 md:h-6" />, title: 'RAW + Edited Delivery', desc: 'Receive both RAW and professionally edited files. Full color grading, retouching, and delivered in full resolution within about a week of your event.' },
  { icon: <FiZap className="w-5 h-5 md:w-6 md:h-6" />, title: 'Seamless, Single Team', desc: 'Photography and videography handled together by one professional crew. No vendor coordination — just consistent, premium coverage from start to finish.' },
]

const testimonials = [
  { name: 'James W.', role: 'VP of Marketing', text: 'The photography was stunning — every detail was captured beautifully. The team was professional, discreet, and delivered everything within the week as promised. Exactly what we needed.' },
  { name: 'Lisa C.', role: 'Event Director', text: 'Having photography and videography handled by one team made everything so much easier. The quality was incredible and the turnaround was impressively fast.' },
  { name: 'Robert K.', role: 'Corporate Events Manager', text: 'The RAW + Edited delivery was a game-changer. We had professional content ready for marketing within days. The team captured moments we didn\'t even know happened. Highly recommend.' },
]

const faqs = [
  { question: 'What do I receive and when?', answer: 'You receive the full gallery of RAW + Edited photos within about a week of your event. All photos are professionally color graded and retouched, delivered in full resolution with commercial usage rights.' },
  { question: 'Do you offer photography and videography separately?', answer: 'Yes. We offer flexible packages — photography only, videography only, or both together. We\'ll tailor the package to your exact needs.' },
  { question: 'What equipment do you use?', answer: 'We use professional-grade DSLR and mirrorless cameras, cinema lenses, studio lighting, professional audio equipment, and stabilization gear. Everything needed for premium results.' },
  { question: 'Can you handle large events?', answer: 'Absolutely. We regularly cover events of all sizes — from intimate gatherings to large-scale conferences and galas. We scale our team and equipment to match your event size.' },
  { question: 'Do you travel outside Chicago?', answer: '' },
  { question: 'How far in advance should I book?', answer: 'We recommend booking at least 4-6 weeks in advance, though peak season dates can fill up faster. Contact us now to check availability for your date.' },
]

const companyLogos = [
  '/images/adamas.png', '/images/bell.png', '/images/bgo.png', '/images/equifax.svg',
  '/images/geotab.png', '/images/hilton.png', '/images/infosys.png', '/images/meta.png',
  '/images/pdsb.png', '/images/remax.png', '/images/ritz.webp', '/images/rlp.svg',
  '/images/stonex.png', '/images/talent.png', '/images/td.png', '/images/torontopearson.png', '/images/BMO.svg.png',
]
