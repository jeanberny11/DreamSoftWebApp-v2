// FeaturesSection — tabbed feature groups with module grid, driven by the API

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppFeatures } from '../hooks/useAppFeatures'
import { FeatureCard } from './FeatureCard'
import { getFeatureIcon, getGroupColor } from '../utils/featureIconMap'
import type { AppFeature } from '../types/home.types'
import "../styles/home_page.css"

interface FeaturePanelProps {
  group: AppFeature
}

function FeaturePanel({ group }: FeaturePanelProps) {
  const color = getGroupColor(group.code)
  const sortedModules = [...group.options].sort((a, b) => a.sortOrder - b.sortOrder)
  return (
    <div className="feature-panel">
      <div className="feature-panel-header">
        <div className={`feature-panel-icon-wrap ${color.bg}`}>
          <FontAwesomeIcon icon={getFeatureIcon(group.icon)} className={`text-2xl ${color.text}`} />
        </div>
        <h3 className="feature-panel-title">{group.name}</h3>
        <p className="feature-panel-desc">{group.description}</p>
      </div>
      <div className="feature-panel-grid">
        {sortedModules.map((mod) => (
          <FeatureCard
            key={mod.code}
            title={mod.name}
            description={mod.description}
            icon={getFeatureIcon(mod.icon)}
            colorBg={color.bg}
            colorText={color.text}
          />
        ))}
      </div>
    </div>
  )
}

export function FeaturesSection() {
  const { features, isLoading, error } = useAppFeatures()
  const { t } = useTranslation('landing')
  const [activeIndex, setActiveIndex] = useState(0)

  const sorted = [...features].sort((a, b) => a.sortOrder - b.sortOrder)
  const activeGroup = sorted[activeIndex]

  return (
    <section id="features" className="features-section">
      <div className="section-container">
        <div className="section-header">
          <p className="section-eyebrow">{t('features.badge')}</p>
          <h2 className="section-title">{t('features.title')}</h2>
          <p className="section-subtitle">{t('features.subtitle')}</p>
        </div>

        {isLoading && (
          <div className="features-skeleton">
            <div className="features-skeleton-tabs">
              {[...Array(3)].map((_, i) => <div key={i} className="features-skeleton-tab" />)}
            </div>
            <div className="features-skeleton-panel">
              <div className="features-skeleton-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="features-skeleton-card">
                    <div className="features-skeleton-icon" />
                    <div className="features-skeleton-lines">
                      <div className="features-skeleton-line-title" />
                      <div className="features-skeleton-line-desc" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="section-error">
            <p className="section-error-text">{error}</p>
          </div>
        )}

        {!isLoading && !error && sorted.length > 0 && (
          <div>
            <div className="features-tabs" role="tablist">
              {sorted.map((group, index) => {
                const color = getGroupColor(group.code)
                const isActive = index === activeIndex
                return (
                  <button
                    key={group.code}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    id={`feature-tab-${group.code}`}
                    onClick={() => setActiveIndex(index)}
                    className={`feature-tab ${isActive ? color.tab : 'feature-tab--inactive'}`}
                  >
                    <FontAwesomeIcon icon={getFeatureIcon(group.icon)} className="text-xs" />
                    {group.name}
                  </button>
                )
              })}
            </div>

            {activeGroup && (
              <div
                role="tabpanel"
                id="feature-panel"
                aria-labelledby={`feature-tab-${activeGroup.code}`}
              >
                <FeaturePanel group={activeGroup} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
