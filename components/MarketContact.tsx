import React, { useMemo, useState } from 'react'
import { FiMail, FiPhone } from 'react-icons/fi'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import { useMetaPixel } from '../hooks/useMetaPixel'
import { useUTM } from '../hooks/useUTM'
import type { MarketConfig } from '../data/markets'
import { trackTexasMetaLead } from '../lib/trackTexasMetaLead'

const budgetsByProduct: Record<string, { value: string; label: string }[]> = {
  'Robot Photobooth': [
    { value: '$1000-$1500', label: '$1,000 – $1,500' },
    { value: '$1500-$2000', label: '$1,500 – $2,000' },
    { value: '$2000+', label: '$2,000+' },
  ],
  'Aerial Booth': [
    { value: '$1000-$1500', label: '$1,000 – $1,500' },
    { value: '$1500-$2000', label: '$1,500 – $2,000' },
    { value: '$2000+', label: '$2,000+' },
  ],
  'Premium Photobooth': [
    { value: '$800-$1200', label: '$800 – $1,200' },
    { value: '$1200-$1800', label: '$1,200 – $1,800' },
    { value: '$1800+', label: '$1,800+' },
  ],
  '360 Booth': [
    { value: '$1000-$1500', label: '$1,000 – $1,500' },
    { value: '$1500-$2000', label: '$1,500 – $2,000' },
    { value: '$2000+', label: '$2,000+' },
  ],
  'Portrait Booth': [
    { value: '$1000-$1500', label: '$1,000 – $1,500' },
    { value: '$1500-$2000', label: '$1,500 – $2,000' },
    { value: '$2000+', label: '$2,000+' },
  ],
  'Photography, Videography, & Headshots': [
    { value: '$1500-$2500', label: '$1,500 – $2,500' },
    { value: '$2500-$4000', label: '$2,500 – $4,000' },
    { value: '$4000+', label: '$4,000+' },
  ],
  'Bundle': [
    { value: '$2000-$3000', label: '$2,000 – $3,000' },
    { value: '$3000-$5000', label: '$3,000 – $5,000' },
    { value: '$5000+', label: '$5,000+' },
  ],
}

/** Must match `value` keys used in budgetsByProduct. Chicago omits Aerial (same as Navbar / ProductHub). */
const CONTACT_PRODUCT_OPTIONS: { value: string; label: string }[] = [
  { value: 'Robot Photobooth', label: 'Robot Photobooth' },
  { value: 'Aerial Booth', label: 'Aerial Booth' },
  { value: 'Premium Photobooth', label: 'Premium Photobooth' },
  { value: '360 Booth', label: '360 Booth' },
  { value: 'Portrait Booth', label: 'Portrait Booth' },
  { value: 'Photography, Videography, & Headshots', label: 'Photography, Videography, & Headshots' },
  { value: 'Bundle', label: 'Bundle (Multiple Products)' },
]

const Toast = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#fce4a6] text-black px-8 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50"
  >
    <div className="bg-black/10 p-2 rounded-full">
      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    {message}
    <motion.span
      className="absolute bottom-0 left-0 h-1 bg-black/20 rounded-full"
      initial={{ width: '100%' }}
      animate={{ width: '0%' }}
      transition={{ duration: 3, ease: 'linear' }}
    />
  </motion.div>
)

type Props = { market: MarketConfig }

export default function MarketContact({ market }: Props) {
  const [showToast, setShowToast] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')
  const { trackFormSubmission } = useMetaPixel()
  const utmData = useUTM()

  const productOptions = useMemo(
    () =>
      market.id === 'chicago' || market.id === 'texas'
        ? CONTACT_PRODUCT_OPTIONS.filter((o) => o.value !== 'Aerial Booth')
        : CONTACT_PRODUCT_OPTIONS,
    [market.id],
  )

  const budgetOptions = selectedProduct ? budgetsByProduct[selectedProduct] || [] : []

  const pageTitle =
    market.id === 'national'
      ? 'Contact Us - Robo Booth'
      : market.id === 'chicago'
        ? 'Contact RoboBooth Chicago'
        : 'Contact RoboBooth Texas'

  const showRegionalSidebar = market.id !== 'national'

  return (
    <div className="min-h-screen w-full bg-black text-white pb-12">
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Book Robo Booth for your next ${market.analyticsRegion === 'USA' ? 'event' : `${market.analyticsRegion}-area event`} or get in touch with any questions.`}
        />
      </Head>
      <Navbar />
      <div className={`${showRegionalSidebar ? 'max-w-4xl' : 'max-w-3xl'} mx-auto pt-24 md:pt-28 px-4`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl shadow-xl border border-[#fce4a6]/20"
        >
          <div className="md:flex md:min-w-0">
            <div
              className={`bg-black text-[#fce4a6] p-8 rounded-t-3xl md:rounded-t-none md:rounded-l-3xl md:rounded-tr-none md:flex-shrink-0 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#fce4a6]/20 ${
                showRegionalSidebar ? 'md:w-96' : 'md:w-1/3 md:min-w-0'
              }`}
            >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold mb-6 text-[#fce4a6]">Get in Touch</h2>
                <p className="text-[#fce4a6]/90 text-sm leading-relaxed">
                  Use the form to tell us about your event and our team will follow up quickly.
                </p>
                {showRegionalSidebar && (
                  <div className="mt-8 space-y-4 border-t border-[#fce4a6]/20 pt-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#fce4a6]/50 font-semibold mb-1">Phone</div>
                      <a href={market.phoneTel} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#fce4a6] transition-colors">
                        <FiPhone className="w-4 h-4 flex-shrink-0" />
                        {market.phoneDisplay}
                      </a>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-[#fce4a6]/50 font-semibold mb-1">Email</div>
                      <a
                        href={`mailto:${market.intakeEmail}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#fce4a6] transition-colors whitespace-nowrap"
                      >
                        <FiMail className="w-4 h-4 flex-shrink-0" />
                        {market.intakeEmail}
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
            <div className="p-8 rounded-b-3xl md:rounded-b-none md:rounded-r-3xl md:flex-1 md:min-w-0">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold mb-6 text-[#fce4a6]">Book Robo Booth</h1>
                <form
                  action={market.contactFormPostUrl}
                  method="POST"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setIsSubmitting(true)

                    const form = e.target as HTMLFormElement
                    const formDataObj = new FormData(form)

                    trackFormSubmission('Contact Page Form', market.analyticsRegion, {
                      fn: formDataObj.get('full-name')?.toString().split(' ')[0],
                      ln: formDataObj.get('full-name')?.toString().split(' ').slice(1).join(' '),
                      em: formDataObj.get('_replyto')?.toString(),
                      ph: formDataObj.get('phone-number')?.toString(),
                      ct: market.analyticsRegion,
                      country: 'US',
                      ...utmData,
                    })

                    try {
                      const formData = new FormData(form)
                      Object.entries(utmData).forEach(([key, value]) => {
                        if (value) formData.append(key, value)
                      })

                      const response = await fetch(market.contactFormPostUrl, {
                        method: 'POST',
                        body: formData,
                        headers: { Accept: 'application/json' },
                      })
                      if (response.ok) {
                        setShowToast(true)
                        trackTexasMetaLead(market.id)
                        form.reset()
                        setTimeout(() => setShowToast(false), 3000)
                      } else {
                        throw new Error('Failed to submit form')
                      }
                    } catch (error) {
                      console.error('Error submitting form:', error)
                      alert('Failed to send message. Please try again.')
                    } finally {
                      setIsSubmitting(false)
                    }
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-[#fce4a6] mb-1">Name</label>
                    <input
                      type="text"
                      required
                      name="full-name"
                      className="w-full px-4 py-2 rounded-lg border border-[#fce4a6]/30 bg-black text-white focus:ring-2 focus:ring-[#fce4a6] focus:border-[#fce4a6] placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#fce4a6] mb-1">Email</label>
                    <input
                      type="email"
                      required
                      name="_replyto"
                      className="w-full px-4 py-2 rounded-lg border border-[#fce4a6]/30 bg-black text-white focus:ring-2 focus:ring-[#fce4a6] focus:border-[#fce4a6] placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#fce4a6] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      name="phone-number"
                      className="w-full px-4 py-2 rounded-lg border border-[#fce4a6]/30 bg-black text-white focus:ring-2 focus:ring-[#fce4a6] focus:border-[#fce4a6] placeholder:text-white/50"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#fce4a6] mb-1">Product</label>
                    <select
                      required
                      name="product"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-[#fce4a6]/30 bg-black text-white focus:ring-2 focus:ring-[#fce4a6] focus:border-[#fce4a6]"
                    >
                      <option value="">Select product</option>
                      {productOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#fce4a6] mb-1">Event Type</label>
                    <select
                      required
                      name="event-type"
                      className="w-full px-4 py-2 rounded-lg border border-[#fce4a6]/30 bg-black text-white focus:ring-2 focus:ring-[#fce4a6] focus:border-[#fce4a6]"
                    >
                      <option value="">Select event type</option>
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="graduation">Graduation</option>
                      <option value="brand-activation">Brand Activation</option>
                      <option value="gala">Gala / Fundraiser</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#fce4a6] mb-1">Budget</label>
                    <select
                      required
                      name="budget"
                      className="w-full px-4 py-2 rounded-lg border border-[#fce4a6]/30 bg-black text-white focus:ring-2 focus:ring-[#fce4a6] focus:border-[#fce4a6] disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={!selectedProduct}
                    >
                      <option value="">{selectedProduct ? 'Select budget' : 'Select a product first'}</option>
                      {budgetOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#fce4a6] mb-1">Event Date</label>
                    <input
                      type="date"
                      required
                      name="event-date"
                      className="w-full px-4 py-2 rounded-lg border border-[#fce4a6]/30 bg-black text-white focus:ring-2 focus:ring-[#fce4a6] focus:border-[#fce4a6] placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#fce4a6] mb-1">Message</label>
                    <textarea
                      rows={4}
                      name="message"
                      className="w-full px-4 py-2 rounded-lg border border-[#fce4a6]/30 bg-black text-white focus:ring-2 focus:ring-[#fce4a6] focus:border-[#fce4a6] placeholder:text-white/50"
                      placeholder="Tell us about your event..."
                    />
                  </div>
                  <input type="hidden" name="source" value={market.formSource} />
                  <input type="hidden" name="intake-market" value={market.id} />
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#fce4a6] text-black font-semibold py-3 rounded-xl text-lg shadow-md hover:bg-[#fce4a6]/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.div>
        <AnimatePresence>{showToast && <Toast message="Thank you! Your message has been sent." />}</AnimatePresence>
      </div>
    </div>
  )
}
