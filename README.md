# Entrava — Website

Marketing site for **Entrava**, a nightlife discovery and table-booking app. Single-page React app, four routes, animation-heavy, deployed on Vercel.

**Live:** [www.entrava.app](https://www.entrava.app)

---

## Run it locally

Requires **Node 20.19+ or 22.12+** (Vite 8 will refuse to start below that) and npm.

```bash
git clone https://github.com/CoffeeAurCode/Kova_website.git
cd Kova_website
npm install
npm run dev
```

Dev server comes up on **http://localhost:5173** with HMR.

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server, hot reload |
| `npm run build` | `tsc -b` first, then `vite build` → `dist/`. A type error fails the build, so this is the real gate before deploy |
| `npm run preview` | Serves the built `dist/` locally — use this to check video loading and routing against production output |
| `npm run lint` | ESLint across the repo |

There is no `.env` file and no API calls. The site is fully static — nothing else to configure.

---

## Layout

```
src/
├── main.tsx              entry; imports lib/gsap first, mounts BrowserRouter
├── App.tsx               routes + the always-on cursor and scroll bar
├── lib/gsap.ts           the single GSAP setup point — read this before animating
├── pages/                one file per route
├── components/           section components (Hero, Stats, Testimonials, …)
│   ├── ui/               CustomCursor, RippleButton, ScrollProgressBar
│   └── landing/          Phone mockup + icon set, landing page only
├── hooks/                five animation hooks, all GSAP-backed
├── styles/               hand-written CSS for the landing page and phone screens
└── assets/               images imported by components
public/                   videos, logo, favicon, .well-known/ — served as-is
```

Path alias: `@` → `./src` (set in `vite.config.ts`).

---

## Pages

| Route | File | Notes |
| --- | --- | --- |
| `/` | `pages/Landing.tsx` | The main page. ~690 lines, plus `styles/landing.css` (~1150 lines) |
| `/why` | `pages/WhyEntrava.tsx` | Positioning / pitch page |
| `/promoters-venues` | `pages/PromotersVenues.tsx` | The B2B side |
| `/features` | `pages/Features.tsx` | Largest page in the repo at ~1300 lines |

**One gotcha:** the landing page ships its own navigation to match the design comps, so `App.tsx` deliberately skips the shared `<Navbar />` when the path is `/`. If you add a route, it gets the shared navbar automatically; if you're wondering why `/` looks different, that's why.

---

## How the animation works

Everything GSAP goes through `src/lib/gsap.ts`. That module registers `ScrollTrigger` once, sets global defaults (`power3.out`, 1s), and re-exports both.

**Import from `../lib/gsap`, never from `gsap` directly.** Importing the package directly gives you an instance without ScrollTrigger registered, and the failure is silent — scroll animations just never fire.

`main.tsx` imports it as its very first line so registration happens before any component renders.

Five hooks wrap the common patterns, each returning a ref you attach to an element:

| Hook | Effect |
| --- | --- |
| `useGSAPScrollReveal` | Staggered fade-up of every `[data-reveal]` child as the container scrolls in |
| `useParallax` | Scrubbed `yPercent` drift against the parent element |
| `useCardTilt` | Perspective tilt following the mouse |
| `useMagneticButton` | Element pulls toward the cursor via `gsap.quickTo` |
| `useCounterAnimation` | Counts a number up; parses `"500+"`, `"50K+"`, `"4.9★"` and keeps the suffix |

The reveal and parallax hooks run inside `gsap.context()` and clean up on unmount — which matters, because React 19 StrictMode double-invokes effects in dev.

Alongside GSAP, **Motion** (`motion`) handles component-level enter/exit transitions. Roughly: GSAP owns anything tied to scroll position, Motion owns anything tied to mount and state.

---

## Styling

Tailwind **v4** through the `@tailwindcss/vite` plugin. There is no `tailwind.config.js` — the theme lives in the `@theme` block at the top of `src/index.css` (fonts, the HSL color scale, the gold gradient tokens). Add design tokens there.

Two CSS files are written by hand rather than in Tailwind, because they carry keyframes and layered gradients that don't express well as utilities:

- `styles/landing.css` — the whole landing page, class prefix `lp-`
- `styles/phone-screens.css` — the fake app UI rendered inside the phone mockup

Fonts (Instrument Serif, Barlow, Playfair Display, Montserrat, Italiana) load from Google Fonts in `index.html`.

---

## Media

Background videos are plain MP4s in `public/` and referenced by absolute path (`/herobackgroundvideo.mp4`), not imported. They're committed to the repo, so **keep an eye on file size** — these are the largest things here by a wide margin, and every one is downloaded by every visitor.

`components/HlsVideo.tsx` exists for `.m3u8` streams: it uses `hls.js` where supported and falls back to native HLS on Safari. It's the path to use if the videos ever move to a CDN with adaptive streaming.

All video is `autoPlay muted loop playsInline` — `muted` and `playsInline` are both required or mobile Safari won't autoplay.

---

## Deploy & deep links

Vercel, building `dist/` from `npm run build`.

`vercel.json` does exactly one thing: force `Content-Type: application/json` on `/.well-known/apple-app-site-association`. That file has no extension, so Vercel would otherwise serve it as plain text and iOS would ignore it.

The two association files in `public/.well-known/` make `/event/*` links open the native app instead of the browser:

- `apple-app-site-association` → app ID `DSHZ8LU3QK.com.entrava.kova`
- `assetlinks.json` → package `com.kova.app`

Note the bundle identifiers differ between the two platforms. If a deep link fails on one platform only, check that its identifier still matches what's shipping in the store.

---

## Conventions

- Components use default exports; hooks use named exports.
- Hooks are generic over the element type — `useCardTilt<HTMLDivElement>()` — so the returned ref types correctly.
- Section components live in `components/`, primitives in `components/ui/`, landing-only pieces in `components/landing/`.
- No test setup exists. `npm run build` and `npm run lint` are the only automated checks.
