import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowLeft } from 'lucide-react'
import { gsap } from '../lib/gsap'
import BlurText from '../components/BlurText'
import RippleButton from '../components/ui/RippleButton'

// ─── Data ────────────────────────────────────────────────────────────────────

const problems = [
  {
    number: '01',
    label: 'Discovery',
    title: "You don't know what's on tonight",
    body: [
      "No platform in India shows you what's happening at clubs tonight. You end up texting friends, scrolling 12 hour old Instagram stories, DMing a promoter who may not reply in time. You don't know the entry price until three people down the chain tell you, and if you're going to a new city, you're completely in the dark.",
      'The information exists. It just lives scattered across WhatsApp forwards, promoter bios, and venue pages last updated in 2022.',
    ],
    solution: 'Entrava puts every event, every venue, and every price in one feed. Open the app, pick your city, know your night.',
    accent: 'Discover your night →',
  },
  {
    number: '02',
    label: 'The Door',
    title: 'The door is chaos',
    body: [
      "You get there at 11. It's not a queue anymore. It's a crowd of 50. The bouncer lets in 4 at a time. Some people who've paid are still outside. Cash is being thrown around. An hour later, you're still out there, not knowing if you're getting in.",
      "The worst part? You've already spent ₹500 on an Uber and turned down two other plans. And you're standing on a pavement.",
    ],
    solution: 'Book on Entrava before you leave home. Show up, scan your QR, walk in.',
    accent: 'Skip every queue →',
  },
  {
    number: '03',
    label: 'The Bill',
    title: 'Splitting a table is a mess',
    body: [
      "You buy a table with your 15 friends and while most pay, you know Aryan is never paying you back. Someone pays upfront, the rest promise to transfer, and by 2 AM you're the unofficial treasurer of a group that's too drunk to do arithmetic.",
      'Add your friends on Entrava, book the table, and the app sends each person their share to pay by UPI or card. The QR unlocks for the whole group only once everyone has paid.',
    ],
    solution: 'No fronting. No chasing. No drama.',
    accent: 'Split it clean →',
  },
  {
    number: '04',
    label: 'Payment',
    title: 'Who carries cash in 2026?',
    body: [
      "Most venues are still cash-only at the door. Nobody carries cash anymore. The ATM is two streets away and has a queue. Your friends are waiting inside. You're the person holding everyone up.",
      'Pay by UPI or card on Entrava and get your QR instantly. Prefer cash? Pay the platform fee online to lock in your spot, and settle the rest at the door. Guaranteed entry either way.',
    ],
    solution: 'UPI. Card. Or cash at the door. Your call, with entry guaranteed.',
    accent: 'Pay your way →',
  },
]

const pillars = [
  {
    number: '1',
    title: 'Discover',
    body: 'Every event, every venue, every price in one feed. Updated in real time. No more chasing promoters.',
  },
  {
    number: '2',
    title: 'Book',
    body: 'Your table in under 60 seconds. QR pass straight to your phone. No calls, no back-and-forth.',
  },
  {
    number: '3',
    title: 'Arrive',
    body: 'Walk straight in. No queue, no chaos. The night starts the moment you get there.',
  },
]

// ─── Components ──────────────────────────────────────────────────────────────

function ProblemRow({
  problem,
  index,
}: {
  problem: (typeof problems)[0]
  index: number
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const isEven = index % 2 === 1

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rowRef.current, start: 'top 75%', once: true },
      })

      // Watermark number
      if (numRef.current) {
        gsap.fromTo(
          numRef.current,
          { opacity: 0, scale: 1.2 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: { trigger: rowRef.current, start: 'top 80%', once: true },
          }
        )
      }

      tl.fromTo(
        textRef.current,
        { opacity: 0, x: isEven ? 60 : -60, filter: 'blur(6px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' }
      ).fromTo(
        cardRef.current,
        { opacity: 0, x: isEven ? -60 : 60, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      )
    })
    return () => ctx.revert()
  }, [isEven])

  return (
    <div ref={rowRef} className="relative py-20 md:py-28">
      {/* Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Watermark number */}
      <span
        ref={numRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-heading italic text-white/[0.02] select-none pointer-events-none leading-none"
        style={{ opacity: 0 }}
      >
        {problem.number}
      </span>

      <div
        className={`relative z-10 flex flex-col gap-12 ${
          isEven ? 'md:flex-row-reverse' : 'md:flex-row'
        } items-center`}
      >
        {/* Text side */}
        <div ref={textRef} className="flex-1 flex flex-col gap-6">
          {/* Label + number */}
          <div className="flex items-center gap-3">
            <span className="text-[#D4AF37] text-xs font-body font-medium uppercase tracking-widest">
              {problem.label}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/30 to-transparent" />
          </div>

          {/* Problem number + title */}
          <div className="flex flex-col gap-2">
            <span className="text-6xl md:text-7xl font-heading italic text-gold-gradient leading-none">
              {problem.number}
            </span>
            <h3 className="text-2xl md:text-3xl font-heading italic text-white leading-snug max-w-sm">
              {problem.title}
            </h3>
          </div>

          {/* Body paragraphs */}
          <div className="flex flex-col gap-4 max-w-md">
            {problem.body.map((para, i) => (
              <p key={i} className="text-white/55 font-body font-light text-sm leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Solution card */}
        <div ref={cardRef} className="flex-1 flex items-center justify-center">
          <div className="liquid-glass-strong border-gold-shimmer rounded-2xl p-8 md:p-10 flex flex-col gap-6 w-full max-w-md">
            {/* "The Fix" label */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-gradient" />
              <span className="text-[#D4AF37] text-xs font-body font-medium uppercase tracking-widest">
                The Fix
              </span>
            </div>

            {/* Solution statement */}
            <p className="text-2xl md:text-3xl font-heading italic text-white leading-snug">
              {problem.solution}
            </p>

            {/* Accent link */}
            <span className="text-white/40 font-body text-sm font-light">
              {problem.accent}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhyEntrava() {
  const heroRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)
  const pillarsHeaderRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Hero entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          [...heroRef.current.querySelectorAll('[data-hero]')],
          { opacity: 0, y: 40, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.15,
            duration: 0.9,
            ease: 'power3.out',
            delay: 0.2,
          }
        )
      }

      // Pillars header
      if (pillarsHeaderRef.current) {
        gsap.fromTo(
          pillarsHeaderRef.current.children,
          { opacity: 0, y: 30, filter: 'blur(4px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            stagger: 0.12, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: pillarsHeaderRef.current, start: 'top 80%', once: true },
          }
        )
      }

      // Pillar cards stagger
      if (pillarsRef.current) {
        const cards = pillarsRef.current.querySelectorAll('[data-pillar]')
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, filter: 'blur(4px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            stagger: 0.12, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: pillarsRef.current, start: 'top 80%', once: true },
          }
        )
      }

      // CTA
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current.children,
          { opacity: 0, y: 30, filter: 'blur(4px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            stagger: 0.12, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 85%', once: true },
          }
        )
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="ep-page">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="ep-hero ep-hero--why">
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(212,175,55,0.08) 0%, transparent 70%)',
          }}
        />

        <div ref={heroRef} className="ep-hero-copy">
          {/* Back link */}
          <Link
            data-hero
            to="/"
            className="hidden"
            style={{ opacity: 0 }}
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>

          {/* Badge */}
          <div
            data-hero
            className="ep-kicker"
            style={{ opacity: 0 }}
          >
            <span>Why Entrava</span>
          </div>

          {/* Heading */}
          <h1
            data-hero
            className="ep-hero-title"
            style={{ opacity: 0 }}
          >
            The system<br />is pure chaos.
          </h1>

          {/* Subtext */}
          <p
            data-hero
            className="ep-hero-body"
            style={{ opacity: 0 }}
          >
            Massive Crowds, No Organised System, and Pure Chaos.
          </p>

          {/* Scroll cue */}
          <div
            data-hero
            className="ep-hero-note"
            style={{ opacity: 0 }}
          >
            <span>One platform. One solution.</span>
          </div>
        </div>
      </section>

      {/* ── Problems ─────────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        {problems.map((problem, i) => (
          <ProblemRow key={problem.number} problem={problem} index={i} />
        ))}
      </section>

      {/* ── Bridge: One app ──────────────────────────────── */}
      <section className="relative overflow-hidden py-32 px-6 md:px-16 lg:px-24">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          {/* Header */}
          <div ref={pillarsHeaderRef} className="flex flex-col items-center text-center mb-16 gap-4">
            <div className="liquid-glass rounded-full px-3.5 py-1">
              <span className="text-white text-xs font-medium font-body">The Entrava Way</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9] max-w-xl">
              <BlurText text="One app. Every night covered." delay={100} />
            </h2>
            <p className="text-white/50 font-body font-light text-sm md:text-base max-w-md">
              From wondering what's on to walking through the door, Entrava handles every step so you don't have to.
            </p>
          </div>

          {/* Pillar cards */}
          <div ref={pillarsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                data-pillar
                className="liquid-glass border-gold-shimmer rounded-2xl p-8 flex flex-col gap-5"
              >
                <span className="text-4xl font-heading italic text-gold-gradient leading-none">
                  {pillar.number}
                </span>
                <div className="border-t border-white/10" />
                <div className="flex flex-col gap-3">
                  <h4 className="text-white font-body font-semibold text-lg">{pillar.title}</h4>
                  <p className="text-white/55 font-body font-light text-sm leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative px-6 md:px-16 lg:px-24 pb-32 pt-8">
        <div className="max-w-7xl mx-auto w-full">
          <div ref={ctaRef} className="liquid-glass border-gold-shimmer rounded-3xl p-12 md:p-20 flex flex-col items-center text-center gap-6">
            <div className="liquid-glass rounded-full px-3.5 py-1">
              <span className="text-white text-xs font-medium font-body">Ready?</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-gold-gradient tracking-tight leading-[0.9] max-w-2xl">
              <BlurText text="Your night, actually sorted." delay={80} />
            </h2>
            <p className="text-white/55 font-body font-light text-sm md:text-base max-w-md">
              No more guessing, queuing, chasing, or fumbling for cash. Download Entrava and take back your weekend.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <RippleButton
                href="#"
                className="liquid-glass-strong rounded-full px-6 py-3 flex items-center gap-2 text-white text-sm font-body font-medium hover:text-[#D4AF37] transition-colors"
              >
                Book a Table
                <ArrowUpRight size={16} />
              </RippleButton>
              <Link
                to="/"
                className="flex items-center gap-2 text-white/50 text-sm font-body font-medium hover:text-white/80 transition-colors"
              >
                Explore the app
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
