import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Phone from '../components/landing/Phone'
import { ArrowRight, CalendarIcon, Close, Menu, UserIcon } from '../components/landing/icons'
import '../styles/landing.css'

const APP_STORE_URL = 'https://apps.apple.com/in/app/entrava-nightlife/id6789246261'

/* ============================================================================
   THE MOTION MODEL
   ----------------------------------------------------------------------------
   One phone. Four scenes. Between every pair of scenes it follows the supplied
   frame sequence: portrait hold, pitched landscape swoop, a brief edge-on
   silhouette, then the next front-facing pose.

   Reading a pose:
     x, y   percent of viewport width / height, from centre
     s      scale multiplier (the responsive fit is applied on top)
     rx     screen-space tilt, degrees
     ry     turn around the phone's long axis, degrees
     rz     screen-space tumble, degrees
   ========================================================================== */

type Pose = { x: number; y: number; s: number; rx: number; ry: number; rz: number }

const DESK_REST: Pose[] = [
  { x: 25.5, y: -1.0, s: 1.0, rx: -3, ry: -16, rz: 5 },
  { x: -25.5, y: -1.0, s: 1.0, rx: -3, ry: 16, rz: -5 },
  { x: 25.5, y: -1.0, s: 1.0, rx: -3, ry: -16, rz: 5 },
  { x: 0, y: -1.5, s: 1.03, rx: 0, ry: 0, rz: 0 },
]

const MOB_REST: Pose[] = [
  { x: 8, y: 0, s: 1.0, rx: -2, ry: -14, rz: 4 },
  { x: -8, y: 0, s: 1.0, rx: -2, ry: 14, rz: -4 },
  { x: 8, y: 0, s: 1.0, rx: -2, ry: -14, rz: 4 },
  { x: 0, y: 0, s: 1.02, rx: 0, ry: 0, rz: 0 },
]

/* Fraction of each gap spent parked at a rest pose, so a scene reads as still
   while its copy is being read, and the travel feels like a decision. */
const HOLD = 0.18

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/* Interpolate a pose without forcing the browser to choose a rotational path. */
const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  s: lerp(a.s, b.s, t),
  rx: lerp(a.rx, b.rx, t),
  ry: lerp(a.ry, b.ry, t),
  rz: lerp(a.rz, b.rz, t),
})

const between = (a: Pose, b: Pose, t: number, start: number, end: number) =>
  mixPose(a, b, easeInOut(clamp((t - start) / (end - start), 0, 1)))

const topOf = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY

export default function Landing() {
  const navigate = useNavigate()

  const rootRef = useRef<HTMLDivElement>(null)
  const journeyRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const ghostRefs = useRef<(HTMLElement | null)[]>([])

  const [screen, setScreen] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  /* --- everything the rAF loop reads, kept off React state -------------- */
  const track = useRef({ ps: [0, 1 / 3, 2 / 3, 1], range: 1, jTop: 0 })
  const view = useRef({ vw: 0, vh: 0, mobile: false, fit: 1 })
  const pTarget = useRef(0)
  const pRender = useRef(0)
  const screenRef = useRef(0)
  const rafId = useRef(0)
  const tickRef = useRef<(time: number) => void>(() => undefined)
  const lastT = useRef(0)
  const reduced = useRef(false)

  /* ---------------------------------------------------------------------- */
  /* measure: viewport, responsive fit, and where each scene actually sits   */
  /* ---------------------------------------------------------------------- */
  const measure = useCallback(() => {
    const journey = journeyRef.current
    if (!journey) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const mobile = vw <= 900

    /* The painted footprint is bigger than the 300x618 shell: perspective and
       the resting tilt swell it, and the flip swings it wider still. Budget
       for that here rather than discovering it as a clipped phone. */
    const PW = 300 * 1.14
    const PH = 618 * 1.1

    let fit: number
    if (mobile) {
      /* Size the phone from whatever room the tallest copy block leaves. */
      let copyH = 0
      for (const el of rootRef.current?.querySelectorAll<HTMLElement>('.lp-copy') ?? [])
        copyH = Math.max(copyH, el.offsetHeight)
      const bandTop = (vh <= 720 ? 88 : 108) + copyH + 26
      const avail = Math.max(150, vh - bandTop - 16)
      /* The floor is low on purpose. Clamping UP to a "readable" size on a
         cramped 360x640 does not make the phone readable, it makes it clipped
         — and a clipped phone is the one failure this layout must never have. */
      fit = clamp(Math.min(avail / PH, (vw * 0.8) / PW), 0.24, 0.92)
      /* Park the phone in the middle of the room that is left. */
      const centreY = bandTop + avail / 2
      const yPct = ((centreY - vh / 2) / vh) * 100
      /* Scenes 0-2 sit under their copy; the finale has no copy above it — its
         cards get a viewport of their own below — so it stays centred. */
      for (let i = 0; i < 3; i++) MOB_REST[i].y = yPct
      MOB_REST[3].y = 0
    } else {
      fit = clamp(Math.min((vh - 130) / PH, (vw * 0.44) / PW, 1.06), 0.5, 1.06)
    }

    const jTop = topOf(journey)
    const range = Math.max(1, journey.offsetHeight - vh)
    const ps = sectionRefs.current.map((s) =>
      s ? clamp((topOf(s) - jTop) / range, 0, 1) : 0
    )

    view.current = { vw, vh, mobile, fit }
    track.current = { ps, range, jTop }
  }, [])

  /* ---------------------------------------------------------------------- */
  /* sample: scroll progress -> one pose + one screen index                  */
  /* ---------------------------------------------------------------------- */
  const sample = useCallback((p: number) => {
    const { ps } = track.current
    const { mobile } = view.current
    const REST = mobile ? MOB_REST : DESK_REST

    if (p <= ps[0]) return { pose: REST[0], scr: 0 }
    if (p >= ps[3]) return { pose: REST[3], scr: 3 }

    let i = 0
    while (i < 2 && p > ps[i + 1]) i++

    const span = Math.max(1e-6, ps[i + 1] - ps[i])
    const q = clamp((p - ps[i]) / span, 0, 1)
    const t = clamp((q - HOLD) / (1 - 2 * HOLD), 0, 1)

    const a = REST[i]
    const b = REST[i + 1]
    const direction = Math.sign(b.x - a.x) || (i % 2 === 0 ? -1 : 1)
    const lift = mobile ? -3.5 : -6.5
    const scaleDrop = mobile ? 0.075 : 0.06

    /* The supplied flip is not a full Y-axis spin. Its distinct beats are a
       landscape pitch, a narrow edge, and a front-facing recovery from the
       other side. Explicit waypoints preserve that silhouette and prevent a
       long, fake-looking view of the phone's back. */
    const landscape: Pose = {
      x: lerp(a.x, b.x, 0.32),
      y: lerp(a.y, b.y, 0.32) + lift,
      s: lerp(a.s, b.s, 0.32) - scaleDrop,
      rx: 66,
      ry: a.ry * 0.72,
      rz: -direction * (mobile ? 60 : 72),
    }
    const edge: Pose = {
      x: lerp(a.x, b.x, 0.55),
      y: lerp(a.y, b.y, 0.55) + lift * 0.8,
      s: lerp(a.s, b.s, 0.55) - scaleDrop * 1.15,
      rx: 7,
      ry: direction * 88,
      rz: -direction * 3,
    }
    const emerge: Pose = {
      x: lerp(a.x, b.x, 0.78),
      y: lerp(a.y, b.y, 0.78) + lift * 0.25,
      s: lerp(a.s, b.s, 0.78) - scaleDrop * 0.35,
      rx: -5,
      ry: b.ry * 1.45,
      rz: b.rz * 1.45,
    }

    let pose: Pose
    if (t < 0.36) pose = between(a, landscape, t, 0, 0.36)
    else if (t < 0.56) pose = between(landscape, edge, t, 0.36, 0.56)
    else if (t < 0.78) pose = between(edge, emerge, t, 0.56, 0.78)
    else pose = between(emerge, b, t, 0.78, 1)

    return {
      pose,
      /* Swap while the handset is only a metal sliver. */
      scr: t >= 0.56 ? i + 1 : i,
    }
  }, [])

  /* ---------------------------------------------------------------------- */
  /* render one frame                                                        */
  /* ---------------------------------------------------------------------- */
  const paint = useCallback(
    (p: number) => {
      const { pose, scr } = sample(p)
      const { vw, vh, fit, mobile } = view.current
      const { ps } = track.current

      if (sceneRef.current) {
        sceneRef.current.style.transform =
          `translate3d(${(pose.x * vw) / 100}px, ${(pose.y * vh) / 100}px, 0)` +
          ` scale(${pose.s * fit})`
      }
      if (phoneRef.current) {
        phoneRef.current.style.transform =
          `rotateZ(${pose.rz}deg) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg)`
      }
      /* Mobile finale: a phone and two stacked cards cannot share a viewport,
         so the cards get one of their own and the phone bows out. */
      let op = 1
      if (mobile && p > ps[3]) op = 1 - clamp((p - ps[3] - 0.02) / 0.1, 0, 1)
      if (sceneRef.current) sceneRef.current.style.opacity = String(op)

      /* The glow travels with the phone but lives outside the 3D scene, so it
         is driven separately — and it dims rather than flattens as the phone
         turns edge-on, because light is not a thing that can be seen side-on. */
      if (glowRef.current) {
        const face = Math.abs(Math.cos((pose.ry * Math.PI) / 180))
        glowRef.current.style.transform =
          `translate3d(${(pose.x * vw) / 100}px, ${(pose.y * vh) / 100}px, 0)` +
          ` scale(${(0.9 + 0.14 * face) * fit})`
        glowRef.current.style.opacity = String((0.42 + 0.58 * face) * op)
      }

      /* Ghost words drift against the scroll — cheap depth, one transform. */
      for (let i = 0; i < ghostRefs.current.length; i++) {
        const g = ghostRefs.current[i]
        if (!g) continue
        const d = clamp((p - ps[i]) * 3.2, -1.4, 1.4)
        g.style.transform = `translate(-50%, calc(-50% + ${(-d * 60).toFixed(2)}px))`
      }

      if (scr !== screenRef.current) {
        screenRef.current = scr
        setScreen(scr)
      }
    },
    [sample]
  )

  /* ---------------------------------------------------------------------- */
  /* the loop — scroll only ever writes a number; rAF does the work          */
  /* ---------------------------------------------------------------------- */
  const tick = useCallback(
    (t: number) => {
      const dt = Math.min(0.05, (t - lastT.current) / 1000 || 0.016)
      lastT.current = t

      const target = pTarget.current
      const diff = target - pRender.current

      if (Math.abs(diff) < 0.00004) {
        pRender.current = target
        paint(target)
        rafId.current = 0
        return
      }

      /* Frame-rate independent damping: the same feel at 60Hz and 120Hz. */
      pRender.current += diff * (1 - Math.exp(-dt * 9.5))
      paint(pRender.current)
      rafId.current = requestAnimationFrame(tickRef.current)
    },
    [paint]
  )

  const kick = useCallback(() => {
    if (!rafId.current) {
      lastT.current = performance.now()
      rafId.current = requestAnimationFrame(tick)
    }
  }, [tick])

  const onScroll = useCallback(() => {
    const { jTop, range } = track.current
    pTarget.current = clamp((window.scrollY - jTop) / range, 0, 1)
    setScrolled(window.scrollY > 40)

    if (reduced.current) {
      pRender.current = pTarget.current
      paint(pTarget.current)
      return
    }
    kick()
  }, [kick, paint])

  /* ---------------------------------------------------------------------- */
  useLayoutEffect(() => {
    tickRef.current = tick
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    measure()
    pTarget.current = pRender.current = clamp(
      (window.scrollY - track.current.jTop) / track.current.range,
      0,
      1
    )
    paint(pRender.current)

    let rt = 0
    const onResize = () => {
      window.clearTimeout(rt)
      rt = window.setTimeout(() => {
        measure()
        onScroll()
        paint(pRender.current)
      }, 120)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    /* Web fonts land after first paint and change every section's height, so
       the track has to be rebuilt once they do — otherwise the phone is in
       sync with a layout that no longer exists. */
    if (document.fonts?.ready) document.fonts.ready.then(onResize)

    return () => {
      window.clearTimeout(rt)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      if (rafId.current) cancelAnimationFrame(rafId.current)
      rafId.current = 0
    }
  }, [measure, onScroll, paint, tick])

  /* --- reveal copy as each section arrives ------------------------------ */
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll<HTMLElement>('[data-rv]')
    if (!els?.length) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) e.target.classList.add('lp-in')
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  /* --- lock the page behind the mobile drawer --------------------------- */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const goto = useCallback((id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const go = useCallback(
    (path: string) => {
      setMenuOpen(false)
      navigate(path)
    },
    [navigate]
  )

  const NAV = [
    { label: 'How it works', act: () => goto('lp-prebook') },
    { label: 'Why Entrava', act: () => go('/why') },
    { label: 'For venues', act: () => go('/promoters-venues') },
    { label: 'Contact', act: () => goto('lp-contact') },
  ]

  return (
    <div className="lp" ref={rootRef}>
      {/* ================= NAV ================= */}
      <header className="lp-nav" data-scrolled={scrolled}>
        <a
          className="lp-brand"
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          ENTRAVA
        </a>

        <nav className="lp-nav-links">
          {NAV.map((n) => (
            <button key={n.label} className="lp-nav-link" onClick={n.act}>
              {n.label}
            </button>
          ))}
        </nav>

        <span className="lp-nav-spacer" />

        <a
          className="lp-cta lp-cta--nav"
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="lp-cta-long">Download Entrava</span>
          <span className="lp-cta-short">Download</span>
          <ArrowRight />
        </a>

        <button
          className="lp-burger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <Close /> : <Menu />}
        </button>
      </header>

      <div className="lp-drawer" data-open={menuOpen}>
        {NAV.map((n) => (
          <button key={n.label} onClick={n.act}>
            {n.label}
          </button>
        ))}
        <a
          className="lp-cta"
          style={{ marginTop: 32, alignSelf: 'flex-start' }}
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Entrava
          <ArrowRight />
        </a>
      </div>

      {/* ================= JOURNEY ================= */}
      <div className="lp-journey" ref={journeyRef} id="top">
        {/*
          Sticky, and its own height cancelled by margin-bottom:-100svh, so it
          contributes nothing to flow. The four sections below stack normally
          and scroll past the one phone pinned here. Do not give this a real
          height and do not move the phone inside a section.
        */}
        <div className="lp-phone-layer">
          {/* Sibling of .lp-scene on purpose — see the note in landing.css. */}
          <div className="lp-glow" ref={glowRef} />
          <div className="lp-scene" ref={sceneRef}>
            <div className="lp-phone-rot" ref={phoneRef}>
              <Phone screen={screen} />
            </div>
          </div>
        </div>

        {/* ---- 01 · hero ---- */}
        <section
          className="lp-sec"
          data-copy="left"
          ref={(el) => {
            sectionRefs.current[0] = el
          }}
        >
          <div className="lp-sec-inner">
            <div className="lp-copy" data-rv>
              <div className="lp-eyebrow lp-rv">
                <span>Welcome to Entrava</span>
                <i />
              </div>
              <h1 className="lp-h1">
                <span className="lp-line"><span>Clubbing</span></span>
                <span className="lp-line"><span>Without</span></span>
                <span className="lp-line"><span>The Chaos.</span></span>
              </h1>
              <p className="lp-lead lp-rv lp-rv-2">
                Discover the best events in your city,
                <br />
                book in advance, and enter hassle-free.
              </p>
              <a
                className="lp-cta lp-rv lp-rv-3"
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Entrava
                <ArrowRight />
              </a>
            </div>
          </div>

          <div className="lp-cue">
            <i />
            <span>Scroll</span>
          </div>
        </section>

        {/* ---- 02 · pre-book ---- */}
        <section
          className="lp-sec"
          id="lp-prebook"
          data-copy="right"
          ref={(el) => {
            sectionRefs.current[1] = el
          }}
        >
          <span
            className="lp-ghost"
            aria-hidden="true"
            ref={(el) => {
              ghostRefs.current[1] = el
            }}
          >
            Pre-Book
          </span>

          <div className="lp-sec-inner">
            <div className="lp-copy" data-rv>
              <div className="lp-eyebrow lp-rv">
                <span>Step Two</span>
                <i />
              </div>
              <h2 className="lp-h1">
                <span className="lp-line"><span>Pre-Book</span></span>
                <span className="lp-line"><span>Your Spot.</span></span>
              </h2>
              <p className="lp-lead lp-rv lp-rv-2">
                Reserve your entry, and get your name
                <br />
                on the guest list before you reach the venue.
              </p>
              <p className="lp-kicker lp-rv lp-rv-3">Lock your entry</p>
              <p className="lp-kicker-body lp-rv lp-rv-4">
                Limited spots. Early access. No stress.
              </p>
            </div>
          </div>
        </section>

        {/* ---- 03 · pay ---- */}
        <section
          className="lp-sec"
          id="lp-pay"
          data-copy="left"
          ref={(el) => {
            sectionRefs.current[2] = el
          }}
        >
          <span
            className="lp-ghost"
            aria-hidden="true"
            ref={(el) => {
              ghostRefs.current[2] = el
            }}
          >
            Pay
          </span>

          <div className="lp-sec-inner">
            <div className="lp-copy" data-rv>
              <div className="lp-eyebrow lp-rv">
                <span>Step Three</span>
                <i />
              </div>
              <h2 className="lp-h1">
                <span className="lp-line"><span>Pay Online</span></span>
              </h2>
              <p className="lp-lead lp-rv lp-rv-2">
                No hassle of dealing with cash.
                <br />
                Pay online through any payment
                <br />
                method you&rsquo;d like.
              </p>
              <p className="lp-kicker lp-rv lp-rv-3">UPI · Card · Cash at the door</p>
              <p className="lp-kicker-body lp-rv lp-rv-4">
                Settled before you arrive. Nothing to sort out at the entrance.
              </p>
            </div>
          </div>
        </section>

        {/* ---- 04 · entry ---- */}
        <section
          className="lp-sec lp-sec-finale"
          id="lp-entry"
          ref={(el) => {
            sectionRefs.current[3] = el
          }}
        >
          <span
            className="lp-ghost"
            aria-hidden="true"
            ref={(el) => {
              ghostRefs.current[3] = el
            }}
          >
            Use Entrava
          </span>

          <div className="lp-sec-inner">
            <div className="lp-gates" data-rv>
              <article className="lp-gate lp-rv lp-rv-1">
                <div className="lp-gate-head">
                  <span className="lp-gate-icon"><CalendarIcon /></span>
                  <div>
                    <p className="lp-gate-tag">For venues and promoters</p>
                    <h3 className="lp-gate-title">I&rsquo;m Hosting</h3>
                  </div>
                </div>
                <p className="lp-gate-body">List your events on Entrava today</p>
                <button className="lp-gate-link" onClick={() => go('/promoters-venues')}>
                  Learn more
                  <i><ArrowRight /></i>
                </button>
              </article>

              <div className="lp-gate-gap" />

              <article className="lp-gate lp-rv lp-rv-2">
                <div className="lp-gate-head">
                  <span className="lp-gate-icon"><UserIcon /></span>
                  <div>
                    <p className="lp-gate-tag">For guests</p>
                    <h3 className="lp-gate-title">I&rsquo;m a Guest</h3>
                  </div>
                </div>
                <p className="lp-gate-body">Discover. Pre-Book. Enter, Seamlessly.</p>
                <button className="lp-gate-link" onClick={() => go('/why')}>
                  Why Entrava
                  <i><ArrowRight /></i>
                </button>
              </article>
            </div>
          </div>
        </section>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="lp-footer" id="lp-contact">
        <div className="lp-footer-inner">
          <div>
            <p className="lp-footer-mark">ENTRAVA</p>
            <p>
              Clubbing without the chaos.
              <br />
              Discover, pre-book and walk straight in.
            </p>
          </div>

          <div className="lp-footer-cols">
            <div className="lp-footer-col">
              <h4>Product</h4>
              <button onClick={() => goto('lp-prebook')}>How it works</button>
              <button onClick={() => go('/features')}>Features</button>
              <button onClick={() => go('/why')}>Why Entrava</button>
            </div>
            <div className="lp-footer-col">
              <h4>Venues</h4>
              <button onClick={() => go('/promoters-venues')}>List your events</button>
              <a href="mailto:entrava.app@gmail.com">Partner with us</a>
            </div>
            <div className="lp-footer-col">
              <h4>Get the app</h4>
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                App Store
              </a>
              <a href="mailto:entrava.app@gmail.com">Android — notify me</a>
            </div>
            <div className="lp-footer-col">
              <h4>Contact</h4>
              <a href="mailto:entrava.app@gmail.com">entrava.app@gmail.com</a>
              <a href="https://www.entrava.app" target="_blank" rel="noopener noreferrer">
                entrava.app
              </a>
            </div>
          </div>
        </div>

        <div className="lp-footer-base">
          <span>© {new Date().getFullYear()} Entrava Enterprises</span>
          <span>Mumbai, India</span>
        </div>
      </footer>
    </div>
  )
}
