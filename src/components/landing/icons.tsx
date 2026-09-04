/* Hand-rolled inline icons for the landing page.
   Deliberately not lucide: these ship inside a phone mock-up at 11-22px, where
   stroke weight and box size matter more than breadth of choice, and it keeps
   the landing page free of any icon-package version drift. */

type P = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const ArrowRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

export const ChevronLeft = (p: P) => (
  <svg {...base} {...p}>
    <path d="m15 5-7 7 7 7" />
  </svg>
)

export const Menu = (p: P) => (
  <svg {...base} {...p} strokeWidth={1.8}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
)

export const Close = (p: P) => (
  <svg {...base} {...p} strokeWidth={1.8}>
    <path d="M6 6 18 18" />
    <path d="M18 6 6 18" />
  </svg>
)

export const CalendarIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18" />
    <path d="M8 3v4M16 3v4" />
    <path d="M8 15h3" />
  </svg>
)

export const UserIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
)

export const UsersIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="9.5" cy="8" r="3.2" />
    <path d="M3 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16.5 5.2a3.2 3.2 0 0 1 0 5.9" />
    <path d="M18 14.4A6.5 6.5 0 0 1 21.5 20" />
  </svg>
)

export const HomeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 10.5 12 4l8 6.5V19a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 19z" />
  </svg>
)

export const TicketIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 9.5V7.6A1.6 1.6 0 0 1 4.6 6h14.8A1.6 1.6 0 0 1 21 7.6v1.9a2.5 2.5 0 0 0 0 5v1.9a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 16.4v-1.9a2.5 2.5 0 0 0 0-5Z" />
  </svg>
)

export const WalletIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2.6" />
    <path d="M3 10h18" />
    <circle cx="17" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

export const CardIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.4" />
    <path d="M2.5 10h19" />
    <path d="M6 14.6h4" />
  </svg>
)

export const CashIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="6.5" width="19" height="11" rx="2.2" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6 10v4M18 10v4" />
  </svg>
)

export const InfoIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </svg>
)

/* --- status-bar glyphs: solid, tiny, no strokes -------------------------- */

export const SignalIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <rect x="2" y="14.5" width="3.4" height="5.5" rx="1" />
    <rect x="7.6" y="11" width="3.4" height="9" rx="1" />
    <rect x="13.2" y="7.5" width="3.4" height="12.5" rx="1" />
    <rect x="18.8" y="4" width="3.4" height="16" rx="1" />
  </svg>
)

export const WifiIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" {...p}>
    <path d="M2.6 8.6a14 14 0 0 1 18.8 0" />
    <path d="M6.1 12.4a9 9 0 0 1 11.8 0" />
    <path d="M9.6 16.2a4 4 0 0 1 4.8 0" />
    <path d="M12 19.6h.01" />
  </svg>
)
