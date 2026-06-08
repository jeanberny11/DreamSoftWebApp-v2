// PricingCard — displays a single pricing plan with limits, trial, and billing price

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { useLanguageStore } from "@/shared/store/language.store";
import { formatCurrency } from "@/shared/utils/formatters";
import type { PlanLimit, PlanPrice } from "../types/home.types";
import "../styles/home_page.css";

interface PricingCardProps {
  code: string;
  name: string;
  description: string;
  trialDays: number;
  tierLevel: number;
  price: PlanPrice;
  limits: PlanLimit[];
  isHighlighted: boolean;
}

function formatLimitValue(value: number): string {
  return value === 0 ? "Unlimited" : value.toLocaleString();
}

export function PricingCard({
  name,
  description,
  trialDays,
  price,
  limits,
  isHighlighted,
}: PricingCardProps) {
  const locale = useLanguageStore((s) => s.currentLanguage.code.toLowerCase());
  return (
    <div
      className={`pricing-card ${isHighlighted ? "pricing-card--highlighted" : ""}`}
    >
      {isHighlighted && (
        <div className="pricing-card-popular-badge">
          <span className="pricing-card-popular-label">
            <FontAwesomeIcon icon={faStar} className="text-xs" />
            Most Popular
          </span>
        </div>
      )}
      <div>
        <h3 className="pricing-card-title">{name}</h3>
        <p className="pricing-card-desc">{description}</p>
      </div>
      <div className="pricing-card-price">
        <span className="pricing-card-price-amount">
          {formatCurrency(price.price, "USD", locale)}
        </span>
        <span className="pricing-card-price-cycle">
          /{price.billingCycle.name}
        </span>
      </div>
      <div className="pricing-card-trial">
        <span className="pricing-card-trial-badge">
          {trialDays}-day free trial
        </span>
      </div>
      <div className="pricing-card-divider" />
      <ul className="pricing-card-features">
        {limits.map((limit) => (
          <li key={limit.limitKey} className="pricing-card-feature">
            <div className="pricing-card-feature-left">
              <FontAwesomeIcon
                icon={faCheck}
                className="pricing-card-feature-icon"
              />
              <span className="pricing-card-feature-name">
                {limit.description}
              </span>
            </div>
            <span
              className={`pricing-card-feature-value ${limit.limitValue === 0 ? "pricing-card-feature-value--unlimited" : ""}`}
            >
              {formatLimitValue(limit.limitValue)}
            </span>
          </li>
        ))}
      </ul>
      <Link to="/register" className="pricing-card-cta">
        Start {trialDays}-day trial
      </Link>
    </div>
  );
}
