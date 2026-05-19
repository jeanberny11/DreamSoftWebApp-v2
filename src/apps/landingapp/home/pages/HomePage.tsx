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
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher'
import "../styles/home_page.css"

export function HomePage() {
  return (
    <div className="page-shell">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <Navbar />

      {/* Language switcher — fixed below the navbar at the top-right corner */}
      <div className="lang-switcher-float">
        <LanguageSwitcher />
      </div>

      <main id="main-content" className="page-main">
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
