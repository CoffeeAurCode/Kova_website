import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import CustomCursor from './components/ui/CustomCursor'
import ScrollProgressBar from './components/ui/ScrollProgressBar'
import Landing from './pages/Landing'
import WhyEntrava from './pages/WhyEntrava'
import PromotersVenues from './pages/PromotersVenues'
import Features from './pages/Features'
import LegalPage from './pages/LegalPage'

export default function App() {
  /* The landing page ships its own nav, matching the design comps. Rendering
     the shared Navbar on top of it would give "/" two navigations. */
  const location = useLocation()
  const isLanding = location.pathname === '/'

  useEffect(() => {
    if (location.pathname !== '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [location.pathname])

  return (
    <div className="bg-black min-h-screen">
      <CustomCursor />
      <ScrollProgressBar />
      {!isLanding && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/why" element={<WhyEntrava />} />
        <Route path="/promoters-venues" element={<PromotersVenues />} />
        <Route path="/features" element={<Features />} />
        <Route path="/privacy" element={<LegalPage kind="privacy" />} />
        <Route path="/terms" element={<LegalPage kind="terms" />} />
        <Route path="/refund-policy" element={<LegalPage kind="refund" />} />
        <Route path="/service-delivery" element={<LegalPage kind="service" />} />
      </Routes>
    </div>
  )
}
