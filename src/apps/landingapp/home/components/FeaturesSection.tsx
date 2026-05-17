// FeaturesSection — tabbed feature groups with module grid, driven by the API

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppFeatures } from '../hooks/useAppFeatures'
import { FeatureCard } from './FeatureCard'
import { getFeatureIcon, getGroupColor } from '../utils/featureIconMap'
import "../styles/home_page.css"

export function FeaturesSection() {
  const { features, isLoading, error } = useAppFeatures()
  const [activeIndex, setActiveIndex] = useState(0)

  const sorted = [...features].sort((a, b) => a.sortOrder - b.sortOrder)
  const activeGroup = sorted[activeIndex]

  return (
    <section id="features" className="features-section">
      <div className="section-container">
        <div className="section-header">
          <p className="section-eyebrow">Features</p>
          <h2 className="section-title">Everything you need to run your business</h2>
          <p className="section-subtitle">
            Powerful ERP capabilities built for modern teams — no complexity, no bloat.
          </p>
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
            <div className="features-tabs">
              {sorted.map((group, index) => {
                const color = getGroupColor(group.code)
                const isActive = index === activeIndex
                return (
                  <button
                    key={group.code}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`feature-tab ${isActive ? color.tab : 'feature-tab--inactive'}`}
                  >
                    <FontAwesomeIcon icon={getFeatureIcon(group.icon)} className="text-xs" />
                    {group.name}
                  </button>
                )
              })}
            </div>

            {activeGroup && (() => {
              const color = getGroupColor(activeGroup.code)
              const sortedModules = [...activeGroup.modules].sort((a, b) => a.sortOrder - b.sortOrder)
              return (
                <div className="feature-panel">
                  <div className="feature-panel-header">
                    <div className={`feature-panel-icon-wrap ${color.bg}`}>
                      <FontAwesomeIcon icon={getFeatureIcon(activeGroup.icon)} className={`text-2xl ${color.text}`} />
                    </div>
                    <h3 className="feature-panel-title">{activeGroup.name}</h3>
                    <p className="feature-panel-desc">{activeGroup.description}</p>
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
            })()}
          </div>
        )}
      </div>
    </section>
  )
}
