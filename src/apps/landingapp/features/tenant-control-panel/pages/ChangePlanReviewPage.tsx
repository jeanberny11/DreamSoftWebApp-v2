// ChangePlanReviewPage.tsx — Confirm Plan Change: real Stripe proration
// preview before committing a plan switch.
// Built from Stitch design "Confirm Plan Change | TenantPortal", translated
// to the tcp- design system. Route:
// /account/subscriptions/change-plan/review?planPriceId=
//
// Fully self-contained (like SubscriptionCheckoutReviewPage): the backend
// resolves the tenant's CURRENT subscription for the target solution —
// no dependency on the picker's catalog store. Re-previews whenever the
// proration timing toggle changes.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useChangePlanReview } from "../hooks/useChangePlanReview";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import "../styles/subscriptions.css";
import "../styles/checkout-review.css";
import "../styles/change-plan-review.css";

export function ChangePlanReviewPage() {
  const { t } = useTranslation("subscriptions");
  const navigate = useNavigate();

  const {
    paramsValid,
    preview,
    prorationImmediate,
    setProrationImmediate,
    submitState,
    confirm,
    refetch,
  } = useChangePlanReview();

  useEffect(() => {
    if (!paramsValid) {
      navigate("/account/subscriptions/new", { replace: true });
    }
  }, [paramsValid, navigate]);

  useEffect(() => {
    if (submitState.status === "success") {
      navigate("/account/subscriptions", { replace: true });
    }
  }, [submitState.status, navigate]);

  if (!paramsValid) return null;

  if (preview.status === "idle" || preview.status === "loading") {
    return (
      <div className="tcp-checkout-loading">
        <div className="tcp-subs-spinner" role="status" aria-label={t("changePlanReview.loading")} />
        <p>{t("changePlanReview.loading")}</p>
      </div>
    );
  }

  if (preview.status === "error") {
    return (
      <div className="tcp-subs-error">
        <span className="material-symbols-outlined tcp-changeplan-error-icon">error</span>
        <p className="tcp-subs-error__title">{t("changePlanReview.errorTitle")}</p>
        <p>{preview.message || t("changePlanReview.errorMessage")}</p>
        <button type="button" className="tcp-subs-error__retry" onClick={refetch}>
          {t("changePlanReview.retry")}
        </button>
      </div>
    );
  }

  const data = preview.data;
  const isSubmitting = submitState.status === "submitting";

  return (
    <div className="tcp-changeplan-page">
      {/* Step indicator */}
      <nav className="tcp-checkout-steps">
        <span className="tcp-checkout-step tcp-checkout-step--completed">
          <span className="material-symbols-outlined">check_circle</span>
          {t("changePlanReview.stepSelect")}
        </span>
        <span className="tcp-checkout-step__line" />
        <span className="tcp-checkout-step tcp-checkout-step--active">
          <span className="tcp-checkout-step__dot">2</span>
          {t("changePlanReview.stepReview")}
        </span>
      </nav>

      {/* Header */}
      <div className="tcp-checkout-header">
        <h1 className="tcp-checkout-header__title">{t("changePlanReview.title")}</h1>
        <p className="tcp-checkout-header__subtitle">{t("changePlanReview.subtitle")}</p>
        <button
          type="button"
          className="tcp-checkout-back-link"
          onClick={() => navigate("/account/subscriptions/new")}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          {t("changePlanReview.backLink")}
        </button>
      </div>

      {/* Plan comparison */}
      <section className="tcp-changeplan-comparison">
        <div className="tcp-changeplan-comparison__side">
          <span className="tcp-changeplan-comparison__label">{t("changePlanReview.currentLabel")}</span>
          <h3 className="tcp-changeplan-comparison__plan-name">{data.currentPlanName}</h3>
          <p className="tcp-changeplan-comparison__price">
            {formatCurrency(data.currentPrice)} / {data.currentBillingCycleName}
          </p>
        </div>
        <span className="material-symbols-outlined tcp-changeplan-comparison__arrow">arrow_forward</span>
        <div className="tcp-changeplan-comparison__side tcp-changeplan-comparison__side--new">
          <span className="tcp-changeplan-comparison__label tcp-changeplan-comparison__label--new">
            {t("changePlanReview.newLabel")}
          </span>
          <h3 className="tcp-changeplan-comparison__plan-name tcp-changeplan-comparison__plan-name--new">
            {data.newPlanName}
          </h3>
          <p className="tcp-changeplan-comparison__price tcp-changeplan-comparison__price--new">
            {formatCurrency(data.newPrice)} / {data.newBillingCycleName}
          </p>
        </div>
      </section>

      {/* Timing toggle */}
      <section className="tcp-changeplan-timing">
        <h4 className="tcp-changeplan-timing__heading">{t("changePlanReview.timingHeading")}</h4>
        <div className="tcp-changeplan-timing__options">
          <button
            type="button"
            className={`tcp-changeplan-timing-option ${prorationImmediate ? "tcp-changeplan-timing-option--selected" : ""}`}
            onClick={() => setProrationImmediate(true)}
            disabled={isSubmitting}
          >
            <span className="tcp-changeplan-timing-option__text">
              <span className="tcp-changeplan-timing-option__label">
                {t("changePlanReview.chargeNowLabel")}
              </span>
              <span className="tcp-changeplan-timing-option__description">
                {t("changePlanReview.chargeNowDescription")}
              </span>
            </span>
            <span className="material-symbols-outlined">
              {prorationImmediate ? "radio_button_checked" : "radio_button_unchecked"}
            </span>
          </button>
          <button
            type="button"
            className={`tcp-changeplan-timing-option ${!prorationImmediate ? "tcp-changeplan-timing-option--selected" : ""}`}
            onClick={() => setProrationImmediate(false)}
            disabled={isSubmitting}
          >
            <span className="tcp-changeplan-timing-option__text">
              <span className="tcp-changeplan-timing-option__label">
                {t("changePlanReview.nextCycleLabel")}
              </span>
              <span className="tcp-changeplan-timing-option__description">
                {t("changePlanReview.nextCycleDescription", { date: formatDate(data.nextBillingDate) })}
              </span>
            </span>
            <span className="material-symbols-outlined">
              {!prorationImmediate ? "radio_button_checked" : "radio_button_unchecked"}
            </span>
          </button>
        </div>
      </section>

      {/* Proration breakdown */}
      <section className="tcp-changeplan-breakdown">
        {prorationImmediate && (
          <>
            {data.creditAmount !== 0 && (
              <div className="tcp-changeplan-breakdown__line">
                <span>{t("changePlanReview.creditLine", { plan: data.currentPlanName })}</span>
                <span className="tcp-changeplan-breakdown__amount tcp-changeplan-breakdown__amount--credit">
                  {formatCurrency(data.creditAmount)}
                </span>
              </div>
            )}
            {data.chargeAmount !== 0 && (
              <div className="tcp-changeplan-breakdown__line">
                <span>{t("changePlanReview.chargeLine", { plan: data.newPlanName })}</span>
                <span className="tcp-changeplan-breakdown__amount">
                  {formatCurrency(data.chargeAmount)}
                </span>
              </div>
            )}
            <hr className="tcp-changeplan-breakdown__divider" />
          </>
        )}
        <div className="tcp-changeplan-breakdown__total">
          <div>
            <span className="tcp-changeplan-breakdown__total-label">
              {t("changePlanReview.dueTodayLabel")}
            </span>
            <p className="tcp-changeplan-breakdown__total-note">
              {t("changePlanReview.thenLabel", {
                amount: formatCurrency(data.nextBillingAmount),
                date: formatDate(data.nextBillingDate),
              })}
            </p>
          </div>
          <span className="tcp-changeplan-breakdown__total-value">
            {formatCurrency(data.amountDueNow)}
          </span>
        </div>
      </section>

      {/* Trial-preservation info box */}
      {data.hasActiveTrial && (
        <div className="tcp-changeplan-info-box">
          <span className="material-symbols-outlined">info</span>
          <p>{t("changePlanReview.trialPreserved", { date: formatDate(data.trialEndDate!) })}</p>
        </div>
      )}

      {submitState.status === "error" && (
        <p className="tcp-checkout-submit-error">
          <span className="material-symbols-outlined tcp-changeplan-inline-icon">error</span>
          {submitState.message || t("changePlanReview.submitError")}
        </p>
      )}

      {/* Footer */}
      <section className="tcp-changeplan-footer">
        <button type="button" className="tcp-checkout-cta" disabled={isSubmitting} onClick={confirm}>
          {isSubmitting ? (
            <>
              <span className="tcp-checkout-cta__spinner" />
              {t("changePlanReview.submitting")}
            </>
          ) : (
            <>
              {t("changePlanReview.confirmButton")}
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
          {t("changePlanReview.cancel")}
        </button>

        <div className="tcp-checkout-trust-row">
          <div className="tcp-checkout-trust-row__item">
            <span className="material-symbols-outlined">lock</span>
            {t("changePlanReview.secure")}
          </div>
          <div className="tcp-checkout-trust-row__item tcp-checkout-trust-row__stripe">
            {t("changePlanReview.poweredByStripe")}
          </div>
        </div>
      </section>
    </div>
  );
}
