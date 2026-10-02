import React, { useState, useEffect, useCallback, useMemo } from 'react'
import type { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowRight, FiCheck, FiPhone, FiChevronDown, FiChevronUp, FiX,
} from 'react-icons/fi'
import { appendUtmParams } from '../lib/utmParams'
import { trackChicagoFormSubmit } from '../lib/trackChicagoFormSubmit'
import { getMarketForPath } from '../data/markets'
import { getRegionalLandingSsp } from '../lib/regionalLandingSsp'
import { firstRobotBrandPhrase, trustedCompaniesMarqueeLine } from '../lib/marketBranding'

const CTA = 'Check My Holiday Date'

type PackageId = 'essentials' | 'signature' | 'gala' | ''

const packageLabels: Record<Exclude<PackageId, ''>, string> = {
  essentials: 'Winter Essentials',
  signature: 'Year-End Signature',
  gala: 'Executive Gala',
}

const Reveal = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay }} className={className}>
    {children}
  </motion.div>
)

function QuoteButton({ onClick, children, className = '' }: { onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onClick}
      className={`bg-[#fce4a6] text-black px-6 py-3.5 rounded-full font-bold text-sm md:text-base shadow-lg shadow-[#fce4a6]/20 hover:shadow-xl transition-all group ${className}`}>
      {children} <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
    </motion.button>
  )
}

function ExtraBooths() {
  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <p className="text-white/50 text-[11px] font-semibold tracking-wide uppercase mb-2">Add on: Extra Booths</p>
      <div className="grid grid-cols-2 gap-2">
        {extraBooths.map((booth) => (
          <div key={booth.name} className="rounded-xl overflow-hidden border border-white/10 bg-black">
            <img src={booth.src} alt={booth.name} className="w-full h-20 object-cover" loading="lazy" />
            <p className="text-white/70 text-[11px] text-center py-1.5">{booth.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}


type Flake = { left: number; size: number; duration: number; delay: number; drift: number; opacity: number }

function Snowfall({ count = 60, className = '' }: { count?: number; className?: string }) {
  const [flakes, setFlakes] = useState<Flake[]>([])
  useEffect(() => {
    const n = window.innerWidth < 768 ? Math.round(count / 2) : count
    setFlakes(Array.from({ length: n }, () => ({
      left: 100 * Math.random(),
      size: 2 + 4 * Math.random(),
      duration: 9 + 12 * Math.random(),
      delay: -(20 * Math.random()),
      drift: -40 + 80 * Math.random(),
      opacity: 0.35 + 0.55 * Math.random(),
    })))
  }, [count])
  return (
    <div aria-hidden className={`pointer-events-none overflow-hidden ${className}`}>
      {flakes.map((flake, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            filter: flake.size > 4.5 ? 'blur(1px)' : undefined,
            ['--snow-drift' as string]: `${flake.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

function ChristmasTree({ className = '', color = '#0f3d2e' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 140" className={className} aria-hidden>
      <rect x="44" y="118" width="12" height="22" fill="#2a1d12" />
      <polygon points="50,38 94,122 6,122" fill={color} />
      <polygon points="50,18 82,86 18,86" fill={color} />
      <polygon points="50,0 72,52 28,52" fill={color} />
      <g fill="#f4f8ff">
        <polygon points="50,0 58,18 54,16 50,20 46,16 42,18" />
        <polygon points="50,18 62,42 56,39 50,44 44,39 38,42" opacity="0.9" />
        <polygon points="50,38 66,68 58,64 50,70 42,64 34,68" opacity="0.85" />
        <path d="M6,122 Q18,114 30,120 Q42,112 54,120 Q68,112 80,120 Q88,116 94,122 Z" />
      </g>
      <circle cx="60" cy="40" r="2.6" fill="#e23d4a" />
      <circle cx="59" cy="38.8" r="0.7" fill="#fff" opacity="0.8" />
      <circle cx="38" cy="68" r="2.8" fill="#c4313d" />
      <circle cx="66" cy="82" r="2.4" fill="#ffffff" />
      <circle cx="30" cy="104" r="2.6" fill="#e23d4a" />
      <circle cx="72" cy="100" r="2.2" fill="#c4313d" />
    </svg>
  )
}

const treeRow = [
  { left: '-2%', h: 'h-20 md:h-32', color: '#0b2e22' },
  { left: '6%', h: 'h-28 md:h-44', color: '#0f3d2e' },
  { left: '14%', h: 'h-16 md:h-24', color: '#0b2e22' },
  { left: '78%', h: 'h-16 md:h-24', color: '#0b2e22' },
  { left: '85%', h: 'h-28 md:h-44', color: '#0f3d2e' },
  { left: '93%', h: 'h-20 md:h-32', color: '#0b2e22' },
]

function ChristmasTreeRow({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`}>
      {treeRow.map((tree) => (
        <div key={tree.left} className="absolute bottom-3 md:bottom-5" style={{ left: tree.left }}>
          <ChristmasTree className={`${tree.h} w-auto`} color={tree.color} />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-6 md:h-9 bg-gradient-to-t from-[#e8f0fb]/25 via-[#e8f0fb]/10 to-transparent" />
    </div>
  )
}

const lightColors = ['#e23d4a', '#ffffff', '#3d9a62', '#ffffff', '#c4313d', '#6dce93', '#ffffff', '#e23d4a']

function TwinkleLights({ count = 24, className = '' }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none flex justify-between items-start px-2 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="animate-twinkle block w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
          style={{
            backgroundColor: lightColors[i % lightColors.length],
            boxShadow: `0 0 10px 2px ${lightColors[i % lightColors.length]}90`,
            animationDelay: `${(i % 6) * 0.4}s`,
            marginTop: i % 2 === 0 ? 0 : 6,
          }}
        />
      ))}
    </div>
  )
}

/* Chicago ad funnel. Public URL: /chicago/holiday-party-events. noindex. */
export const getServerSideProps = getRegionalLandingSsp('/holiday-party-events')

export default function HolidayPartyEvents({ browserPath }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const market = useMemo(() => getMarketForPath(browserPath), [browserPath])
  const publicPath = useMemo(
    () => (market.id === 'national' ? '/holiday-party-events' : `${market.basePath}/holiday-party-events`),
    [market.basePath, market.id],
  )
  const [showModal, setShowModal] = useState(false)
  const [packageType, setPackageType] = useState<PackageId>('')
  const [form, setForm] = useState({ firstName: '', email: '', phone: '', eventDate: '', headcount: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)
  const [showSticky, setShowSticky] = useState(false)
  const [urgencyDismissed, setUrgencyDismissed] = useState(false)

  useEffect(() => {
    const fn = () => setShowSticky(window.scrollY > 400)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    showModal ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden')
    return () => document.body.classList.remove('overflow-hidden')
  }, [showModal])

  const openQuote = useCallback((pkg: PackageId = '') => {
    setPackageType(pkg)
    setShowModal(true)
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('first-name', form.firstName)
      fd.append('phone-number', form.phone)
      fd.append('email', form.email)
      fd.append('event-date', form.eventDate)
      fd.append('headcount', form.headcount)
      fd.append('event-type', 'Corporate Holiday Party')
      fd.append('package', packageType ? packageLabels[packageType] : 'Holiday Party Inquiry')
      fd.append('_replyto', form.email)
      fd.append('source', market.id === 'national' ? 'Holiday Party Funnel' : `Holiday Party Funnel (${market.analyticsRegion})`)
      fd.append('intake-market', market.id)
      appendUtmParams(fd)
      const res = await fetch(market.contactFormPostUrl, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      if (res.ok) { setSuccess(true); if (market.id === 'chicago') trackChicagoFormSubmit() } else { alert('Failed to submit. Please try again.') }
    } catch { alert('Failed to submit. Please try again.') } finally { setSubmitting(false) }
  }

  return (
    <>
      <Head>
        <title>Corporate Holiday Party Robot Photobooth Chicago | Robo Booth</title>
        <meta name="description" content="Make your company holiday party unforgettable with Chicago's first Robot Photobooth and Robot Video Guestbook. Festive branded prints, instant sharing, fully managed." />
        <meta property="og:title" content="Corporate Holiday Party Robot Photobooth | Robo Booth Chicago" />
        <meta property="og:description" content="The holiday party activation your team will talk about all year. Festive branded prints, video guestbook messages, and zero work for your team." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://roboboothusa.com${publicPath}`} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preload" href="/images/holiday/robot-holiday-gala-arch.jpg" as="image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={showModal ? 'blur-sm pointer-events-none select-none' : ''}>
        <div className="relative min-h-screen bg-gradient-to-b from-[#0c2418] via-[#0a0a0a] to-[#1a0c10] text-white overflow-x-hidden">
          <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
            <div className="absolute -top-24 -left-16 h-[34rem] w-[34rem] rounded-full bg-[#9b2033]/25 blur-3xl" />
            <div className="absolute top-[42%] -right-20 h-[30rem] w-[30rem] rounded-full bg-[#145c38]/30 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-[20rem] w-[36rem] rounded-full bg-[#9b2033]/20 blur-3xl" />
          </div>

          <Snowfall count={50} className="fixed inset-0 z-0" />

          <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 h-16 md:h-[4.5rem] flex items-center justify-between">
              <img src="/images/1.png" alt="Robo Booth logo" className="h-10 md:h-12 w-auto object-contain" />
              <a href={market.phoneTel} className="inline-flex items-center gap-1.5 bg-[#fce4a6] text-black px-4 py-2 rounded-full font-semibold text-sm hover:bg-white transition-colors">
                <FiPhone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{market.phoneDisplay}</span>
                <span className="sm:hidden">Call</span>
              </a>
            </div>
          </div>

          {!urgencyDismissed && (
            <div className="fixed top-16 md:top-[4.5rem] left-0 right-0 z-40 bg-[#fce4a6] text-black text-center py-2 px-4">
              <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold">
                <span>Holiday party dates are booking fast — <button onClick={() => openQuote()} className="underline font-bold">check my holiday date</button></span>
                <button onClick={() => setUrgencyDismissed(true)} className="ml-2 text-black/50 hover:text-black" aria-label="Dismiss"><FiX className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}

          <div className={`relative z-10 ${urgencyDismissed ? 'pt-20 md:pt-24' : 'pt-[7.25rem] md:pt-[8.25rem]'}`}>
            {/* Hero */}
            <section className="relative px-4 pb-24 md:pb-40">
              <Snowfall count={70} className="absolute inset-0" />
              <ChristmasTreeRow />
              <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <h1 className="text-[1.7rem] leading-[1.15] md:text-4xl lg:text-5xl font-black md:leading-[1.1] mb-4">
                    The Holiday Party Moment Your Team Talks About <span className="text-[#fce4a6]">All Year</span>
                  </h1>
                  <p className="text-white/80 text-sm md:text-base lg:text-lg leading-relaxed mb-4 max-w-xl">
                    {firstRobotBrandPhrase(market)} Robot Photobooth roams your holiday party, brings every department together, and hands out festive branded prints on the spot. You planned the party — we run the magic.
                  </p>
                  <ul className="space-y-2 mb-5">
                    {heroBullets.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-white/75 text-sm">
                        <FiCheck className="w-4 h-4 text-[#6dce93] mt-0.5 flex-shrink-0" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <QuoteButton onClick={() => openQuote()} className="w-full sm:w-auto">{CTA}</QuoteButton>
                    <a href={market.phoneTel} className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-[#fce4a6]/40 text-[#fce4a6] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#fce4a6]/10">
                      <FiPhone className="w-4 h-4" /> Call {market.phoneDisplay}
                    </a>
                  </div>
                  <p className="text-white/40 text-[11px] md:text-xs">Responses in &lt;15 mins&ensp;|&ensp;No credit card required&ensp;|&ensp;Fully insured</p>
                </motion.div>
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <video className="w-full h-[420px] lg:h-[520px] object-contain" controls loop playsInline preload="metadata" poster="/images/holiday/robot-holiday-gala-arch.jpg">
                    <source src="/videos/equifaxrobot.mov" type="video/quicktime" />
                    <source src="/videos/equifaxrobot.mov" type="video/mp4" />
                  </video>
                </div>
              </div>
            </section>

            {/* Logos */}
            <section className="py-4 md:py-6 border-y border-white/10 overflow-hidden">
              <p className="text-center text-[#6dce93]/80 text-[10px] md:text-xs font-semibold tracking-[0.18em] uppercase mb-3 px-4">
                {trustedCompaniesMarqueeLine(market)}
              </p>
              <div className="relative w-full overflow-hidden">
                <div className="animate-marquee flex items-center gap-10 md:gap-14 px-4">
                  {[...companyLogos, ...companyLogos].map((logo, i) => (
                    <div key={i} className="flex-shrink-0 w-32 md:w-44 h-16 md:h-20 flex items-center justify-center">
                      <img src={logo} alt="" className={`w-full h-full object-contain opacity-60 ${logo.includes('ritz.webp') || logo.includes('hilton.png') ? 'filter invert grayscale' : logo.includes('td.png') ? '' : 'filter brightness-0 invert'}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How it works */}
            <section className="py-10 md:py-14 px-4">
              <div className="max-w-5xl mx-auto">
                <Reveal className="text-center mb-8">
                  <h2 className="text-2xl md:text-4xl font-black mb-2">How It <span className="text-[#fce4a6]">Works</span></h2>
                  <p className="text-white/50 text-sm">Three steps to the easiest win of your holiday planning</p>
                </Reveal>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {steps.map((step, i) => (
                    <Reveal key={step.title} delay={i * 0.08} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                      <div className="text-[#6dce93] font-black text-sm mb-2">0{i + 1}</div>
                      <h3 className="font-bold text-base mb-1.5">{step.title}</h3>
                      <p className="text-white/55 text-sm leading-relaxed">{step.desc}</p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Packages */}
            <section className="py-10 md:py-14 px-4">
              <TwinkleLights className="max-w-5xl mx-auto mb-2" />
              <div className="max-w-6xl mx-auto">
                <Reveal className="text-center mb-8">
                  <h2 className="text-2xl md:text-4xl font-black mb-2">Choose Your <span className="text-[#fce4a6]">Package</span></h2>
                  <p className="text-white/50 text-sm">Three festive packages — every one fully set up, branded, and managed by our team.</p>
                </Reveal>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                  {packages.map((pkg) => (
                    <Reveal key={pkg.id} className={`relative rounded-3xl p-6 flex flex-col h-full ${pkg.featured ? 'border-2 border-[#fce4a6]/50 bg-gradient-to-br from-[#fce4a6]/10 via-black to-black' : 'border border-white/15 bg-white/[0.04]'}`}>
                      <div className="flex justify-center mb-3">
                        <span className={`text-[11px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full ${pkg.featured ? 'bg-[#fce4a6] text-black' : 'bg-white/10 text-white/70'}`}>{pkg.badge}</span>
                      </div>
                      <p className="text-center text-white/40 text-[11px] mb-2">{pkg.kicker}</p>
                      <h3 className="text-lg font-black text-center mb-2">{pkg.title}</h3>
                      <p className="text-white/55 text-xs text-center mb-5">{pkg.desc}</p>
                      <ul className="space-y-2.5 flex-1">
                        {pkg.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <FiCheck className={`w-4 h-4 mt-0.5 flex-shrink-0 ${pkg.featured ? 'text-[#fce4a6]' : 'text-white/40'}`} />
                            <span className="text-white/75 text-xs leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <ExtraBooths />
                      <div className="mt-6 text-center">
                        <QuoteButton onClick={() => openQuote(pkg.id)} className="w-full text-xs md:text-sm">{pkg.button}</QuoteButton>
                        <p className="text-white/30 text-[10px] mt-2">Responses in &lt;15 mins · No credit card required</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <QuoteButton onClick={() => openQuote()}>{CTA}</QuoteButton>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section className="py-10 md:py-14 px-4 border-t border-white/5">
              <div className="max-w-5xl mx-auto">
                <Reveal className="text-center mb-2">
                  <p className="text-[#6dce93] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Booking Timeline</p>
                  <h2 className="text-2xl md:text-4xl font-black mb-2">December Fridays Go First</h2>
                  <p className="text-white/50 text-sm">Every company wants the same few weekends. Here&apos;s how the season typically books up.</p>
                </Reveal>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {timeline.map((slot, i) => (
                    <Reveal key={slot.when} delay={i * 0.06} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                      <p className="text-[#fce4a6] text-sm font-bold mb-1">{slot.when}</p>
                      <h3 className="font-black text-lg mb-1">{slot.title}</h3>
                      <p className="text-white/40 text-[11px] uppercase tracking-wide mb-2">Availability</p>
                      <p className="text-white/60 text-sm leading-relaxed">{slot.desc}</p>
                    </Reveal>
                  ))}
                </div>
                <Reveal className="text-center mt-8">
                  <QuoteButton onClick={() => openQuote()}>Lock In My Date</QuoteButton>
                  <p className="text-white/40 text-xs mt-3">30-second form · Availability confirmed in &lt;15 mins</p>
                </Reveal>
              </div>
            </section>

            {/* Gallery */}
            <section className="py-10 md:py-14 px-4 border-t border-white/5">
              <div className="max-w-6xl mx-auto">
                <Reveal className="mb-6">
                  <p className="text-[#6dce93] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Last Holiday Season</p>
                  <h2 className="text-2xl md:text-4xl font-black mb-2">Real Prints From Real Holiday Parties</h2>
                  <p className="text-white/50 text-sm">Every one of these was taken by our robot and printed on the spot, with each company&apos;s own logo and theme.</p>
                </Reveal>
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
                  {prints.map((shot) => (
                    <figure key={shot.src} className="snap-start shrink-0 w-[240px] md:w-[280px]">
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
                        <img src={shot.src} alt={shot.title} className="w-full h-[320px] md:h-[360px] object-cover" loading="lazy" />
                      </div>
                      <figcaption className="text-white/60 text-xs mt-2">{shot.title}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>

            {/* Why */}
            <section className="py-10 md:py-14 px-4 border-t border-white/5">
              <div className="max-w-5xl mx-auto">
                <Reveal className="text-center mb-8">
                  <h2 className="text-2xl md:text-4xl font-black mb-2">Why HR &amp; Event Teams Book Us for the Holidays</h2>
                  <p className="text-white/50 text-sm">The one part of the party that plans itself — and gets all the credit</p>
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {reasons.map((item) => (
                    <Reveal key={item.title} className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
                      <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                      <p className="text-white/55 text-xs leading-relaxed">{item.desc}</p>
                    </Reveal>
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <QuoteButton onClick={() => openQuote()}>Get a Holiday Party Quote</QuoteButton>
                </div>
              </div>
            </section>

            {/* Guestbook */}
            <section className="py-10 md:py-14 px-4 border-t border-white/5">
              <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <Reveal>
                  <p className="text-[#fce4a6] text-xs font-semibold tracking-[0.18em] uppercase mb-2">Most Popular Upgrade</p>
                  <h2 className="text-2xl md:text-4xl font-black mb-3">Capture the Year-End Thank-Yous</h2>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    The Robot Video Guestbook rolls up to your team and records short video messages — shout-outs to colleagues, holiday wishes, and highlights from the year. We compile them into one video you can play at the next all-hands or share internally.
                  </p>
                  <ul className="space-y-2 mb-5">
                    {guestbookPoints.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-white/75 text-sm">
                        <FiCheck className="w-4 h-4 text-[#6dce93] mt-0.5 flex-shrink-0" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <QuoteButton onClick={() => openQuote('signature')}>Book Year-End Signature</QuoteButton>
                </Reveal>
                <div className="rounded-2xl overflow-hidden border border-white/10">
                  <img src="/images/holiday/two-robots-light-tunnel.jpg" alt="Two Robot Photobooths in an illuminated corporate event tunnel" className="w-full h-[320px] lg:h-[420px] object-cover" loading="lazy" />
                </div>
              </div>
            </section>

            {/* Seasonal */}
            <section className="py-10 md:py-14 px-4 border-t border-white/5">
              <div className="max-w-5xl mx-auto">
                <Reveal className="text-center mb-8">
                  <h2 className="text-2xl md:text-4xl font-black mb-2">Dressed for the Season, Built for Your Brand</h2>
                  <p className="text-white/50 text-sm">Every detail is tailored to your company&apos;s holiday theme</p>
                </Reveal>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {styling.map((item) => (
                    <Reveal key={item.title} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                    </Reveal>
                  ))}
                </div>
                <img src="/images/holiday/robot-holiday-gala-arch.jpg" alt="Robot Photobooth under a holiday balloon arch at a corporate gala" className="w-full max-h-[420px] object-cover rounded-2xl border border-white/10" loading="lazy" />
                <div className="flex justify-center mt-8">
                  <QuoteButton onClick={() => openQuote()}>Book My Holiday Party</QuoteButton>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-10 md:py-14 px-4 border-t border-white/5">
              <div className="max-w-5xl mx-auto">
                <Reveal className="text-center mb-6">
                  <h2 className="text-2xl md:text-4xl font-black mb-2">What Clients Are Saying</h2>
                  <p className="text-[#fce4a6] text-sm">★★★★★ 5.0 on Google</p>
                </Reveal>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  {testimonials.map((t) => (
                    <Reveal key={t.name} className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
                      <p className="text-[#fce4a6]/70 text-xs mb-2">★★★★★</p>
                      <p className="text-white/80 text-sm leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
                      <p className="text-white text-xs font-bold">{t.name}</p>
                      <p className="text-white/40 text-[11px]">{t.role}</p>
                    </Reveal>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {testimonialVideos.map((src) => (
                    <div key={src} className="rounded-2xl overflow-hidden border border-white/10 bg-black">
                      <video className="w-full max-h-[60vh] object-contain" controls playsInline preload="metadata">
                        <source src={src} type="video/quicktime" />
                        <source src={src} type="video/mp4" />
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="py-10 md:py-14 px-4 border-t border-white/5">
              <div className="max-w-3xl mx-auto">
                <Reveal className="text-center mb-6">
                  <h2 className="text-2xl md:text-4xl font-black">Holiday Party Questions</h2>
                </Reveal>
                <div className="space-y-2">
                  {faqs.map((faq, i) => (
                    <button key={faq.question} onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full text-left bg-white/[0.04] border border-white/10 rounded-xl p-4 hover:border-[#6dce93]/40 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-bold text-sm md:text-base">{faq.question}</h3>
                        {expandedFaq === i ? <FiChevronUp className="text-[#6dce93] w-4 h-4 flex-shrink-0" /> : <FiChevronDown className="text-[#6dce93] w-4 h-4 flex-shrink-0" />}
                      </div>
                      <AnimatePresence>
                        {expandedFaq === i && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-white/60 text-sm mt-2 leading-relaxed">
                            {faq.answer}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Close */}
            <section className="relative z-10 pt-10 md:pt-14 pb-28 md:pb-40 px-4 border-t border-white/5 overflow-hidden">
              <TwinkleLights count={20} className="absolute top-6 left-0 right-0 opacity-80" />
              <ChristmasTreeRow />
              <Reveal className="relative z-10 max-w-2xl mx-auto text-center">
                <div className="text-3xl md:text-4xl mb-2" aria-hidden>❄️</div>
                <h2 className="text-2xl md:text-4xl font-black mb-3">Give Your Team a Holiday Party <span className="text-[#e23d4a]">Worth Remembering.</span></h2>
                <p className="text-white/60 text-sm mb-6">December weekends are limited and they go first. Tell us your date — we&apos;ll confirm availability and send your holiday package options within 15 minutes.</p>
                <QuoteButton onClick={() => openQuote()}>Check Availability &amp; Get a Quote</QuoteButton>
                <p className="text-white/50 text-sm mt-4">
                  <a href={`mailto:${market.intakeEmail}`} className="hover:text-white">{market.intakeEmail}</a>
                  <span className="mx-2">·</span>
                  <a href={market.phoneTel} className="hover:text-white">{market.phoneDisplay}</a>
                </p>
                <p className="text-white/35 text-[11px] mt-2">Responses in &lt;15 mins&ensp;|&ensp;No credit card required</p>
              </Reveal>
            </section>
            <div className="h-20" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-md p-0 md:p-4">
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} className="bg-white rounded-t-2xl md:rounded-2xl p-5 md:p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => { setShowModal(false); setSuccess(false) }} className="absolute top-3 right-4 text-black/40 hover:text-black text-2xl" aria-label="Close">×</button>
              {packageType && (
                <div className="bg-[#fce4a6] rounded-xl px-4 py-2.5 mb-3 text-center">
                  <span className="text-black text-xs font-black">{packageLabels[packageType]}</span>
                </div>
              )}
              <h2 className="text-lg md:text-2xl font-black text-black mb-1 text-center">{packageType ? `Book ${packageLabels[packageType]}` : CTA}</h2>
              <p className="text-black/60 text-xs md:text-sm mb-4 text-center">Tell us the party date. We reply with availability and package options.</p>
              {success ? (
                <div className="text-green-600 text-center font-bold py-6">Thank you. We&apos;ll confirm your date shortly.</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <input type="text" name="firstName" value={form.firstName} onChange={handleInput} required placeholder="First Name *" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none text-black focus:ring-2 focus:ring-[#fce4a6]" />
                  <input type="tel" name="phone" value={form.phone} onChange={handleInput} required placeholder="Phone Number *" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none text-black focus:ring-2 focus:ring-[#fce4a6]" />
                  <input type="email" name="email" value={form.email} onChange={handleInput} required placeholder="Email *" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none text-black focus:ring-2 focus:ring-[#fce4a6]" />
                  <input type="date" name="eventDate" value={form.eventDate} onChange={handleInput} required aria-label="Party date" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none text-black focus:ring-2 focus:ring-[#fce4a6]" />
                  <select name="headcount" value={form.headcount} onChange={handleInput} required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none text-black focus:ring-2 focus:ring-[#fce4a6]">
                    <option value="">Approximate headcount *</option>
                    <option value="Under 100">Under 100</option>
                    <option value="100-150">100–150</option>
                    <option value="150+">150+</option>
                  </select>
                  <button type="submit" disabled={submitting} className="w-full bg-[#fce4a6] text-black py-3.5 rounded-xl font-bold text-sm hover:bg-[#e8d08e] disabled:opacity-60">
                    {submitting ? 'Sending…' : `${CTA} →`}
                  </button>
                  <p className="text-center text-black/30 text-[10px]">No spam. We respond within 15 minutes during business hours.</p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showModal && showSticky && (
          <motion.button initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} onClick={() => openQuote()}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-auto z-40 bg-[#fce4a6] text-black font-bold px-6 py-3.5 rounded-full shadow-xl text-sm">
            {CTA} <FiArrowRight className="inline ml-1 w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

const heroBullets = [
  'Festive branded prints every employee takes home',
  'Brings every department together — no one left out',
  'Fully managed: no power, WiFi, or setup needed from your venue',
]

const steps = [
  { title: 'Pick Your Date & Package', desc: 'Tell us your party date, venue, and headcount. We confirm availability within 15 minutes and recommend the right package for your team size.' },
  { title: 'We Design Your Holiday Look', desc: 'Share your logo and theme — winter wonderland, elegant gold, or fully on-brand. We build a custom holiday overlay and handle every detail.' },
  { title: 'Your Team Makes Memories', desc: 'Our attendant roams the robot through cocktails, dinner, and the dance floor. Prints roll out on the spot and photos hit phones instantly.' },
]

const extraBooths = [
  { name: 'Premium Booth', src: '/images/premium-booth.jpg' },
  { name: '360 Booth', src: '/images/360-booth-main.jpg' },
]

const packages: { id: Exclude<PackageId, ''>; badge: string; kicker: string; title: string; desc: string; items: string[]; button: string; featured?: boolean }[] = [
  {
    id: 'essentials',
    badge: 'Winter Essentials',
    kicker: '1 Robot Photobooth',
    title: 'The Holiday Snapshot',
    desc: 'The standalone holiday activation — one roaming Robot Photobooth dressed for the season and fully managed by our team.',
    items: [
      'One Robot Photobooth roaming your holiday party table-to-table',
      'Custom holiday overlay with your company logo & theme',
      'Physical prints your team takes home as a keepsake',
      'Instant digital delivery straight to every guest\'s phone',
      'Dedicated on-site attendant — zero work for your team',
    ],
    button: 'Book Winter Essentials',
  },
  {
    id: 'signature',
    badge: '⭐ Most Popular · Year-End Signature',
    kicker: '1 Robot Photobooth & 1 Robot Video Guestbook',
    title: 'The Year-End Celebration',
    desc: 'Photos and heartfelt video messages — capture the fun of the night and the year-end thank-yous your team shares.',
    items: [
      'Robot Photobooth roaming with branded prints',
      'Robot Video Guestbook capturing team shout-outs and year-end wishes',
      'Compiled year-end video delivered after the party — perfect for internal comms',
      'Custom holiday overlay with your company logo & theme',
      'Dedicated attendants managing both robots',
    ],
    button: 'Book Year-End Signature',
    featured: true,
  },
  {
    id: 'gala',
    badge: '💎 Executive Gala',
    kicker: 'Multi-Robot Experience',
    title: 'The Grand Winter Soirée',
    desc: 'For large company parties — multiple robots across your venue so every department, table, and dance floor is covered.',
    items: [
      'Multiple Robot Photobooths and Robot Video Guestbooks',
      'Coverage across ballrooms, lounges, and multi-room venues',
      'Short lines even with hundreds of employees',
      'Custom holiday overlay with your company logo & theme',
      'One coordinated team managing everything seamlessly',
    ],
    button: 'Book Executive Gala',
  },
]

const timeline = [
  { when: 'Sep – Oct', title: 'Best Selection', desc: 'Most December Fridays and Saturdays are still open. This is when the best-organized teams lock in their date.' },
  { when: 'November', title: 'Limited', desc: 'Peak weekends are usually taken. Weeknights and early-December dates are still possible.' },
  { when: 'December', title: 'Waitlist Only', desc: 'Last-minute requests are first-come, first-served. We regularly turn teams away — don\'t leave it this late.' },
]

const prints = [
  { src: '/images/holiday/td-holiday-gala.jpg', title: 'TD Holiday Gala' },
  { src: '/images/holiday/hilton-holiday-gala.jpg', title: 'Hilton Mississauga Holiday Gala' },
  { src: '/images/holiday/alphawave-holiday-gala.jpg', title: 'Alphawave Semi Holiday Gala' },
  { src: '/images/holiday/appficiency-holiday-party.jpg', title: 'Appficiency Office Holiday Party' },
  { src: '/images/holiday/prg-holiday-party.jpg', title: 'PRG Corp Holiday Celebration' },
  { src: '/images/holiday/relay-winter-holiday-party.jpg', title: 'Relay Winter Holiday Party' },
  { src: '/images/holiday/alta-holiday-party.jpg', title: 'Alta E-Solutions Holiday Party' },
  { src: '/images/holiday/td-coliseum-holiday.jpg', title: 'TD Coliseum Holiday Greetings' },
  { src: '/images/holiday/universal-new-years.jpg', title: "Universal EventSpace New Year's Celebration" },
]

const reasons = [
  { title: 'Breaks Down Department Silos', desc: 'Finance, sales, and engineering all crowd around the robot. It sparks cross-team moments that simply don\'t happen at a regular party.' },
  { title: 'A Keepsake, Not Another Swag Item', desc: 'Festive prints with your logo and the year end up on desks and fridges well into the new year — a thank-you your team actually keeps.' },
  { title: 'Zero Work for Your Team', desc: 'No power outlets, no WiFi, no special layout. We arrive early, set up, run it, and pack up — you get to enjoy your own party.' },
  { title: 'Instant Employer-Brand Content', desc: 'Branded photos land on phones in seconds and flow onto LinkedIn and Slack — authentic culture content your talent team will love.' },
  { title: 'Works in Any Venue', desc: 'Hotel ballrooms, restaurant buyouts, rooftop lounges, or your own office — the robot navigates between tables without disrupting service.' },
  { title: 'Procurement-Friendly & Insured', desc: 'Full liability insurance, professional attendants, and a clear, itemized quote you can forward to finance. Easy to get approved internally.' },
]

const guestbookPoints = [
  'Guests record in seconds — no line, the robot comes to them',
  'Real party atmosphere in every clip, not a static backdrop',
  'Compiled year-end video delivered after the event',
]

const styling = [
  { title: 'Custom Holiday Overlays', desc: 'A custom holiday overlay with your company logo and theme on every print — winter wonderland, elegant silver and gold, or fully custom to your brief.' },
  { title: 'Holiday Voice Greetings', desc: 'Program the robot with a custom holiday message — even in your CEO\'s voice — greeting teams and announcing every photo.' },
  { title: 'Seasonal Robot Styling', desc: 'We dress the robot to match your theme so it fits your décor, from elegant black-tie galas to cozy sweater parties.' },
]

const testimonials = [
  { name: 'Rosanna', role: 'Project Manager, TD USA Trust', text: 'I want to extend a huge THANK YOU to you and your team. The photo booths were very popular among TechCon attendees. You and your team were accommodating, patient and friendly from the beginning to the end of the event. The backdrop and pictures were great quality. We especially appreciated your attention to helping us brainstorm ideas for the TechCon sticker.' },
  { name: 'Michelle T.', role: 'HR Director, Tech Company (320 employees)', text: 'We spent months planning this party and the robot was the thing everyone asked about afterward. It broke down every departmental silo in the room. We\'re booking it again next year without question.' },
  { name: 'James R.', role: 'Office Manager, Financial Services', text: 'Our team is pretty reserved at these things but within 10 minutes of the robot showing up, everyone was laughing and crowding around it. The prints are still on people\'s desks three months later.' },
]

const testimonialVideos = ['/videos/tdtestimonial.mov', '/videos/robottest1.MOV']

const faqs = [
  { question: 'How far in advance should we book for December?', answer: 'As early as possible. December Fridays and Saturdays are the first dates to go — we recommend booking by October. November bookings are possible but peak weekends are usually taken by then.' },
  { question: 'Which package is right for our team size?', answer: 'For parties under about 100 guests, Winter Essentials (one Robot Photobooth) is usually the right fit. Choose Year-End Signature to add the Robot Video Guestbook for year-end messages and shout-outs. For 150+ guests or multi-room venues, Executive Gala brings multiple robots so lines stay short and every room is covered.' },
  { question: 'Can the prints include our logo and a holiday message?', answer: 'Yes. Every print includes a custom festive overlay with your logo, the year, and an optional short message — a thank-you from leadership, a year-end tagline, or a team inside joke.' },
  { question: 'Does the robot work in a restaurant or dimly lit venue?', answer: 'Yes. The robot has built-in lighting, so ambient or candle-lit venues aren\'t a problem. It\'s about the footprint of a person and navigates between tables without disrupting service.' },
  { question: 'Do we need to provide power, WiFi, or space?', answer: 'No. The robot runs on battery and its own connectivity. No cables, no venue WiFi, no dedicated booth space — our team handles everything.' },
  { question: 'Is an attendant included?', answer: 'Yes. Every package includes a dedicated on-site attendant who manages the robot, guides guests, and handles setup and teardown.' },
  { question: 'Can you provide a quote for internal approval?', answer: 'Absolutely. We send a clear quote you can forward to finance or procurement, and we\'re fully insured. Most teams get approval within a day or two.' },
]

const companyLogos = [
  '/images/adamas.png', '/images/bell.png', '/images/bgo.png', '/images/equifax.svg',
  '/images/geotab.png', '/images/hilton.png', '/images/infosys.png', '/images/meta.png',
  '/images/pdsb.png', '/images/remax.png', '/images/ritz.webp', '/images/rlp.svg',
  '/images/stonex.png', '/images/talent.png', '/images/td.png', '/images/kellogg-foundation.png',
  '/images/sprout-social.png', '/images/BMO.svg.png',
]
