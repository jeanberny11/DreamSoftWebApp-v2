import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useSolutionDetail } from "../hooks/useSolutionDetail";
import { getFeatureIcon } from "../utils/featureIconMap";
import type {
  SolutionDetailPlan,
  SolutionDetailOption,
  BillingCycle,
} from "../types/home.types";
import "../styles/home_page.css";
import "../styles/solution-detail.css";
import { useBillingCycles } from "../hooks/useBillingCycles";

interface FeatureColumn {
  moduleCode: string;
  moduleName: string;
  options: Array<{ option: SolutionDetailOption; isAvailable: boolean }>;
}

function buildFeatureColumns(
  sortedPlans: SolutionDetailPlan[],
  selectedPlan: SolutionDetailPlan | null,
): FeatureColumn[] {
  const selectedOptionCodes = new Set(
    selectedPlan?.options.map((o) => o.code) ?? [],
  );
  const moduleMap = new Map<
    string,
    {
      moduleName: string;
      options: Map<
        string,
        { option: SolutionDetailOption; isAvailable: boolean }
      >;
    }
  >();

  for (const plan of sortedPlans) {
    for (const option of plan.options) {
      if (!moduleMap.has(option.moduleCode)) {
        moduleMap.set(option.moduleCode, {
          moduleName: option.moduleName,
          options: new Map(),
        });
      }
      const module = moduleMap.get(option.moduleCode)!;
      if (!module.options.has(option.code)) {
        module.options.set(option.code, {
          option,
          isAvailable: selectedOptionCodes.has(option.code),
        });
      }
    }
  }

  return Array.from(moduleMap.entries()).map(
    ([moduleCode, { moduleName, options }]) => ({
      moduleCode,
      moduleName,
      options: Array.from(options.values()).sort(
        (a, b) => a.option.sortOrder - b.option.sortOrder,
      ),
    }),
  );
}

function formatLimitValue(value: number): string {
  return value === 0 ? "Unlimited" : value.toLocaleString();
}

export function SolutionDetailPage() {
  const { t } = useTranslation("landing");
  const { code } = useParams<{ code: string }>();
  const store = useSolutionDetail();
  const billingCyclesState = useBillingCycles();
  const status = store.status;
  const data = status === "success" ? store.data : null;
  const errorMessage = status === "error" ? store.message : "";
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle | null>(null);
  const [selectedPlanCode, setSelectedPlanCode] = useState<string | null>(null);

  const billingCycles =
    billingCyclesState.status === "success" ? billingCyclesState.data : [];
  const sortedPlans =
    data?.plans.sort((a, b) => a.tierLevel - b.tierLevel) ?? [];
  const popularPlan =
    sortedPlans.length > 0
      ? Math.max(...sortedPlans.map((p) => p.tierLevel))
      : 0;

  const selectedPlan =
    sortedPlans.find((p) => p.code === selectedPlanCode) ??
    sortedPlans[0] ??
    null;

  const isCustomPlan = selectedPlan
    ? !selectedPlan.prices.some((p) => p.price > 0)
    : false;
  const featureColumns = data
    ? buildFeatureColumns(sortedPlans, selectedPlan)
    : [];

  useEffect(() => {
    if (status !== "success") return;
    const sections = document.querySelectorAll<HTMLElement>(".sd-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.classList.add("sd-section--visible");
        });
      },
      { threshold: 0.1 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [status]);

  return (
    <div className="page-shell">
      <Navbar />
      <main
        className="page-main"
        style={{ paddingTop: "var(--nav-topbar-height)" }}
      >
        {/* ── Loading ── */}
        {status === "loading" && (
          <div className="sd-skeleton-wrap">
            <div className="sd-skeleton sd-skeleton--hero" />
            <div className="section-container">
              <div className="sd-skeleton-row">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="sd-skeleton sd-skeleton--card" />
                ))}
              </div>
              <div className="sd-skeleton-row">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="sd-skeleton sd-skeleton--card" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {status === "error" && (
          <div className="sd-error-wrap">
            <div className="sd-error-card">
              <i
                className="fa-solid fa-triangle-exclamation sd-error-icon"
                aria-hidden="true"
              />
              <h2 className="sd-error-title">
                {t("solutionDetail.errorTitle")}
              </h2>
              <p className="sd-error-message">
                {errorMessage || t("solutionDetail.errorMessage")}
              </p>
              {code && (
                <button
                  type="button"
                  className="sd-retry-btn"
                  onClick={() => store.fetch(code)}
                >
                  {t("solutionDetail.retry")}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {status === "success" && data && (
          <>
            {/* Hero */}
            <section className="sd-section hero">
              <div className="hero-inner">
                <div className="hero-content">
                  <div className="hero-badge">
                    <div className="sd-badge-icon">
                      <FontAwesomeIcon
                        icon={getFeatureIcon(data.iconUrl)}
                        className="sd-badge-icon"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="hero-badge-text">{data.code}</span>
                  </div>
                  <h1 className="hero-title">{data.name}</h1>
                  <p className="hero-subtitle">{data.description}</p>
                  <div className="hero-actions">
                    <Link
                      to="/register"
                      className="hero-btn-primary inline-flex items-center gap-2"
                    >
                      {t("solutionDetail.startTrial")}
                    </Link>
                    <button type="button" className="hero-btn-secondary">
                      {t("solutionDetail.viewDemo")}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Plans & Feature Hierarchy */}
            <section className="sd-section sd-plans-section">
              <div className="section-container">
                {/* Section header + billing toggle */}
                <div className="sd-plans-header">
                  <h2 className="section-title">
                    {t("solutionDetail.plansTitle")}
                  </h2>
                  <p className="sd-plans-subtitle">
                    {t("solutionDetail.plansSectionSubtitle")}
                  </p>
                  <div className="sd-billing-segment">
                    {billingCycles.map((cycle) => (
                      <button
                        key={cycle.code}
                        type="button"
                        className={`sd-segment-btn${selectedCycle === cycle ? " sd-segment-btn--active" : ""}`}
                        onClick={() => setSelectedCycle(cycle)}
                      >
                        {cycle.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plan cards */}
                <div className="sd-plan-cards-grid">
                  {sortedPlans.map((plan) => {
                    const priceEntry =plan.prices.find((p) => p.billingCycleCode === selectedCycle?.code) || plan.prices[0]
                    const isCustom = !priceEntry || priceEntry.price === 0;
                    const isSelected = plan.code === selectedPlan?.code;

                    return (
                      <button
                        key={plan.code}
                        type="button"
                        className={`sd-plan-card${isSelected ? " sd-plan-card--active" : ""}`}
                        onClick={() => setSelectedPlanCode(plan.code)}
                      >
                        {popularPlan && (
                          <div className="sd-popular-badge">
                            <span className="sd-popular-badge-label">
                              <FontAwesomeIcon
                                icon={faStar}
                                className="text-xs"
                              />
                              {t("solutionDetail.mostPopular")}
                            </span>
                          </div>
                        )}

                        <div className="sd-plan-card-body">
                          <h3 className="sd-plan-name">{plan.name}</h3>
                          <p className="sd-plan-desc">{plan.description}</p>
                          <div className="sd-plan-price-row">
                            {isCustom ? (
                              <span className="sd-plan-price">
                                {t("solutionDetail.customPrice")}
                              </span>
                            ) : (
                              <>
                                <span className="sd-plan-price">
                                  ${priceEntry.price}
                                </span>
                                <span className="sd-plan-price-cycle">
                                  {selectedCycle?.code === "ANNUAL"
                                    ? t("solutionDetail.perYear")
                                    : selectedCycle?.code === "QUARTERLY"
                                      ? t("solutionDetail.perQuarter")
                                      : t("solutionDetail.perMonth")}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {plan.limits.length > 0 && (
                          <>
                            <div className="sd-plan-divider" />
                            <div className="sd-plan-limits">
                              <p className="sd-plan-limits-label">
                                {t("solutionDetail.monthlyLimits")}
                              </p>
                              <ul className="sd-plan-limit-list">
                                {plan.limits.map((limit) => (
                                  <li
                                    key={limit.limitKey}
                                    className="sd-plan-limit-item"
                                  >
                                    <div className="sd-plan-limit-left">
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        className="sd-plan-limit-icon"
                                        aria-hidden="true"
                                      />
                                      <span className="sd-plan-limit-desc">
                                        {limit.description}
                                      </span>
                                    </div>
                                    <span
                                      className={`sd-plan-limit-value${limit.limitValue === 0 ? " sd-plan-limit-value--unlimited" : ""}`}
                                    >
                                      {formatLimitValue(limit.limitValue)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}

                        <div className="sd-plan-cta-btn">
                          {isSelected
                            ? t("solutionDetail.selected")
                            : t("solutionDetail.viewFeatures")}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Feature Detail Card */}
                {featureColumns.length > 0 && selectedPlan && (
                  <div className="sd-feature-detail-section">
                    <div className="sd-feature-detail-header">
                      <h3 className="sd-feature-detail-title">
                        {t("solutionDetail.featureDetailsTitle")}
                      </h3>
                      <p className="sd-feature-detail-subtitle">
                        {t("solutionDetail.featureDetailsFor")}{" "}
                        <span className="sd-feature-detail-plan-name">
                          {selectedPlan.name}
                        </span>
                      </p>
                    </div>

                    <div className="sd-feature-detail-card">
                      <div className="sd-feature-columns">
                        {featureColumns.map((col) => (
                          <div key={col.moduleCode}>
                            <div className="sd-feature-col-header">
                              <h4 className="sd-feature-col-title">
                                {col.moduleName}
                              </h4>
                            </div>
                            <ul className="sd-feature-col-list">
                              {col.options.map(({ option, isAvailable }) => (
                                <li
                                  key={option.code}
                                  className={`sd-feature-col-item${!isAvailable ? " sd-feature-col-item--locked" : ""}`}
                                >
                                  {isAvailable ? (
                                    <i
                                      className="fa-solid fa-circle-check sd-feature-col-check"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <i
                                      className="fa-solid fa-lock sd-feature-col-lock"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <FontAwesomeIcon
                                    icon={getFeatureIcon(option.iconUrl)}
                                    className="sd-feature-col-option-icon"
                                    aria-hidden="true"
                                  />
                                  <span className="sd-feature-col-text">
                                    {option.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="sd-detail-footer">
                        <div className="sd-detail-social">
                          <div
                            className="sd-mini-avatar-cluster"
                            aria-hidden="true"
                          >
                            <div className="sd-mini-avatar">JD</div>
                            <div className="sd-mini-avatar sd-mini-avatar--2">
                              AS
                            </div>
                            <div className="sd-mini-avatar sd-mini-avatar--3">
                              +5
                            </div>
                          </div>
                          <p className="sd-detail-footer-text">
                            {t("solutionDetail.socialProof.join", {
                              count: "5,000",
                            })}
                          </p>
                        </div>
                        {isCustomPlan ? (
                          <button type="button" className="sd-detail-cta-btn">
                            {t("solutionDetail.contactSales")}
                          </button>
                        ) : (
                          <Link to="/register" className="sd-detail-cta-btn">
                            {t("solutionDetail.startWith", {
                              plan: selectedPlan.name,
                            })}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Dark CTA */}
            <section className="sd-section sd-dark-cta-section">
              <div className="sd-dark-cta-inner">
                <div className="sd-dark-cta-card">
                  <div className="sd-dark-cta-glow" aria-hidden="true" />
                  <div className="sd-dark-cta-content">
                    <h2 className="sd-dark-cta-title">
                      {t("solutionDetail.ctaDark.title")}
                    </h2>
                    <p className="sd-dark-cta-subtitle">
                      {t("solutionDetail.ctaDark.subtitle")}
                    </p>
                    <Link to="/register" className="sd-dark-cta-btn">
                      {t("solutionDetail.ctaDark.button")}
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
