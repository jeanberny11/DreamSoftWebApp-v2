import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PricingFaqSection } from "../components/PricingFaqSection";
import "../styles/home_page.css";
import "../styles/pricing-page.css";
import { useTranslation } from "react-i18next";
import { usePricing } from "../hooks/usePricing";
import { useBillingCycles } from "../hooks/useBillingCycles";
import { PricingCard } from "../components/PricingCard";
import { useState } from "react";

export function PricingPage() {
  const { t } = useTranslation("landing");
  const state = usePricing();
  const billingCyclesState = useBillingCycles();
  const [activeSolution, setActiveSolution] = useState(0);
  const [billingCycle, setBillingCycle] = useState<string>("");

  const billingCycles =
    billingCyclesState.status === "success" ? billingCyclesState.data : [];

  const data = state.status === "success" ? state.data : [];
  const solutions = [...data].sort((a, b) =>
    a.code.localeCompare(b.code),
  );
  const activeSol = solutions[activeSolution];
  const plans = activeSol
    ? [...activeSol.plans].sort((a, b) => a.tierLevel - b.tierLevel)
    : [];
  console.log("Plans:", plans);
  const isPopular =
    plans.length > 0 ? Math.max(...plans.map((p) => p.tierLevel)) : 0;

  const seenLimitKeys = new Set<string>();
  const limitKeys = plans.flatMap((p) => p.limits).filter((l) => {
    if (seenLimitKeys.has(l.limitKey)) return false;
    seenLimitKeys.add(l.limitKey);
    return true;
  });
  function getLimitValue(planIdx: number, key: string): string {
    const limit = plans[planIdx]?.limits.find((l) => l.limitKey === key);
    if (!limit) return "N/A";
    return limit.limitValue === 0
      ? t("pricing.unlimited")
      : limit.limitValue.toLocaleString();
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main
        className="page-main"
        style={{ paddingTop: "var(--nav-topbar-height)" }}
      >
        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-badge">
                <span
                  className="material-symbols-outlined text-primary-600"
                  style={{ fontSize: 16 }}
                >
                  rocket_launch
                </span>
                <span className="hero-badge-text">{t("pricing.badge")}</span>
              </div>
              <h1 className="hero-title">{t("pricing.title")} </h1>
              <p className="hero-subtitle">{t("pricing.subtitle")}</p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="hero-btn-primary inline-flex items-center gap-2"
                  onClick={() =>
                    document
                      .querySelector("#pricing")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {t("solutionsPage.hero.ctaExploreSolutions")}
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20 }}
                  >
                    arrow_forward
                  </span>
                </button>
                <button type="button" className="hero-btn-secondary">
                  {t("solutionsPage.hero.ctaWatchDemo")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing Section ── */}
        <section id="pricing" className="pricing-section">
          <div className="section-container">
            {/* Loading State */}
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
            {/* Error State */}
            {state.status === "error" && (
              <div className="section-error">
                <p className="section-error-text">{state.message}</p>
              </div>
            )}
            {/* Success State */}
            {state.status === "success" && solutions.length > 0 && (
              <div className="space-y-8">
                <div className="pricing-sol-tabs" role="tablist">
                  {solutions.map((sol, index) => (
                    <button
                      key={sol.code}
                      type="button"
                      role="tab"
                      aria-selected={
                        index === activeSolution ? "true" : "false"
                      }
                      id={`solution-tab-${sol.code}`}
                      onClick={() => setActiveSolution(index)}
                      className={`pricing-sol-tab ${index === activeSolution ? "pricing-sol-tab--active" : "pricing-sol-tab--inactive"}`}
                    >
                      {sol.name}
                    </button>
                  ))}
                </div>
                <div className="billing-toggle-wrap">
                  <div className="billing-toggle">
                    {billingCycles.map((cycle) => (
                      <button
                        key={cycle.code}
                        type="button"
                        onClick={() => setBillingCycle(cycle.code)}
                        className={`billing-tab ${billingCycle === cycle.code ? "billing-tab--active" : ""}`}
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
                    aria-labelledby={`solution-tab-${activeSol.code}`}
                  >
                    {plans.map((plan) => (
                      <PricingCard
                        key={plan.code}
                        code={plan.code}
                        name={plan.name}
                        description={plan.description}
                        trialDays={plan.trialDays}
                        tierLevel={plan.tierLevel}
                        price={
                          plan.prices.find(
                            (p) => p.billingCycle.code === billingCycle,
                          ) || plan.prices[0]
                        }
                        limits={plan.limits}
                        isHighlighted={plan.tierLevel === isPopular}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        <section className="pricing-compare-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">{t("pricingComparison.title")}</h2>
            </div>

            <div className="pricing-compare-table-wrap">
              <table className="pricing-compare-table">
                <thead>
                  <tr>
                    <th className="pricing-compare-th pricing-compare-th--feature">
                      {t("pricingComparison.characteristicColumn")}
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.code}
                        className={`pricing-compare-th ${plan.tierLevel === isPopular ? "pricing-compare-th--popular" : ""}`}
                      >
                        {plan.name}
                        {plan.tierLevel === isPopular && (
                          <span className="pricing-compare-popular-badge">
                            {t("pricing.mostPopular")}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {limitKeys.map((key) => (
                    <tr key={key.limitKey} className="pricing-compare-row">
                      <td className="pricing-compare-td pricing-compare-td--feature">
                        {key.description}
                      </td>
                      {plans.map((plan, i) => (
                        <td
                          key={plan.code}
                          className={`pricing-compare-td ${plan.tierLevel === isPopular ? "pricing-compare-td--popular" : ""}`}
                        >
                          {getLimitValue(i, key.limitKey)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <PricingFaqSection />
      </main>
      <Footer />
    </div>
  );
}
