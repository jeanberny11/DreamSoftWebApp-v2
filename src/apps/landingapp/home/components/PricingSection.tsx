// PricingSection — solution tabs + billing cycle toggle + plan cards, driven by the API

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePricing } from '../hooks/usePricing'
import { PricingCard } from './PricingCard'
import type { BillingCycleCode } from '../types/home.types'
import "../styles/home_page.css"

export function PricingSection() {
  const { solutions, isLoading, error } = usePricing()
  const { t } = useTranslation('landing')
  const [activeSolution, setActiveSolution] = useState(0)
  const [billingCycle, setBillingCycle] = useState<BillingCycleCode>('MONTHLY')

  const billingCycles = [
    { code: 'MONTHLY' as BillingCycleCode, label: t('pricing.billingCycles.monthly') },
    { code: 'QUARTERLY' as BillingCycleCode, label: t('pricing.billingCycles.quarterly'), badge: t('pricing.savings.quarterly') },
    { code: 'ANNUAL' as BillingCycleCode, label: t('pricing.billingCycles.annual'), badge: t('pricing.savings.annual') },
  ]

  const sorted = [...solutions].sort((a, b) => a.solutionCode.localeCompare(b.solutionCode))
  const activeSol = sorted[activeSolution]
  const sortedPlans = activeSol ? [...activeSol.plans].sort((a, b) => a.tierLevel - b.tierLevel) : []
  const maxTier = sortedPlans.length > 0 ? Math.max(...sortedPlans.map((p) => p.tierLevel)) : 0
  const midTier = sortedPlans.length > 1
    ? Math.ceil(maxTier / sortedPlans.length) + 1
    : sortedPlans[0]?.tierLevel

  return (
    <section id="pricing" className="pricing-section">
      <div className="section-container">
        <div className="section-header">
          <p className="section-eyebrow">{t('pricing.badge')}</p>
          <h2 className="section-title">{t('pricing.title')}</h2>
          <p className="section-subtitle">{t('pricing.subtitle')}</p>
        </div>

        {isLoading && (
          <div className="pricing-skeleton">
            <div className="pricing-skeleton-tabs">
              {[...Array(2)].map((_, i) => <div key={i} className="pricing-skeleton-tab" />)}
            </div>
            <div className="pricing-skeleton-grid">
              {[...Array(3)].map((_, i) => <div key={i} className="pricing-skeleton-card" />)}
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="section-error">
            <p className="section-error-text">{error}</p>
          </div>
        )}

        {!isLoading && !error && sorted.length > 0 && (
          <div className="space-y-8">
            {sorted.length > 1 && (
              <div className="pricing-sol-tabs" role="tablist">
                {sorted.map((sol, index) => (
                  <button
                    key={sol.solutionCode}
                    type="button"
                    role="tab"
                    aria-selected={index === activeSolution ? 'true' : 'false'}
                    id={`solution-tab-${sol.solutionCode}`}
                    onClick={() => setActiveSolution(index)}
                    className={`pricing-sol-tab ${index === activeSolution ? 'pricing-sol-tab--active' : 'pricing-sol-tab--inactive'}`}
                  >
                    {sol.solutionName}
                  </button>
                ))}
              </div>
            )}
            <div className="billing-toggle-wrap">
              <div className="billing-toggle">
                {billingCycles.map((cycle) => (
                  <button
                    key={cycle.code}
                    type="button"
                    onClick={() => setBillingCycle(cycle.code)}
                    className={`billing-tab ${billingCycle === cycle.code ? 'billing-tab--active' : ''}`}
                  >
                    {cycle.label}
                    {cycle.badge && <span className="billing-badge">{cycle.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
            {activeSol && (
              <div
                className="pricing-plans-grid"
                role="tabpanel"
                id="pricing-panel"
                aria-labelledby={`solution-tab-${activeSol.solutionCode}`}
              >
                {sortedPlans.map((plan) => (
                  <PricingCard key={plan.code} plan={plan} billingCycle={billingCycle} isHighlighted={plan.tierLevel === midTier} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
