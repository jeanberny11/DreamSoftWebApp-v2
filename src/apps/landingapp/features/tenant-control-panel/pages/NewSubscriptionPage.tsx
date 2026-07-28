// NewSubscriptionPage.tsx — Browse & pick a plan to add a new subscription
// Rebuilt from Stitch design "Add New Subscription - Plan Picker".
//
// Reachable from SubscriptionsSection's "Add New Subscription" button and
// other entry points wired to /account/subscriptions/new. Uses
// useNewSubscriptions() to compose the pricing catalog (new-subscription
// store) with the tenant's existing subscriptions (subscriptions store), and
// getPlanAction() to decide per-card whether a plan should read as
// Select / Manage (current plan) / Switch (different plan, same solution).
//
// NOTE: unlike the previous build, solutions the tenant already owns are no
// longer filtered out of the tab list — they now stay visible so the tenant
// can see their current plan (Manage) and other tiers (Switch) alongside
// solutions they don't own yet (Select). Hands off to
// SubscriptionCheckoutReviewPage once that page exists.

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguageStore } from "@/shared/store/language.store";
import { useNewSubscriptions } from "../hooks/useNewSubscriptions";
import { getFeatureIcon } from "@/apps/landingapp/features/home/utils/featureIconMap";
import { NewSubscriptionPlanCard } from "../components/NewSubscriptionPlanCard";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import type { BillingCycleDto } from "@/apps/landingapp/common/types/catalog.types";
import "../styles/subscriptions.css";
import "../styles/new-subscription.css";

export function NewSubscriptionPage() {
  const { t } = useTranslation("subscriptions");
  const navigate = useNavigate();
  const langCode = useLanguageStore((s) => s.currentLanguage.code);

  const { store, subscriptions, getPlanAction } = useNewSubscriptions();

  const [activeSolutionIndex, setActiveSolutionIndex] = useState(0);
  const [billingCycleCode, setBillingCycleCode] = useState("");

  const solutions = store.state.status === "success" ? store.state.data : [];

  const billingCycles = useMemo(() => {
    const map = new Map<string, BillingCycleDto>();
    solutions.forEach((sol) =>
      sol.plans.forEach((plan) =>
        plan.prices.forEach((price) =>
          map.set(price.billingCycle.code, price.billingCycle),
        ),
      ),
    );
    return Array.from(map.values());
  }, [solutions]);

  const activeBillingCycleCode = billingCycleCode || billingCycles[0]?.code || "";
  const activeSolution = solutions[activeSolutionIndex] ?? solutions[0];

  const selection =
    store.state.status === "success"
      ? {
          solutionId: store.state.selectedSolutionId,
          planId: store.state.selectedPlanId,
          priceId: store.state.selectedPriceId,
        }
      : { solutionId: null, planId: null, priceId: null };

  const selectedPlanInfo = useMemo(() => {
    if (!selection.solutionId || !selection.planId || !selection.priceId) return null;
    const sol = solutions.find((s) => s.solutionId === selection.solutionId);
    const plan = sol?.plans.find((p) => p.planId === selection.planId);
    const price = plan?.prices.find((p) => p.planPriceId === selection.priceId);
    if (!plan || !price) return null;

    const hasTrial = plan.trialDays > 0;
    let trialEndDate: string | null = null;
    if (hasTrial) {
      const end = new Date();
      end.setDate(end.getDate() + plan.trialDays);
      trialEndDate = end.toISOString();
    }

    return {
      planName: plan.name,
      price: price.price,
      billingCycleName: price.billingCycle.name,
      hasTrial,
      trialEndDate,
    };
  }, [solutions, selection.solutionId, selection.planId, selection.priceId]);

  // Re-resolve the selected price when the billing cycle changes — if the
  // currently selected plan isn't offered in the new cycle, clear selection.
  useEffect(() => {
    if (store.state.status !== "success") return;
    if (!selection.solutionId || !selection.planId) return;

    const sol = solutions.find((s) => s.solutionId === selection.solutionId);
    const plan = sol?.plans.find((p) => p.planId === selection.planId);
    const newPrice = plan?.prices.find((p) => p.billingCycle.code === activeBillingCycleCode);

    if (newPrice) {
      if (newPrice.planPriceId !== selection.priceId) {
        store.onSelectedPriceChange(newPrice.planPriceId);
      }
    } else {
      store.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBillingCycleCode]);

  const handleSelectPlan = (solutionId: number, planId: number, planPriceId: number) => {
    store.onSelectedSolutionChange(solutionId);
    store.onSelectedPlanChange(planId);
    store.onSelectedPriceChange(planPriceId);
  };

  const isLoading =
    store.state.status === "idle" ||
    store.state.status === "loading" ||
    subscriptions.status === "idle" ||
    subscriptions.status === "loading";

  const hasError = store.state.status === "error" || subscriptions.status === "error";

  if (isLoading) {
    return (
      <div className="tcp-newsub-loading">
        <div className="tcp-subs-spinner" role="status" aria-label={t("newSubscription.loading")} />
        <p>{t("newSubscription.loading")}</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="tcp-subs-error">
        <span className="material-symbols-outlined tcp-newsub-error-icon">
          error
        </span>
        <p className="tcp-subs-error__title">{t("newSubscription.errorTitle")}</p>
        <button
          type="button"
          className="tcp-subs-error__retry"
          onClick={() => {
            store.fetchData(langCode.toUpperCase());
            subscriptions.fetchSubscriptions(langCode.toUpperCase());
          }}
        >
          {t("newSubscription.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className={`tcp-newsub-page ${selectedPlanInfo ? "tcp-newsub-page--with-bar" : ""}`}>
      {/* Step indicator */}
      <div className="tcp-newsub-steps">
        <span className="tcp-newsub-step tcp-newsub-step--active">
          <span className="tcp-newsub-step__dot">1</span>
          {t("newSubscription.stepSelect")}
        </span>
        <span className="tcp-newsub-step__line" />
        <span className="tcp-newsub-step">
          <span className="tcp-newsub-step__dot">2</span>
          {t("newSubscription.stepReview")}
        </span>
      </div>

      {/* Header */}
      <div className="tcp-newsub-header">
        <button type="button" className="tcp-newsub-back-link" onClick={() => navigate("/account/subscriptions")}>
          <span className="material-symbols-outlined">arrow_back</span>
          {t("newSubscription.backLink")}
        </button>
        <h1 className="tcp-newsub-header__title">{t("newSubscription.title")}</h1>
        <p className="tcp-newsub-header__subtitle">{t("newSubscription.subtitle")}</p>
      </div>

      {solutions.length === 0 ? (
        <div className="tcp-subs-empty">
          <div className="tcp-subs-empty__icon-wrap">
            <span className="material-symbols-outlined">layers_clear</span>
          </div>
          <h3 className="tcp-subs-empty__title">{t("newSubscription.noSolutionsTitle")}</h3>
          <p className="tcp-subs-empty__description">{t("newSubscription.noSolutionsDescription")}</p>
        </div>
      ) : (
        <>
          {/* Solution tabs */}
          <div className="tcp-newsub-label">{t("newSubscription.solutionsLabel")}</div>
          <div className="tcp-newsub-tabs-wrap">
            <div className="tcp-newsub-tabs" role="tablist">
              {solutions.map((sol, index) => (
                <button
                  key={sol.code}
                  type="button"
                  role="tab"
                  aria-selected={index === activeSolutionIndex}
                  className={`tcp-newsub-tab ${index === activeSolutionIndex ? "tcp-newsub-tab--active" : ""}`}
                  onClick={() => setActiveSolutionIndex(index)}
                >
                  <FontAwesomeIcon icon={getFeatureIcon(sol.icon)} />
                  {sol.name}
                </button>
              ))}
            </div>
          </div>

          {/* Billing cycle toggle */}
          {billingCycles.length > 1 && (
            <div className="tcp-newsub-billing-toggle">
              {billingCycles.map((cycle) => (
                <button
                  key={cycle.code}
                  type="button"
                  className={`tcp-newsub-billing-btn ${cycle.code === activeBillingCycleCode ? "tcp-newsub-billing-btn--active" : ""}`}
                  onClick={() => setBillingCycleCode(cycle.code)}
                >
                  {cycle.name}
                </button>
              ))}
            </div>
          )}

          {/* Plan grid */}
          {activeSolution && (
            <div className="tcp-newsub-grid">
              {(() => {
                const maxTier = Math.max(...activeSolution.plans.map((p) => p.tierLevel));
                return activeSolution.plans.map((plan) => (
                  <NewSubscriptionPlanCard
                    key={plan.planId}
                    plan={plan}
                    isPopular={plan.tierLevel === maxTier}
                    isSelected={plan.planId === selection.planId}
                    planAction={getPlanAction(activeSolution.solutionId, plan.planId, activeBillingCycleCode)}
                    billingCycleCode={activeBillingCycleCode}
                    solutionCode={activeSolution.code}
                    onSelect={(planId, planPriceId) =>
                      handleSelectPlan(activeSolution.solutionId, planId, planPriceId)
                    }
                  />
                ));
              })()}
            </div>
          )}

          {selectedPlanInfo && (
            <div className="tcp-newsub-selection-bar">
              <div className="tcp-newsub-selection-bar__inner">
                <div className="tcp-newsub-selection-bar__left">
                  <div className="tcp-newsub-selection-bar__icon">
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </div>
                  <div>
                    <p className="tcp-newsub-selection-bar__label">
                      {t("newSubscription.currentSelectionLabel")}
                    </p>
                    <p className="tcp-newsub-selection-bar__plan">
                      {t("newSubscription.selectionSummary", { plan: selectedPlanInfo.planName })}
                    </p>
                  </div>
                </div>
                <div className="tcp-newsub-selection-bar__right">
                  <div>
                    <p className="tcp-newsub-selection-bar__total-label">
                      {t("newSubscription.dueTodayLabel")}
                    </p>
                    <p className="tcp-newsub-selection-bar__total-value">
                      {formatCurrency(selectedPlanInfo.hasTrial ? 0 : selectedPlanInfo.price)}
                    </p>
                    <p className="tcp-newsub-selection-bar__total-note">
                      {selectedPlanInfo.hasTrial
                        ? t("newSubscription.thenBilledLabel", {
                            amount: formatCurrency(selectedPlanInfo.price),
                            cycle: selectedPlanInfo.billingCycleName,
                            date: formatDate(selectedPlanInfo.trialEndDate!),
                          })
                        : t("newSubscription.billedCycleLabel", {
                            cycle: selectedPlanInfo.billingCycleName,
                          })}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="tcp-newsub-selection-bar__cta"
                    onClick={() =>
                      navigate(
                        `/account/subscriptions/new/checkout?planId=${selection.planId}&planPriceId=${selection.priceId}`,
                      )
                    }
                  >
                    {t("newSubscription.goToCheckout")}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
