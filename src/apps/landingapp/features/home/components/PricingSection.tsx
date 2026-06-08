// PricingSection — solution tabs + billing cycle toggle + plan cards, driven by the API

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePricing } from "../hooks/usePricing";
import { PricingCard } from "./PricingCard";
import type { BillingCycle } from "../types/home.types";
import "../styles/home_page.css";
import { useBillingCycles } from "../hooks/useBillingCycles";

export function PricingSection() {
  const state = usePricing();
  const billingCyclesState = useBillingCycles();
  const { t } = useTranslation("landing");
  const [activeSolution, setActiveSolution] = useState(0);
  const [billingCycle, setBillingCycle] = useState<BillingCycle | null>(null);

  const billingCycles =
    billingCyclesState.status === "success" ? billingCyclesState.data : [];

  const solutions = state.status === "success" ? state.data : [];
  const sorted = [...solutions].sort((a, b) =>
    a.solutionCode.localeCompare(b.solutionCode),
  );
  const activeSol = sorted[activeSolution];
  const sortedPlans = activeSol
    ? [...activeSol.plans].sort((a, b) => a.tierLevel - b.tierLevel)
    : [];
  const maxTier =
    sortedPlans.length > 0
      ? Math.max(...sortedPlans.map((p) => p.tierLevel))
      : 0;

  return (
    <section id="pricing" className="pricing-section">
      <div className="section-container">
        <div className="section-header">
          <p className="section-eyebrow">{t("pricing.badge")}</p>
          <h2 className="section-title">{t("pricing.title")}</h2>
          <p className="section-subtitle">{t("pricing.subtitle")}</p>
        </div>

        {(state.status === "idle" || state.status === "loading") && (
          <div className="pricing-skeleton">
            <div className="pricing-skeleton-tabs">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="pricing-skeleton-tab" />
              ))}
            </div>
            <div className="pricing-skeleton-grid">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="pricing-skeleton-card" />
              ))}
            </div>
          </div>
        )}

        {state.status === "error" && (
          <div className="section-error">
            <p className="section-error-text">{state.message}</p>
          </div>
        )}

        {state.status === "success" && sorted.length > 0 && (
          <div className="space-y-8">
            <div className="pricing-sol-tabs" role="tablist">
              {sorted.map((sol, index) => (
                <button
                  key={sol.solutionCode}
                  type="button"
                  role="tab"
                  aria-selected={index === activeSolution ? "true" : "false"}
                  id={`solution-tab-${sol.solutionCode}`}
                  onClick={() => setActiveSolution(index)}
                  className={`pricing-sol-tab ${index === activeSolution ? "pricing-sol-tab--active" : "pricing-sol-tab--inactive"}`}
                >
                  {sol.solutionName}
                </button>
              ))}
            </div>
            <div className="billing-toggle-wrap">
              <div className="billing-toggle">
                {billingCycles.map((cycle) => (
                  <button
                    key={cycle.code}
                    type="button"
                    onClick={() => setBillingCycle(cycle)}
                    className={`billing-tab ${billingCycle?.code === cycle.code ? "billing-tab--active" : ""}`}
                  >
                    {cycle.name}
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
                  <PricingCard
                    key={plan.code}
                    code={plan.code}
                    name={plan.name}
                    description={plan.description}
                    trialDays={plan.trialDays}
                    tierLevel={plan.tierLevel}
                    price={plan.prices.find((p) => p.billingCycle.code === billingCycle?.code) || plan.prices[0]}
                    limits={plan.limits}
                    isHighlighted={plan.tierLevel === maxTier}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
