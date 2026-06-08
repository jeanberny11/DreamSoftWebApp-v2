import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSolutions } from '../hooks/useSolutions'
import { getFeatureIcon } from '../utils/featureIconMap'

export function CoreOfferingsSection() {
  const { t } = useTranslation('landing')
  const state = useSolutions()

  return (
    <section id="core-offerings" className="features-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">{t('coreOfferings.title')}</h2>
          <p className="section-subtitle">{t('coreOfferings.subtitle')}</p>
        </div>

        {(state.status === 'idle' || state.status === 'loading') && (
          <div className="offerings-grid">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="offerings-skeleton-card">
                <div className="offerings-skeleton-icon" />
                <div className="offerings-skeleton-title" />
                <div className="offerings-skeleton-line" />
                <div className="offerings-skeleton-line offerings-skeleton-line--short" />
                <div className="offerings-skeleton-features">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="offerings-skeleton-feature" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {state.status === 'error' && (
          <div className="offerings-error">
            <p className="offerings-error-text">{state.message}</p>
          </div>
        )}

        {state.status === 'success' && (
          <div className="offerings-grid">
            {state.data.map((solution) => (
              <div key={solution.code} className="offering-card">
                <div className="offering-card-icon">
                  <FontAwesomeIcon icon={getFeatureIcon(solution.iconUrl)} aria-hidden="true" />
                </div>
                <h3 className="offering-card-title">{solution.name}</h3>
                <p className="offering-card-desc">{solution.description}</p>
                <ul className="offering-card-features">
                  {solution.features.slice(0, 3).map((feat) => (
                    <li key={feat.code} className="offering-card-feature">
                      <span className="material-symbols-outlined offering-card-feature-icon" aria-hidden="true">
                        check_circle
                      </span>
                      {feat.name}
                    </li>
                  ))}
                </ul>
                <Link to={`/solutions/${solution.code}`} className="offering-card-link">
                  {t('coreOfferings.learnMore')}
                  <span className="material-symbols-outlined offering-card-link-icon" aria-hidden="true">chevron_right</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
