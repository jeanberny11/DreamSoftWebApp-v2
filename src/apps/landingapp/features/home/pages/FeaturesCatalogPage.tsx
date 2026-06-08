import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { useFeaturesCatalog } from '../hooks/useFeaturesCatalog'
import { getFeatureIcon } from '../utils/featureIconMap'
import type { FeatureCatalogGroup, FeatureCatalogOption } from '../types/home.types'
import '../styles/features-catalog.css'
import '../styles/home_page.css'

function sortBy<T extends { sortOrder: number }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function FeaturesCatalogPage() {
  const { t } = useTranslation('landing')
  const store = useFeaturesCatalog()
  const status = store.status
  const features = status === 'success' ? sortBy(store.data) : []
  const errorMessage = status === 'error' ? store.message : ''
  const firstModuleId = features[0]?.code

  useEffect(() => {
    if (status !== 'success') return
    const sections = document.querySelectorAll<HTMLElement>('.fc-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('fc-reveal--visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [status])

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main" style={{ paddingTop: 'var(--nav-topbar-height)' }}>

        {/* ── Hero ── */}
        <section className="hero fc-reveal">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="material-symbols-outlined text-primary-600" style={{ fontSize: 16 }}>category</span>
                <span className="hero-badge-text">{t('featuresCatalog.hero.badge')}</span>
              </div>
              <h1 className="hero-title">
                {t('featuresCatalog.hero.titlePart1')}{' '}
                <span className="hero-title-gradient">{t('featuresCatalog.hero.titleGradient')}</span>
              </h1>
              <p className="hero-subtitle">{t('featuresCatalog.hero.subtitle')}</p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="hero-btn-primary inline-flex items-center gap-2"
                  onClick={() =>
                    firstModuleId
                      ? document.getElementById(firstModuleId)?.scrollIntoView({ behavior: 'smooth' })
                      : undefined
                  }
                >
                  {t('featuresCatalog.hero.ctaPrimary')}
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
                </button>
                <button type="button" className="hero-btn-secondary">
                  {t('featuresCatalog.hero.ctaSecondary')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Loading ── */}
        {status === 'loading' && (
          <div className="fc-modules-section">
            <div className="section-container">
              <div className="fc-modules">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="fc-module">
                    <div className="fc-skeleton-header">
                      <div className="fc-skeleton fc-skeleton--icon" />
                      <div className="fc-skeleton fc-skeleton--title" />
                    </div>
                    <div className="fc-grid-auto">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="fc-skeleton fc-skeleton--card" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <div className="fc-modules-section">
            <div className="section-container">
              <div className="fc-error-wrap">
                <span className="material-symbols-outlined fc-error-icon">error_outline</span>
                <h2 className="fc-error-title">{t('featuresCatalog.errorTitle')}</h2>
                <p className="fc-error-message">{errorMessage}</p>
                <button type="button" className="fc-retry-btn" onClick={() => store.fetch()}>
                  {t('featuresCatalog.retry')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modules ── */}
        {status === 'success' && features.length > 0 && (
          <div className="fc-modules-section">
            <div className="section-container">
              <div className="fc-modules">
                {features.map((feature) => (
                  <section key={feature.code} className="fc-module fc-reveal" id={feature.code}>
                    <div className="fc-module__header">
                      <div className="fc-module__icon-wrap">
                        <FontAwesomeIcon icon={getFeatureIcon(feature.icon)} className="fc-module__icon" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="fc-module__title">{feature.name}</h3>
                        {feature.description && (
                          <p className="fc-module__desc">{feature.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="fc-grid-auto">
                      {sortBy(feature.groups).map((group: FeatureCatalogGroup) => (
                        <div key={group.code} className="fc-group">
                          <h4 className="fc-group__label">
                            <FontAwesomeIcon icon={getFeatureIcon(group.icon)} className="fc-group__label-icon" aria-hidden="true" />
                            {group.name}
                          </h4>
                          <div className="fc-group__card">
                            {sortBy(group.options).map((option: FeatureCatalogOption) => (
                              <div key={option.code} className="fc-item">
                                <FontAwesomeIcon icon={getFeatureIcon(option.icon)} className="fc-item__icon" aria-hidden="true" />
                                <div>
                                  <p className="fc-item__title">{option.name}</p>
                                  {option.description && (
                                    <p className="fc-item__desc">{option.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CTA dark section ── */}
        <div className="fc-cta fc-reveal">
          <div className="fc-cta__orb" />
          <div className="fc-cta__text">
            <h3 className="fc-cta__title">{t('featuresCatalog.cta.title')}</h3>
            <p className="fc-cta__subtitle">{t('featuresCatalog.cta.subtitle')}</p>
          </div>
          <div className="fc-cta__actions">
            <button type="button" className="fc-cta__btn-primary">
              {t('featuresCatalog.cta.primary')}
            </button>
            <button type="button" className="fc-cta__btn-secondary">
              {t('featuresCatalog.cta.secondary')}
            </button>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
