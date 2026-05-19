// HomePage — single-page landing with smooth scroll sections

import { Navbar } from '../components/Navbar'
import { HeroSection } from '../components/HeroSection'
import { LogosSection } from '../components/LogosSection'
import { SolutionsSection } from '../components/SolutionsSection'
import { FeaturesSection } from '../components/FeaturesSection'
import { PricingSection } from '../components/PricingSection'
import { TestimonialsSection } from '../components/TestimonialsSection'
import { CtaSection } from '../components/CtaSection'
import { Footer } from '../components/Footer'
import "../styles/home_page.css"

export function HomePage() {
  return (
    <div className="page-shell">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <Navbar />

      {/* padding-top offsets the fixed navbar (var defined in navbar.css) */}
      <main id="main-content" className="page-main" style={{ paddingTop: 'var(--nav-topbar-height)' }}>
        <HeroSection />
        <SolutionsSection />
        <FeaturesSection />
        <PricingSection />
        <LogosSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
