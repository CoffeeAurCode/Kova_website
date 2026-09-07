import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowDown,
  Banknote,
  CreditCard,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Lock,
  Store,
  Users,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { gsap } from '../lib/gsap'
import BlurText from '../components/BlurText'
import RippleButton from '../components/ui/RippleButton'
import { useParallax } from '../hooks/useParallax'
import { useCounterAnimation } from '../hooks/useCounterAnimation'
import { useMagneticButton } from '../hooks/useMagneticButton'

// ─── Section 1 — Free To List ────────────────────────────────────────────────

function PriceFlowIllustration() {
  const keepRef = useCounterAnimation('100%')
  const feeRef = useCounterAnimation('0')
  const guestFeeRef = useCounterAnimation('3%')
  const coinsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = coinsContainerRef.current
    if (!el) return
    const coins = el.querySelectorAll('[data-coin]')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        coins,
        { x: -40, opacity: 0 },
        {
          x: 240,
          opacity: 1,
          duration: 1.8,
          ease: 'power2.inOut',
          stagger: { each: 0.25, repeat: -1, repeatDelay: 0 },
          repeat: -1,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="liquid-glass-strong border-gold-shimmer rounded-3xl p-8 md:p-10 w-full max-w-md relative overflow-hidden">
      {/* Top label */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={14} className="text-[#D4AF37]" />
        <span className="text-[#D4AF37] text-xs font-body font-medium uppercase tracking-widest">
          Money flow
        </span>
      </div>

      {/* Guest → Bank visualization */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex flex-col items-center gap-2">
          <div className="liquid-glass rounded-full w-14 h-14 flex items-center justify-center">
            <Users size={22} className="text-white/80" />
          </div>
          <span className="text-white/60 text-[10px] font-body uppercase tracking-widest">
            Guest
          </span>
        </div>

        {/* Coin stream */}
        <div
          ref={coinsContainerRef}
          className="relative flex-1 mx-3 h-8 overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/40 to-[#D4AF37]/0" />
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              data-coin
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gold-gradient shadow-[0_0_12px_rgba(212,175,55,0.6)] text-black text-[9px] font-body font-bold flex items-center justify-center"
              style={{ left: 0, opacity: 0 }}
            >
              ₹
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="bg-gold-gradient rounded-full w-14 h-14 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <Store size={22} className="text-black" />
          </div>
          <span className="text-[#D4AF37] text-[10px] font-body uppercase tracking-widest">
            Your bank
          </span>
        </div>
      </div>

      {/* Price chip */}
      <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between mb-5">
        <div className="flex flex-col">
          <span className="text-white/40 text-[10px] font-body uppercase tracking-widest">
            Table listed at
          </span>
          <span className="text-white text-xl font-heading italic">
            ₹2,000
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#D4AF37] text-[10px] font-body uppercase tracking-widest">
            You receive
          </span>
          <span className="text-gold-gradient text-xl font-heading italic">
            ₹2,000
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="liquid-glass rounded-xl p-3 flex flex-col items-center gap-1">
          <span ref={keepRef} className="text-gold-gradient text-2xl font-heading italic leading-none">
            0%
          </span>
          <span className="text-white/50 text-[9px] font-body uppercase tracking-widest text-center leading-tight">
            You keep
          </span>
        </div>
        <div className="liquid-glass rounded-xl p-3 flex flex-col items-center gap-1">
          <span ref={feeRef} className="text-white text-2xl font-heading italic leading-none">
            0
          </span>
          <span className="text-white/50 text-[9px] font-body uppercase tracking-widest text-center leading-tight">
            Venue fee
          </span>
        </div>
        <div className="liquid-glass rounded-xl p-3 flex flex-col items-center gap-1">
          <span ref={guestFeeRef} className="text-white/60 text-2xl font-heading italic leading-none">
            0%
          </span>
          <span className="text-white/50 text-[9px] font-body uppercase tracking-widest text-center leading-tight">
            Guest fee
          </span>
        </div>
      </div>

      {/* Caption */}
      <p className="text-white/40 text-[11px] font-body font-light leading-relaxed border-t border-white/5 pt-4">
        Paid placement for top-of-feed visibility will be available down the line, but listing itself will never cost you anything.
      </p>
    </div>
  )
}

// ─── Section 2 — No-Shows ────────────────────────────────────────────────────

type PaymentMode = 'cash' | 'digital'

function NoShowIllustration() {
  const [mode, setMode] = useState<PaymentMode>('cash')
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAutoCycled = useRef(false)

  // Auto-cycle once when in view
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.to({}, {
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            if (hasAutoCycled.current) return
            hasAutoCycled.current = true
            setTimeout(() => setMode('digital'), 1400)
            setTimeout(() => setMode('cash'), 2800)
          },
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="liquid-glass-strong border-gold-shimmer rounded-3xl p-8 md:p-10 w-full max-w-md">
      {/* Toggle */}
      <div className="liquid-glass rounded-full p-1 flex items-center mb-6 relative">
        <div
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gold-gradient rounded-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          style={{ transform: mode === 'cash' ? 'translateX(0)' : 'translateX(100%)' }}
        />
        <button
          onClick={() => setMode('cash')}
          className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-body font-medium transition-colors ${
            mode === 'cash' ? 'text-black' : 'text-white/60'
          }`}
        >
          <Banknote size={14} />
          Cash at Door
        </button>
        <button
          onClick={() => setMode('digital')}
          className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-body font-medium transition-colors ${
            mode === 'digital' ? 'text-black' : 'text-white/60'
          }`}
        >
          <CreditCard size={14} />
          Digital
        </button>
      </div>

      {/* Animated card */}
      <div className="relative min-h-[280px]">
        <AnimatePresence mode="wait">
          {mode === 'cash' ? (
            <motion.div
              key="cash"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs font-body font-medium uppercase tracking-widest">
                  Spot Locked
                </span>
              </div>

              <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between border-l-2 border-[#D4AF37]">
                <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] font-body uppercase tracking-widest">
                    Platform fee (paid now)
                  </span>
                  <span className="text-gold-gradient text-2xl font-heading italic">
                    ₹150
                  </span>
                </div>
                <CheckCircle2 size={22} className="text-[#D4AF37]" />
              </div>

              <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between opacity-50">
                <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] font-body uppercase tracking-widest">
                    Due at door
                  </span>
                  <span className="text-white/60 text-2xl font-heading italic">
                    ₹1,850
                  </span>
                </div>
                <span className="text-white/30 text-[10px] font-body uppercase tracking-widest">
                  Cash
                </span>
              </div>

              <div className="mt-2 rounded-xl p-4 border border-[#D4AF37]/30 bg-[#D4AF37]/5">
                <p className="text-white/80 text-sm font-body leading-relaxed">
                  <span className="text-[#D4AF37] font-medium">No-show?</span> You still keep the ₹150 because they paid to secure the spot.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="digital"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs font-body font-medium uppercase tracking-widest">
                  Settled in full
                </span>
              </div>

              <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between border-l-2 border-[#D4AF37]">
                <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] font-body uppercase tracking-widest">
                    Settled to your account
                  </span>
                  <span className="text-gold-gradient text-2xl font-heading italic">
                    ₹2,000
                  </span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <CheckCircle2 size={22} className="text-[#D4AF37]" />
                </motion.div>
              </div>

              <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] font-body uppercase tracking-widest">
                    Paid via
                  </span>
                  <span className="text-white text-sm font-body font-medium">
                    UPI / Card
                  </span>
                </div>
                <span className="text-white/40 text-[10px] font-body uppercase tracking-widest">
                  Before arrival
                </span>
              </div>

              <div className="mt-2 rounded-xl p-4 border border-[#D4AF37]/30 bg-[#D4AF37]/5">
                <p className="text-white/80 text-sm font-body leading-relaxed">
                  <span className="text-[#D4AF37] font-medium">No-show?</span> You keep the full ₹2,000. The money never left your account.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Section 3 — Early Ones Win ──────────────────────────────────────────────

const feedVenues = [
  { name: 'The Standard', tag: 'Koramangala', price: '₹2,500', featured: true, bookings: 1248 },
  { name: 'Kitty Ko', tag: 'Lavelle Road', price: '₹1,800', featured: false, bookings: 612 },
  { name: 'High Ultra Lounge', tag: 'MG Road', price: '₹3,000', featured: false, bookings: 489 },
  { name: 'Skyye', tag: 'UB City', price: '₹2,200', featured: false, bookings: 301 },
]

function FeedSimulation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bookingsRef = useCounterAnimation('1248')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const cards = el.querySelectorAll('[data-venue-card]')
    const badge = el.querySelector('[data-partner-badge]')

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
      })

      tl.fromTo(
        cards,
        { y: 30, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
        }
      ).fromTo(
        badge,
        { scale: 0, rotation: -20, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(2.2)' },
        '-=0.2'
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="w-full max-w-md">
      {/* Phone-frame */}
      <div className="liquid-glass-strong border-gold-shimmer rounded-[2rem] p-3 relative">
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 pt-2 pb-3">
          <span className="text-white/40 text-[10px] font-body uppercase tracking-widest">
            Bengaluru · Tonight
          </span>
          <TrendingUp size={14} className="text-[#D4AF37]" />
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-2">
          {feedVenues.map((v, i) => (
            <div
              key={v.name}
              data-venue-card
              className={`relative rounded-2xl p-3 flex items-center justify-between ${
                v.featured
                  ? 'liquid-glass border-gold-shimmer bg-[#D4AF37]/[0.04]'
                  : 'liquid-glass'
              }`}
              style={{ opacity: 0 }}
            >
              {v.featured && (
                <div
                  data-partner-badge
                  className="absolute -top-2 -right-2 bg-gold-gradient rounded-full px-2.5 py-1 flex items-center gap-1 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  style={{ opacity: 0 }}
                >
                  <Sparkles size={10} className="text-black" />
                  <span className="text-black text-[9px] font-body font-bold uppercase tracking-widest">
                    Early Partner
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-0.5">
                <span
                  className={`text-sm font-body font-semibold ${
                    v.featured ? 'text-white' : 'text-white/80'
                  }`}
                >
                  {v.name}
                </span>
                <span className="text-white/40 text-[10px] font-body">
                  {v.tag}
                </span>
                {v.featured && (
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      ref={bookingsRef}
                      className="text-[#D4AF37] text-[11px] font-body font-medium"
                    >
                      0
                    </span>
                    <span className="text-[#D4AF37]/70 text-[10px] font-body">
                      bookings this month
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-sm font-heading italic ${
                    v.featured ? 'text-gold-gradient' : 'text-white/70'
                  }`}
                >
                  {v.price}
                </span>
                <span
                  className={`text-[9px] font-body uppercase tracking-widest ${
                    v.featured ? 'text-[#D4AF37]' : 'text-white/30'
                  }`}
                >
                  {v.featured ? 'Selling out' : 'Available'}
                </span>
              </div>

              {/* Rank indicator */}
              <div className="absolute left-3 -top-2 text-white/20 text-[10px] font-body">
                #{i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom caption inside phone frame */}
        <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-white/5">
          <span className="w-1 h-1 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-white/40 text-[10px] font-body uppercase tracking-widest">
            4 venues · Updated live
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Reusable section row ────────────────────────────────────────────────────

function SectionRow({
  number,
  label,
  title,
  body,
  illustration,
  reversed = false,
  accent,
}: {
  number: string
  label: string
  title: string
  body: string[]
  illustration: React.ReactNode
  reversed?: boolean
  accent: string
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rowRef.current, start: 'top 75%', once: true },
      })

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
        { opacity: 0, x: reversed ? 60 : -60, filter: 'blur(6px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' }
      ).fromTo(
        cardRef.current,
        { opacity: 0, x: reversed ? -60 : 60, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      )
    })
    return () => ctx.revert()
  }, [reversed])

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
        {number}
      </span>

      <div
        className={`relative z-10 flex flex-col gap-12 ${
          reversed ? 'md:flex-row-reverse' : 'md:flex-row'
        } items-center`}
      >
        {/* Text side */}
        <div ref={textRef} className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[#D4AF37] text-xs font-body font-medium uppercase tracking-widest">
              {label}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/30 to-transparent" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-6xl md:text-7xl font-heading italic text-gold-gradient leading-none">
              {number}
            </span>
            <h3 className="text-3xl md:text-4xl font-heading italic text-white leading-snug max-w-sm">
              {title}
            </h3>
          </div>

          <div className="flex flex-col gap-4 max-w-md">
            {body.map((para, i) => (
              <p key={i} className="text-white/55 font-body font-light text-sm md:text-base leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          <span className="text-[#D4AF37]/80 font-body text-sm font-medium flex items-center gap-1.5 mt-2">
            {accent}
          </span>
        </div>

        {/* Illustration side */}
        <div ref={cardRef} className="flex-1 flex items-center justify-center w-full">
          {illustration}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PromotersVenues() {
  const heroRef = useRef<HTMLDivElement>(null)
  const videoFrameRef = useParallax<HTMLDivElement>(0.1)
  const ctaRef = useRef<HTMLDivElement>(null)
  const ctaBtnRef = useMagneticButton<HTMLSpanElement>(0.3)

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

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current.children,
          { opacity: 0, y: 30, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.12,
            duration: 0.9,
            ease: 'power3.out',
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
      <section className="ep-hero ep-hero--venues">
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(212,175,55,0.1) 0%, transparent 70%)',
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
            <span>For Venues &amp; Promoters</span>
          </div>

          {/* Heading */}
          <h1
            data-hero
            className="ep-hero-title"
            style={{ opacity: 0 }}
          >
            List your<br />events for free.
          </h1>

          {/* Subtext */}
          <p
            data-hero
            className="ep-hero-body"
            style={{ opacity: 0 }}
          >
            Zero fees to list. No-shows do not cost you a rupee. The venues who join first
            become the names everyone books by default.
          </p>

          {/* Video frame */}
          <div
            data-hero
            className="hidden"
            style={{ opacity: 0, aspectRatio: '16 / 9' }}
          >
            <div ref={videoFrameRef} className="absolute inset-0 w-full h-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                src="/djmixer.mp4"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            </div>
            {/* Overlay UI hint */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="liquid-glass rounded-full px-3 py-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-white/80 text-[10px] font-body uppercase tracking-widest">
                  Live on Entrava
                </span>
              </div>
              <span className="text-white/60 text-[10px] font-body uppercase tracking-widest">
                Built for venues
              </span>
            </div>
          </div>

          {/* Scroll cue */}
          <div
            data-hero
            className="hidden"
            style={{ opacity: 0 }}
          >
            <span className="text-white/30 text-xs font-body uppercase tracking-widest">
              Three reasons to list
            </span>
            <ArrowDown size={14} className="text-white/30 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Sections ─────────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        <SectionRow
          number="01"
          label="Pricing"
          title="Free To List."
          body={[
            'No subscription, no listing fee, no commission. We charge the guest a 3% platform fee. You keep 100% of your listed price, straight to your bank account.',
            'Paid placement for top-of-feed visibility will be available down the line for venues that want it, but listing itself will never cost you anything.',
          ]}
          illustration={<PriceFlowIllustration />}
          accent="Zero fees. Ever. →"
        />

        <SectionRow
          number="02"
          label="Guaranteed Revenue"
          title="No-Shows Aren't Your Problem."
          body={[
            "Cash at Doorstep guests pay a fee upfront just to secure their spot, so they're showing up. Digital bookings (UPI and card) are paid in full before they arrive, settled straight to your account.",
            "If they don't show, you keep the money. Either way, you're covered.",
          ]}
          illustration={<NoShowIllustration />}
          reversed
          accent="Every booking is money in the bank. →"
        />

        <SectionRow
          number="03"
          label="First-Mover Advantage"
          title="The Early Ones Win."
          body={[
            'The first wave of Entrava users will book from whatever is listed. The venues that join now get that visibility by default. The ones that don\'t simply won\'t exist on the platform where people are looking.',
            'Early partners build a reputation before it\'s competitive. A venue that consistently sells out on Entrava becomes the one everyone tries to book first.',
          ]}
          illustration={<FeedSimulation />}
          accent="Be the venue they open the app for. →"
        />
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative px-6 md:px-16 lg:px-24 pb-32 pt-8">
        <div className="max-w-7xl mx-auto w-full">
          <div
            ref={ctaRef}
            className="liquid-glass border-gold-shimmer rounded-3xl p-12 md:p-20 flex flex-col items-center text-center gap-6 relative overflow-hidden"
          >
            {/* Ambient glow inside CTA */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.12) 0%, transparent 60%)',
              }}
            />

            <div className="liquid-glass rounded-full px-3.5 py-1 relative z-10">
              <span className="text-white text-xs font-medium font-body">
                Get listed
              </span>
            </div>
            <h2 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-heading italic text-gold-gradient tracking-tight leading-[0.9] max-w-2xl">
              <BlurText text="Get listed before everyone else does." delay={70} />
            </h2>
            <p className="relative z-10 text-white/55 font-body font-light text-sm md:text-base max-w-md">
              No fees. Ninety seconds to set up. We handle discovery, payments, and the door. You run the night.
            </p>
            <div className="relative z-10 flex items-center gap-4 mt-2 flex-wrap justify-center">
              <RippleButton
                href="#"
                className="bg-gold-gradient text-black rounded-full px-6 py-3 flex items-center gap-2 text-sm font-body font-semibold hover:opacity-90 transition-opacity"
              >
                <span
                  ref={ctaBtnRef as React.Ref<HTMLSpanElement>}
                  className="flex items-center gap-2"
                >
                  List Your Venue
                  <ArrowUpRight size={16} />
                </span>
              </RippleButton>
              <Link
                to="/"
                className="flex items-center gap-2 text-white/50 text-sm font-body font-medium hover:text-white/80 transition-colors"
              >
                Back to home
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
