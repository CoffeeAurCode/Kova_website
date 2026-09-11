import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import BlurText from './BlurText'
import { gsap } from '../lib/gsap'
import { useParallax } from '../hooks/useParallax'
import { useMagneticButton } from '../hooks/useMagneticButton'
import RippleButton from './ui/RippleButton'

export default function CtaFooter() {
  const videoRef = useParallax<HTMLDivElement>(0.2)
  const bookBtnRef = useMagneticButton<HTMLAnchorElement>(0.3)
  const viewBtnRef = useMagneticButton<HTMLAnchorElement>(0.3)
  const contentRef = useRef<HTMLDivElement>(null)
  const footerLinksRef = useRef<HTMLAnchorElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content reveal
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.querySelectorAll('[data-reveal]'),
          { opacity: 0, y: 40, filter: 'blur(4px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            stagger: 0.15, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: contentRef.current, start: 'top 75%', once: true },
          }
        )
      }

      // Footer link underline hover animation
      footerLinksRef.current.forEach((link) => {
        if (!link) return
        const underline = link.querySelector('.link-underline') as HTMLElement | null
        if (!underline) return

        link.addEventListener('mouseenter', () =>
          gsap.to(underline, { scaleX: 1, duration: 0.3, ease: 'power2.out' })
        )
        link.addEventListener('mouseleave', () =>
          gsap.to(underline, { scaleX: 0, duration: 0.25, ease: 'power2.in' })
        )
      })
    })
    return () => ctx.revert()
  }, [])

  const footerLinks = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Refunds', href: '/refund-policy' },
    { label: 'Contact', href: '/#lp-contact' },
  ]

  return (
    <section className="relative overflow-hidden">
      {/* HLS video background with parallax */}
      <div
        ref={videoRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <video
          src="/2026946_3d_Abstract_1280x720.mp4"
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Top gradient fade */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-[1]"
        style={{ height: 200, background: 'linear-gradient(to bottom, black, transparent)' }}
      />

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
        style={{ height: 200, background: 'linear-gradient(to top, black, transparent)' }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 px-6 md:px-16 lg:px-24 py-40 flex flex-col items-center text-center gap-8"
      >
        <h2 data-reveal className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-gold-gradient leading-[0.85] max-w-2xl">
          <BlurText text="Your best night out is one tap away." delay={100} />
        </h2>

        <p data-reveal className="text-white/60 font-body font-light text-sm md:text-base max-w-md leading-relaxed">
          Join thousands of people who never wait in line. Book your table tonight.
        </p>

        <div data-reveal className="flex items-center gap-4 flex-wrap justify-center">
          <RippleButton
            href="#"
            className="liquid-glass-strong rounded-full px-6 py-3 flex items-center gap-2 text-white text-sm font-body font-medium hover:text-[#D4AF37] transition-colors"
          >
            <span ref={bookBtnRef as React.Ref<HTMLSpanElement>} className="flex items-center gap-2">
              Book a Table
              <ArrowUpRight size={16} />
            </span>
          </RippleButton>
          <RippleButton
            href="#"
            className="bg-gold-gradient text-black rounded-full px-6 py-3 text-sm font-body font-medium hover:opacity-90 transition-opacity"
          >
            <span ref={viewBtnRef as React.Ref<HTMLSpanElement>}>
              View Venues
            </span>
          </RippleButton>
        </div>

        {/* Footer bar */}
        <div className="mt-32 pt-8 border-t border-white/10 w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="/logo.png" alt="Entrava" className="h-20 w-auto opacity-90" />
          <p className="text-white/40 text-xs font-body">
            © 2026 ENTRAVA. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                ref={(el) => { if (el) footerLinksRef.current[i] = el }}
                className="relative text-white/40 text-xs font-body hover:text-white/60 transition-colors"
              >
                {link.label}
                <span
                  className="link-underline absolute bottom-0 left-0 right-0 h-px bg-white/40 origin-left"
                  style={{ transform: 'scaleX(0)' }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
