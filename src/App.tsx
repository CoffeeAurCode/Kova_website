import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import CustomCursor from './components/ui/CustomCursor'
import ScrollProgressBar from './components/ui/ScrollProgressBar'
import Landing from './pages/Landing'
import WhyEntrava from './pages/WhyEntrava'
import PromotersVenues from './pages/PromotersVenues'
import Features from './pages/Features'

export default function App() {
  /* The landing page ships its own nav, matching the design comps. Rendering
     the shared Navbar on top of it would give "/" two navigations. */
  const isLanding = useLocation().pathname === '/'

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
      </Routes>
    </div>
  )
}
