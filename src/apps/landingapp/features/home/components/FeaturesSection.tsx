// FeaturesSection — tabbed feature modules with grouped option grids, driven by the API

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMainFeatures } from '../hooks/useMainFeatures'
import { FeatureCard } from './FeatureCard'
import { getFeatureIcon, getGroupColor } from '../utils/featureIconMap'
import type { ModuleDto } from '@/apps/landingapp/common/types/catalog.types'
import "../styles/home_page.css"

interface FeaturePanelProps {
  module: ModuleDto
}

function FeaturePanel({ module }: FeaturePanelProps) {
  const color = getGroupColor(module.code)
  const sortedGroups = [...module.groups].sort((a, b) => a.sortOrder - b.sortOrder)
  return (
    <div className="feature-panel">
      <div className="feature-panel-header">
        <div className={`feature-panel-icon-wrap ${color.bg}`}>
          <FontAwesomeIcon icon={getFeatureIcon(module.icon)} className={`text-2xl ${color.text}`} />
        </div>
        <h3 className="feature-panel-title">{module.name}</h3>
        <p className="feature-panel-desc">{module.description}</p>
      </div>
      <div className="feature-panel-groups">
        {sortedGroups.map((group) => (
          <div key={group.menuGroupId} className="feature-group">
            <div className="feature-group-header">
              <div className={`feature-group-icon-wrap ${color.bg}`}>
                <FontAwesomeIcon icon={getFeatureIcon(group.icon)} className={`text-sm ${color.text}`} />
              </div>
              <h4 className="feature-group-title">{group.name}</h4>
            </div>
            <div className="feature-panel-grid">
              {[...group.options]
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((option) => (
                  <FeatureCard
                    key={option.menuOptionId}
                    title={option.name}
                    description={option.description}
                    icon={getFeatureIcon(option.icon)}
                    colorBg={color.bg}
                    colorText={color.text}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FeaturesSection() {
  const state = useMainFeatures()
  const { t } = useTranslation('landing')
  const [activeIndex, setActiveIndex] = useState(0)

  const features = state.status === 'success' ? state.data : []
  const sorted = [...features].sort((a, b) => a.sortOrder - b.sortOrder)
  const activeModule = sorted[activeIndex]

  return (
    <section id="features" className="features-section">
      <div className="section-container">
        <div className="section-header">
          <p className="section-eyebrow">{t('features.badge')}</p>
          <h2 className="section-title">{t('features.title')}</h2>
          <p className="section-subtitle">{t('features.subtitle')}</p>
        </div>

        {(state.status === 'idle' || state.status === 'loading') && (
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

        {state.status === 'error' && (
          <div className="section-error">
            <p className="section-error-text">{state.message}</p>
          </div>
        )}

        {state.status === 'success' && sorted.length > 0 && (
          <div>
            <div className="features-tabs" role="tablist">
              {sorted.map((module, index) => {
                const color = getGroupColor(module.code)
                const isActive = index === activeIndex
                return (
                  <button
                    key={module.code}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    id={`feature-tab-${module.code}`}
                    onClick={() => setActiveIndex(index)}
                    className={`feature-tab ${isActive ? color.tab : 'feature-tab--inactive'}`}
                  >
                    <FontAwesomeIcon icon={getFeatureIcon(module.icon)} className="text-xs" />
                    {module.name}
                  </button>
                )
              })}
            </div>

            {activeModule && (
              <div
                role="tabpanel"
                id="feature-panel"
                aria-labelledby={`feature-tab-${activeModule.code}`}
              >
                <FeaturePanel module={activeModule} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
