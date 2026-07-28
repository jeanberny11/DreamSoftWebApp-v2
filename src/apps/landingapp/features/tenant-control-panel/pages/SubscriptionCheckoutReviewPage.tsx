// SubscriptionCheckoutReviewPage.tsx — Order summary / confirmation before
// redirecting to Stripe's hosted checkout.
// Rebuilt from Stitch design "Review & Checkout | DreamSoft".
//
// Fully independent of the New Subscription picker: builds itself entirely
// from ?planId=&planPriceId= URL query params via useCheckoutReview(), which
// wraps its own checkout-review.store.ts. Reachable directly from anywhere
// (not just the picker) — if the params are missing/malformed, or the
// planPriceId doesn't actually belong to the resolved plan, this page
// redirects back to the picker (/account/subscriptions/new).

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguageStore } from "@/shared/store/language.store";
import { useCheckoutReview } from "../hooks/useCheckoutReview";
import { getFeatureIcon } from "@/apps/landingapp/features/home/utils/featureIconMap";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import "../styles/subscriptions.css";
import "../styles/checkout-review.css";

export function SubscriptionCheckoutReviewPage() {
  const { t } = useTranslation("subscriptions");
  const navigate = useNavigate();
  const langCode = useLanguageStore((s) => s.currentLanguage.code);

  const { paramsValid, priceResolved, planId, planPriceId, price, detail, submitState, submit, fetchDetail } =
    useCheckoutReview();

  const [searchParams, setSearchParams] = useSearchParams();
  const [showCancelledNotice, setShowCancelledNotice] = useState(
    () => searchParams.get("checkout") === "cancelled",
  );

  // Strip the checkout flag from the URL once — the notice lives in memory,
  // so refreshing the page doesn't re-show it. planId/planPriceId are kept.
  useEffect(() => {
    if (searchParams.has("checkout")) {
      const next = new URLSearchParams(searchParams);
      next.delete("checkout");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect to the picker whenever the URL doesn't resolve to a real,
  // matching plan+price — covers missing params, malformed params, and a
  // planPriceId that doesn't belong to the resolved plan.
  useEffect(() => {
    if (!paramsValid) {
      navigate("/account/subscriptions/new", { replace: true });
      return;
    }
    if (detail.status === "success" && !priceResolved) {
      navigate("/account/subscriptions/new", { replace: true });
    }
  }, [paramsValid, detail.status, priceResolved, navigate]);

  if (!paramsValid) return null;

  if (detail.status === "idle" || detail.status === "loading") {
    return (
      <div className="tcp-checkout-loading">
        <div className="tcp-subs-spinner" role="status" aria-label={t("checkoutReview.loading")} />
        <p>{t("checkoutReview.loading")}</p>
      </div>
    );
  }

  if (detail.status === "error") {
    return (
      <div className="tcp-subs-error">
        <span className="material-symbols-outlined tcp-checkout-error-icon">
          error
        </span>
        <p className="tcp-subs-error__title">{t("checkoutReview.errorTitle")}</p>
        <p>{detail.message || t("checkoutReview.errorMessage")}</p>
        <button
          type="button"
          className="tcp-subs-error__retry"
          onClick={() => fetchDetail(planId!, langCode.toUpperCase())}
        >
          {t("checkoutReview.retry")}
        </button>
      </div>
    );
  }

  if (!price) return null; // redirect effect will fire; avoid a flash of broken content

  const plan = detail.data;
  const hasTrial = plan.trialDays > 0;

  let trialEndDate: string | null = null;
  if (hasTrial) {
    const end = new Date();
    end.setDate(end.getDate() + plan.trialDays);
    trialEndDate = end.toISOString();
  }

  const dueToday = hasTrial ? 0 : price.price;
  const isSubmitting = submitState.status === "submitting";

  return (
    <div className="tcp-checkout-page">
      {/* Step indicator */}
      <nav className="tcp-checkout-steps">
        <span className="tcp-checkout-step tcp-checkout-step--completed">
          <span className="material-symbols-outlined">check_circle</span>
          {t("checkoutReview.stepSelect")}
        </span>
        <span className="tcp-checkout-step__line" />
        <span className="tcp-checkout-step tcp-checkout-step--active">
          <span className="tcp-checkout-step__dot">2</span>
          {t("checkoutReview.stepReview")}
        </span>
      </nav>

      {/* Header */}
      <div className="tcp-checkout-header">
        <h1 className="tcp-checkout-header__title">{t("checkoutReview.title")}</h1>
        <p className="tcp-checkout-header__subtitle">{t("checkoutReview.subtitle")}</p>
        <button
          type="button"
          className="tcp-checkout-back-link"
          onClick={() => navigate("/account/subscriptions/new")}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          {t("checkoutReview.backLink")}
        </button>
      </div>

      {/* Returned-from-Stripe cancelled notice */}
      {showCancelledNotice && (
        <div className="tcp-checkout-cancelled-notice" role="status">
          <span className="material-symbols-outlined">info</span>
          <p>{t("checkoutReview.cancelledNotice")}</p>
          <button
            type="button"
            className="tcp-checkout-cancelled-notice__dismiss"
            onClick={() => setShowCancelledNotice(false)}
            aria-label={t("checkoutReview.cancelledDismiss")}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Main card */}
      <section className="tcp-checkout-card">
        <div className="tcp-checkout-card__header">
          <div className="tcp-checkout-card__icon">
            <FontAwesomeIcon icon={getFeatureIcon(plan.solutionIcon)} />
          </div>
          <div>
            <h2 className="tcp-checkout-card__solution-name">{plan.solutionName}</h2>
            <span className="tcp-checkout-card__plan-badge">{plan.planName}</span>
          </div>
        </div>

        <div className="tcp-checkout-card__items">
          <div className="tcp-checkout-card__item">
            <span className="tcp-checkout-card__item-label">{t("checkoutReview.planLabel")}</span>
            <span className="tcp-checkout-card__item-value">{plan.planName}</span>
          </div>
          <div className="tcp-checkout-card__item">
            <span className="tcp-checkout-card__item-label">{t("checkoutReview.billingCycleLabel")}</span>
            <span className="tcp-checkout-card__item-value">{price.billingCycle.name}</span>
          </div>
          <div className="tcp-checkout-card__item">
            <span className="tcp-checkout-card__item-label">{t("checkoutReview.priceLabel")}</span>
            <span className="tcp-checkout-card__item-value">{formatCurrency(price.price)}</span>
          </div>

          {hasTrial && (
            <div className="tcp-checkout-card__trial-box">
              <div className="tcp-checkout-card__trial-box-left">
                <span className="material-symbols-outlined">info</span>
                {t("checkoutReview.freeTrialLabel")}
              </div>
              <span className="tcp-checkout-card__trial-box-right">
                {t("checkoutReview.trialDetail", {
                  days: plan.trialDays,
                  date: formatDate(trialEndDate!),
                })}
              </span>
            </div>
          )}
        </div>

        <div className="tcp-checkout-card__total">
          <span className="tcp-checkout-card__total-label">{t("checkoutReview.dueTodayLabel")}</span>
          <span className="tcp-checkout-card__total-value">{formatCurrency(dueToday)}</span>
        </div>
      </section>

      {/* What's included */}
      {plan.limits.length > 0 && (
        <details className="tcp-checkout-accordion">
          <summary>
            {t("checkoutReview.whatsIncluded")}
            <span className="material-symbols-outlined tcp-checkout-accordion__chevron">expand_more</span>
          </summary>
          <div className="tcp-checkout-accordion__list">
            {plan.limits.map((limit) => (
              <div key={limit.planLimitId} className="tcp-checkout-accordion__item">
                <span className="material-symbols-outlined">check_circle</span>
                {limit.description}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* CTA & footer */}
      <section className="tcp-checkout-cta-section">
        <div className="tcp-checkout-cta-section__inner">
          {submitState.status === "error" && (
            <div className="tcp-checkout-submit-error">
              <span className="material-symbols-outlined">
                error
              </span>
              {submitState.message || t("checkoutReview.submitError")}
            </div>
          )}

          <button
            type="button"
            className="tcp-checkout-cta"
            disabled={isSubmitting}
            onClick={() => submit(planId!, planPriceId!)}
          >
            {isSubmitting ? (
              <>
                <span className="tcp-checkout-cta__spinner" />
                {t("checkoutReview.submitting")}
              </>
            ) : (
              <>
                {t("checkoutReview.continueToPayment")}
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="tcp-checkout-cancel-link"
            disabled={isSubmitting}
            onClick={() => navigate("/account/subscriptions/new")}
          >
            {t("checkoutReview.cancel")}
          </button>
        </div>

        <div className="tcp-checkout-trust-row">
          <div className="tcp-checkout-trust-row__item">
            <span className="material-symbols-outlined">lock</span>
            {t("checkoutReview.secureCheckout")}
          </div>
          <div className="tcp-checkout-trust-row__item tcp-checkout-trust-row__stripe">
            {t("checkoutReview.poweredByStripe")}
          </div>
        </div>

        <p className="tcp-checkout-footnote">{t("checkoutReview.footnote")}</p>
      </section>
    </div>
  );
}
