// PricingSection — solution tabs + billing cycle toggle + plan cards, driven by the API

import { useState } from 'react'
import { usePricing } from '../hooks/usePricing'
import { PricingCard } from './PricingCard'
import type { BillingCycleCode } from '../types/home.types'
import "../styles/home_page.css"

const billingCycles: { code: BillingCycleCode; label: string; badge?: string }[] = [
  { code: 'MONTHLY', label: 'Monthly' },
  { code: 'QUARTERLY', label: 'Quarterly', badge: 'Save 10%' },
  { code: 'ANNUAL', label: 'Annual', badge: 'Save 20%' },
]

export function PricingSection() {
  const { solutions, isLoading, error } = usePricing()
  const [activeSolution, setActiveSolution] = useState(0)
  const [billingCycle, setBillingCycle] = useState<BillingCycleCode>('MONTHLY')

  const sorted = [...solutions].sort((a, b) => a.solutionCode.localeCompare(b.solutionCode))
  const activeSol = sorted[activeSolution]

  return (
    <section id="pricing" className="pricing-section">
      <div className="section-container">
        <div className="section-header">
          <p className="section-eyebrow">Pricing</p>
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p className="section-subtitle">Start with a free trial. No credit card required.</p>
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
              <div className="pricing-sol-tabs">
                {sorted.map((sol, index) => (
                  <button
                    key={sol.solutionCode}
                    type="button"
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
              <div className="pricing-plans-grid">
                {[...activeSol.plans].sort((a, b) => a.tierLevel - b.tierLevel).map((plan) => {
                  const maxTier = Math.max(...activeSol.plans.map((p) => p.tierLevel))
                  const midTier = activeSol.plans.length > 1 ? Math.ceil(maxTier / activeSol.plans.length) + 1 : plan.tierLevel
                  return <PricingCard key={plan.code} plan={plan} billingCycle={billingCycle} isHighlighted={plan.tierLevel === midTier} />
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
