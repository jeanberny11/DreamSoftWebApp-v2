// PricingCard — displays a single pricing plan with limits, trial, and billing price

import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faStar } from '@fortawesome/free-solid-svg-icons'
import type { PricingPlan, BillingCycleCode } from '../types/home.types'
import "../styles/home_page.css"

interface PricingCardProps {
  plan: PricingPlan
  billingCycle: BillingCycleCode
  isHighlighted: boolean
}

const limitLabels: Record<string, string> = {
  max_invoices_per_month: 'Invoices / month',
  max_products: 'Products',
  max_users: 'Users',
  max_warehouses: 'Warehouses',
}

function formatLimitValue(value: number): string {
  return value === 0 ? 'Unlimited' : value.toLocaleString()
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price)
}

const cycleLabel: Record<BillingCycleCode, string> = { MONTHLY: 'mo', QUARTERLY: 'qtr', ANNUAL: 'yr' }

export function PricingCard({ plan, billingCycle, isHighlighted }: PricingCardProps) {
  const priceEntry = plan.prices.find((p) => p.billingCycleCode === billingCycle)
  const price = priceEntry?.price ?? 0

  return (
    <div className={`pricing-card ${isHighlighted ? 'pricing-card--highlighted' : ''}`}>
      {isHighlighted && (
        <div className="pricing-card-popular-badge">
          <span className="pricing-card-popular-label">
            <FontAwesomeIcon icon={faStar} className="text-xs" />
            Most Popular
          </span>
        </div>
      )}
      <div>
        <h3 className="pricing-card-title">{plan.name}</h3>
        <p className="pricing-card-desc">{plan.description}</p>
      </div>
      <div className="pricing-card-price">
        <span className="pricing-card-price-amount">{formatPrice(price)}</span>
        <span className="pricing-card-price-cycle">/{cycleLabel[billingCycle]}</span>
      </div>
      <div className="pricing-card-trial">
        <span className="pricing-card-trial-badge">{plan.trialDays}-day free trial</span>
      </div>
      <div className="pricing-card-divider" />
      <ul className="pricing-card-features">
        {plan.limits.map((limit) => (
          <li key={limit.limitKey} className="pricing-card-feature">
            <div className="pricing-card-feature-left">
              <FontAwesomeIcon icon={faCheck} className="pricing-card-feature-icon" />
              <span className="pricing-card-feature-name">{limitLabels[limit.limitKey] ?? limit.description}</span>
            </div>
            <span className={`pricing-card-feature-value ${limit.limitValue === 0 ? 'pricing-card-feature-value--unlimited' : ''}`}>
              {formatLimitValue(limit.limitValue)}
            </span>
          </li>
        ))}
      </ul>
      <Link to="/register" className="pricing-card-cta">
        Start {plan.trialDays}-day trial
      </Link>
    </div>
  )
}
