export type ProductUSP = {
  title: string
  description: string
}

export type ProductFAQ = {
  question: string
  answer: string
}

export type ProductTestimonial = {
  name: string
  role: string
  text: string
  image?: string
}

export type ProductData = {
  slug: string
  name: string
  tagline: string
  summary: string
  productImage: string
  videoUrl: string
  priceLabel: string
  priceNote?: string
  badges: string[]
  usp: ProductUSP[]
  faqData: ProductFAQ[]
  testimonials: ProductTestimonial[]
  bentoClass?: string
  linkOverride?: string
}

export const products: ProductData[] = [
  {
    slug: 'robot-photobooth',
    name: 'Robot Photobooth',
    tagline: 'Our signature robot photobooth that wows guests.',
    summary: 'Interactive, elegant, and designed to keep guests engaged from the first photo.',
    productImage: '/images/robo-booth-1.jpg',
    videoUrl: '/videos/robobooth.mp4',
    priceLabel: 'Custom Quote',
    priceNote: 'Most events book 4–6 hours',
    badges: ['Free delivery in USA', 'On-site attendant included'],
    usp: [
      { title: 'Guest Engagement', description: 'Robotic presence creates a line and keeps guests excited.' },
      { title: 'Studio Lighting', description: 'Consistent, flattering light in any venue.' },
      { title: 'On‑Site Attendant', description: 'We run the booth and guide guests all night.' }
    ],
    faqData: [
      { question: 'Is the robot photobooth loud?', answer: 'No. It is designed to be smooth and quiet for any event.' },
      { question: 'Can we customize the experience?', answer: 'Yes. Overlays, templates, and props are customizable.' },
      { question: 'Do you offer prints?', answer: 'Yes. We provide high-speed, lab-quality prints.' }
    ],
    testimonials: [
      { name: 'Ben S.', role: 'Groom', text: 'Our guests kept coming back for more photos.', image: '/images/Ben.png' },
      { name: 'Danica L.', role: 'Event Host', text: 'It felt premium and the photos looked studio-quality.', image: '/images/Danica.png' },
      { name: 'Mike T.', role: 'Marketing Lead', text: 'Best activation we have done. Highly recommend.', image: '/images/Mike.png' }
    ],
  },
  {
    slug: 'ai-booth',
    name: 'AI Booth',
    linkOverride: '/ai-booth',
    tagline: 'Turn every guest into a cinematic icon with AI-transformed photos.',
    summary:
      'Our AI Booth uses your photo — taken with our Premium Photobooth or Robot Photobooth — and transforms it into a stunning cinematic, editorial, or animated masterpiece.',
    productImage: '/images/aibooth1.png',
    videoUrl: '/videos/vid3.mp4',
    priceLabel: 'Custom Quote',
    priceNote: 'Delivered instantly to every guest\'s phone',
    badges: ['Free delivery in USA', 'On-site attendant included'],
    usp: [
      { title: 'Cinematic AI Styles', description: 'Classic Hollywood, animated, editorial, and fully custom themes.' },
      { title: 'Instant Phone Delivery', description: 'Transformed photos on guests\' phones within seconds.' },
      { title: 'White-Glove Service', description: 'Our team handles setup, AI processing, delivery, and teardown.' },
    ],
    faqData: [
      { question: 'What exactly is the AI Booth?', answer: 'The AI Booth captures a high-quality photo and instantly transforms it into a styled AI image — cinematic, animated, editorial, and more.' },
      { question: 'How long does the transformation take?', answer: 'The full process — from photo to transformed image on the guest\'s phone — takes under a minute.' },
      { question: 'Can we choose the AI style?', answer: 'Yes. We design a custom AI style that matches your event theme before the event.' },
    ],
    testimonials: [
      { name: 'Priya M.', role: 'Corporate Event Manager', text: 'Our guests completely lost it when they saw their AI photos. The Classic Hollywood transformation was jaw-dropping.' },
      { name: 'Jason & Kelly', role: 'Wedding Reception', text: 'We had the animated style for our wedding and every single person left with the biggest smile.' },
      { name: 'Derek T.', role: 'Brand Activation Director', text: 'The social media reach we got from guests sharing their AI photos was unreal.' },
    ],
  },
  {
    slug: 'aerial-booth',
    name: 'Aerial Booth',
    linkOverride: '/aerial',
    tagline: 'An enclosed luxury booth with studio‑grade results.',
    summary: 'Private, immersive, and consistent lighting for flawless photos every time.',
    productImage: '/images/aerial2.jpg',
    videoUrl: '/videos/vid2.MP4',
    priceLabel: 'Custom Quote',
    priceNote: 'Perfect for premium events',
    badges: ['Free delivery in USA', 'On-site attendant included'],
    usp: [
      { title: 'Enclosed Experience', description: 'Guests feel comfortable and photos look consistent.' },
      { title: 'DSLR Quality', description: 'Professional photos, videos, and GIFs.' },
      { title: 'Instant Prints', description: 'Fast prints guests take home immediately.' }
    ],
    faqData: [
      { question: 'How fast is setup?', answer: 'We typically set up in under 30 minutes.' },
      { question: 'Does it fit smaller venues?', answer: 'Yes. We can adapt to most spaces with a 10x10 area.' },
      { question: 'What sharing options are included?', answer: 'SMS, email, and AirDrop are included.' }
    ],
    testimonials: [
      { name: 'Emma D.', role: 'Bride', text: 'The booth felt so premium and the prints were stunning.', image: '/images/Emma.png' },
      { name: 'Kevin H.', role: 'Event Manager', text: 'The experience was flawless from start to finish.', image: '/images/Kevin.png' },
      { name: 'Lanny C.', role: 'Host', text: 'Guests loved the privacy and the photos were amazing.', image: '/images/Lanny.png' }
    ]
  },
  {
    slug: 'premium-photobooth',
    name: 'Premium Photobooth',
    tagline: 'A sleek, portable booth that fits anywhere.',
    summary: 'Perfect for fast-moving events and smaller spaces while still delivering great photos.',
    productImage: '/images/premium-booth.jpg',
    videoUrl: '/videos/vid3.mp4',
    priceLabel: 'Custom Quote',
    priceNote: 'Ideal for compact setups',
    badges: ['Free delivery in USA', 'On-site attendant included'],
    usp: [
      { title: 'Ultra‑Portable', description: 'Fits into tight spaces without sacrificing quality.' },
      { title: 'Quick Setup', description: 'Ready in minutes with a clean, modern look.' },
      { title: 'Share Instantly', description: 'Guests can send photos immediately.' }
    ],
    faqData: [
      { question: 'Is an attendant included?', answer: 'Yes. We provide an attendant for a smooth guest experience.' },
      { question: 'Can we brand the photos?', answer: 'Yes. Custom overlays and logos are available.' },
      { question: 'What is the minimum rental time?', answer: 'Two hours minimum, with flexible extensions.' }
    ],
    testimonials: [
      { name: 'Matthew K.', role: 'Organizer', text: 'Compact but still looked premium. Guests loved it.', image: '/images/Matthew.png' },
      { name: 'Garrett V.', role: 'Corporate Host', text: 'Easy setup and the sharing was fast.', image: '/images/Garrett.png' },
      { name: 'Xavier P.', role: 'Event Planner', text: 'Perfect for our smaller venue.', image: '/images/Xavier.png' }
    ],
    linkOverride: '/premium-photobooth',
  },
  {
    slug: '360-booth',
    name: '360 Booth',
    tagline: 'The cinematic, slow‑motion booth that creates viral content.',
    summary: 'Guests step in, we spin the camera, and they walk away with cinematic content in seconds.',
    productImage: '/images/360-booth-main.jpg',
    videoUrl: '/videos/vid.mp4',
    priceLabel: 'Custom Quote',
    priceNote: 'Pricing based on hours + add-ons',
    badges: ['Free delivery in USA', 'On-site attendant included'],
    usp: [
      { title: 'Cinematic Slow‑Mo', description: 'High-frame capture for premium, viral clips.' },
      { title: 'Fast Setup', description: 'We install in under 30 minutes with a pro attendant.' },
      { title: 'Instant Sharing', description: 'Guests receive their content via SMS, email, or AirDrop.' }
    ],
    faqData: [
      { question: 'How much space does the 360 booth need?', answer: 'We recommend a 10x10 space with access to power.' },
      { question: 'Can we add branding?', answer: 'Yes. We provide custom overlays, intro/outro, and brand colors.' },
      { question: 'Do guests get the video instantly?', answer: 'Yes. They receive it immediately on their phone.' }
    ],
    testimonials: [
      { name: 'Alex P.', role: 'Brand Manager', text: 'The 360 booth drew a crowd all night and the clips looked incredible.', image: '/images/Alex.png' },
      { name: 'Andrea M.', role: 'Event Planner', text: 'Setup was smooth and the content turned out premium.', image: '/images/Andrea.png' },
      { name: 'Jeff R.', role: 'Corporate Host', text: 'Guests loved it and sharing was instant.', image: '/images/Jeff.png' }
    ],
    linkOverride: '/360-booth',
  },
  {
    slug: 'portrait-booth',
    name: 'Portrait Booth',
    tagline: 'Magazine-quality portraits, captured and edited instantly.',
    summary: 'The elegance of a private studio, live at your event. Professional photographers capture, retouch, and deliver studio-grade portraits on-site.',
    productImage: '/images/portraitbooth1.JPG',
    videoUrl: '/videos/premiumphoto.mov',
    priceLabel: 'Custom Quote',
    priceNote: 'Perfect for weddings & brand activations',
    badges: ['Free delivery in USA', 'On-site attendant included'],
    usp: [
      { title: 'Instant Retouching', description: 'Professional edits delivered on-site in real time.' },
      { title: 'High-End Backdrops', description: 'Premium backdrop options to match your event aesthetic.' },
      { title: 'Premium Prints', description: 'Optional physical prints for a luxury keepsake.' }
    ],
    faqData: [
      { question: 'What kind of events is the Portrait Booth for?', answer: 'Weddings, galas, brand activations, and any event where guests want studio-quality portraits.' },
      { question: 'Are the photos retouched on-site?', answer: 'Yes. Our photographers capture and professionally retouch portraits in real time.' },
      { question: 'Can we customize the backdrop?', answer: 'Absolutely. We offer a range of premium backdrops or can match your event theme.' }
    ],
    testimonials: [
      { name: 'Sarah J.', role: 'Bride', text: 'Our guests felt like celebrities. The portraits were vogue-level quality.' },
      { name: 'Lanny B.', role: 'Brand Manager', text: 'The instant retouching was a game-changer for our activation.' },
      { name: 'Emma D.', role: 'Event Planner', text: 'Guests left with photos they actually wanted to post. That never happens.' }
    ],
    linkOverride: '/portrait-booth'
  },
  {
    slug: 'photography-videography',
    name: 'Photography & Videography',
    tagline: 'Cinematic event coverage that captures your milestone in HD.',
    summary: 'From keynote highlights to cinematic highlight reels — professional photography and videography handled by one seamless team.',
    productImage: '/images/PhotographyVideography1.jpeg',
    videoUrl: '/videos/Corporate.mp4',
    priceLabel: 'Custom Quote',
    priceNote: 'Full-scale event documentation',
    badges: ['Free delivery in USA', 'Rapid turnaround'],
    usp: [
      { title: '4K Cinematic Reels', description: 'High-definition sizzle reels that showcase your event\'s best moments.' },
      { title: 'Multi-Angle Coverage', description: 'Multiple photographers and videographers to capture every angle.' },
      { title: 'Rapid Turnaround', description: 'Edited highlights delivered fast so you can share while the buzz is still alive.' }
    ],
    faqData: [
      { question: 'What does the coverage include?', answer: 'Professional photography, 4K videography, edited highlight reels, and full event galleries.' },
      { question: 'How fast is turnaround?', answer: 'We deliver edited highlights within 48–72 hours and full galleries within one week.' },
      { question: 'Can you cover multi-day events?', answer: 'Yes. We offer flexible packages for conferences, retreats, and multi-day corporate events.' }
    ],
    testimonials: [
      { name: 'Mike C.', role: 'VP Marketing', text: 'The sizzle reel alone made our next event an easy sell to stakeholders.' },
      { name: 'Andrea M.', role: 'Event Director', text: 'Incredible coverage. The photos and video were ready before we even asked.' },
      { name: 'Alex F.', role: 'Corporate Planner', text: 'Professional, fast, and the quality was next level.' }
    ],
    linkOverride: '/corporate-photography'
  },
  {
    slug: 'headshots',
    name: 'Headshots',
    tagline: 'Studio-quality headshots delivered to your location.',
    summary: 'On-location headshot sessions with professional lighting and expert retouching. Perfect for corporate teams, conferences, and LinkedIn profiles.',
    productImage: '/images/photography2.jpg',
    videoUrl: '/videos/corporateheadshot.MOV',
    priceLabel: 'Custom Quote',
    priceNote: 'Individual & team sessions available',
    badges: ['We come to you', 'RAW + Edited included'],
    usp: [
      { title: 'On-Location Studio', description: 'We bring professional lighting and backdrops to your office, venue, or event.' },
      { title: 'Expert Retouching', description: 'Every headshot is professionally retouched and color-graded — LinkedIn-ready.' },
      { title: 'Fast Delivery', description: 'RAW + Edited files delivered within a week with full commercial usage rights.' }
    ],
    faqData: [
      { question: 'Do you come to our location?', answer: 'Yes — we bring the full studio setup to you wherever you need us.' },
      { question: 'How many people can you photograph?', answer: 'We handle individuals and teams of all sizes, from single executives to groups of 100+.' },
      { question: 'When do we receive the photos?', answer: 'RAW + Edited headshots are delivered within about a week of your session.' }
    ],
    testimonials: [
      { name: 'Amanda T.', role: 'HR Director', text: 'Our entire team was photographed in one afternoon. The quality was phenomenal and everyone loved their shots.' },
      { name: 'Lisa C.', role: 'Event Director', text: 'The quality was incredible and the turnaround was impressively fast. The whole team looked polished and consistent.' },
      { name: 'Robert K.', role: 'Corporate Events Manager', text: 'Professional headshots ready for our website within days. The team made everyone feel comfortable and the results were outstanding.' }
    ],
    linkOverride: '/headshots'
  }
]

