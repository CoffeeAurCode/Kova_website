import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import '../styles/editorial-pages.css'

const APP_STORE_URL = 'https://apps.apple.com/in/app/entrava-nightlife/id6789246261'

const navLinks = [
  { label: 'How it works', to: '/#lp-prebook' },
  { label: 'Why Entrava', to: '/why' },
  { label: 'For venues', to: '/promoters-venues' },
  { label: 'Contact', to: '/#lp-contact' },
]

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="ep-nav" data-scrolled={scrolled}>
      <Link className="ep-brand" to="/" aria-label="Entrava home">ENTRAVA</Link>

      <nav className="ep-nav-links" aria-label="Main navigation">
        {navLinks.map(({ label, to }) => (
          <Link key={label} to={to} data-active={location.pathname === to}>{label}</Link>
        ))}
      </nav>

      <a className="ep-download" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
        Download Entrava
        <ArrowRight aria-hidden="true" />
      </a>

      <button
        className="ep-menu-toggle"
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Menu />}
      </button>

      <div className="ep-mobile-menu" data-open={open}>
        {navLinks.map(({ label, to }) => (
          <Link key={label} to={to} onClick={() => setOpen(false)}>{label}</Link>
        ))}
        <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
          Download Entrava
          <ArrowRight aria-hidden="true" />
        </a>
      </div>
    </header>
  )
}
