import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { CoreOfferingsSection } from '../components/CoreOfferingsSection'
import '../styles/home_page.css'

export function SolutionPage() {
  const { t } = useTranslation('landing')

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.sp-section')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('sp-section--visible')
        })
      },
      { threshold: 0.1 }
    )
    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main" style={{ paddingTop: 'var(--nav-topbar-height)' }}>

        {/* ── Hero ── */}
        <section className="sp-section hero">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="material-symbols-outlined text-primary-600" style={{ fontSize: 16 }}>rocket_launch</span>
                <span className="hero-badge-text">{t('solutionsPage.hero.badge')}</span>
              </div>
              <h1 className="hero-title">
                {t('solutionsPage.hero.headline1')}{' '}
                <span className="hero-title-gradient">{t('solutionsPage.hero.headline2')}</span>
              </h1>
              <p className="hero-subtitle">{t('solutionsPage.hero.subtext')}</p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="hero-btn-primary inline-flex items-center gap-2"
                  onClick={() => document.querySelector('#core-offerings')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('solutionsPage.hero.ctaExploreSolutions')}
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
                </button>
                <button type="button" className="hero-btn-secondary">
                  {t('solutionsPage.hero.ctaWatchDemo')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Core Offerings ── */}
        <CoreOfferingsSection />

        {/* ── CTA ── */}
        <section className="sp-section sp-cta-section">
          <div className="sp-cta-container">
            <div className="sp-cta-card">
              <div className="sp-cta-content">
                <h2 className="sp-cta-title">{t('solutionsPage.cta.title')}</h2>
                <p className="sp-cta-subtitle">{t('solutionsPage.cta.subtitle')}</p>
                <div className="sp-cta-actions">
                  <Link to="/register" className="sp-cta-btn-primary">
                    {t('solutionsPage.cta.ctaPrimary')}
                  </Link>
                  <button type="button" className="sp-cta-btn-outline">
                    {t('solutionsPage.cta.ctaSecondary')}
                  </button>
                </div>
              </div>
              <div className="sp-cta-deco" aria-hidden="true">
                <div className="sp-cta-deco-circle sp-cta-deco-circle--tl" />
                <div className="sp-cta-deco-circle sp-cta-deco-circle--br" />
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
