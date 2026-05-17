// SolutionsSection — industry/role-specific use cases, driven by the API

import { useTranslation } from 'react-i18next'
import { useSolutions } from '../hooks/useSolutions'
import "../styles/home_page.css"

const PLACEHOLDER_ICON = '🏢'

export function SolutionsSection() {
  const { solutions, isLoading, error } = useSolutions()
  const { t } = useTranslation('landing')
  return (
    <section id="solutions" className="solutions-section">
      <div className="section-container">
        <div className="section-header">
          <p className="section-eyebrow">{t('solutions.badge')}</p>
          <h2 className="section-title">{t('solutions.title')}</h2>
          <p className="section-subtitle">{t('solutions.subtitle')}</p>
        </div>

        {isLoading && (
          <div className="solutions-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="solutions-skeleton-card">
                <div className="solutions-skeleton-icon" />
                <div className="solutions-skeleton-title" />
                <div className="solutions-skeleton-text" />
              </div>
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="section-error">
            <p className="section-error-text">{error}</p>
          </div>
        )}

        {!isLoading && !error && solutions.length > 0 && (
          <div className="solutions-grid">
            {solutions.sort((a, b) => a.sortOrder - b.sortOrder).map((solution) => (
              <div key={solution.id} className="solution-card">
                <div className="solution-card-icon">{PLACEHOLDER_ICON}</div>
                <h3 className="solution-card-title">{solution.name}</h3>
                <p className="solution-card-desc">{solution.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
