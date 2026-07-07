// SubscriptionsSection — My Subscriptions view page (read-only)
//
// Fetches the tenant's subscriptions via subscriptions.store (Zustand) and
// renders either the empty state (no active subscriptions) or a list of
// subscription cards. Empty-state "Explore Solutions" / "View Pricing" buttons
// navigate to /solutions and /pricing respectively. "Manage Plan" /
// "View Invoices" / "Add New Subscription" remain inert for this pass —
// navigation will be wired up in a later session.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSubscriptionsStore } from "../stores/subscriptions.store";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import {
  getSubscriptionStatusVariant,
  SUBSCRIPTION_STATUS,
  type SubscriptionResponse,
} from "../types/subscriptions.types";
import "../styles/subscriptions.css";

export function SubscriptionsSection() {
  const { t } = useTranslation("subscriptions");
  const navigate = useNavigate();

  const subscriptionsState = useSubscriptionsStore((s) => s);

  useEffect(() => {
    if (subscriptionsState.status === "idle") {
      subscriptionsState.fetchSubscriptions();
    }
  }, [subscriptionsState]);

  if (
    subscriptionsState.status === "idle" ||
    subscriptionsState.status === "loading"
  ) {
    return (
      <div className="tcp-subs-loading">
        <div
          className="tcp-subs-spinner"
          role="status"
          aria-label={t("view.loading")}
        />
        <p>{t("view.loading")}</p>
      </div>
    );
  }

  if (subscriptionsState.status === "error") {
    return (
      <div className="tcp-subs-error">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 40, color: "var(--color-error-500)" }}
        >
          error
        </span>
        <p className="tcp-subs-error__title">{t("view.errorTitle")}</p>
        <p>{subscriptionsState.message || t("view.errorMessage")}</p>
        <button
          type="button"
          className="tcp-subs-error__retry"
          onClick={() => subscriptionsState.fetchSubscriptions()}
        >
          {t("view.retry")}
        </button>
      </div>
    );
  }

  const subscriptions = subscriptionsState.data;

  return (
    <div className="tcp-subs-page">
      {/* Page Header */}
      <div className="tcp-subs-header">
        <div>
          <h1 className="tcp-subs-header__title">{t("view.title")}</h1>
          <p className="tcp-subs-header__subtitle">{t("view.subtitle")}</p>
        </div>
        <button type="button" className="tcp-subs-add-btn">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            add
          </span>
          <span>{t("view.addButton")}</span>
        </button>
      </div>

      {subscriptions.length === 0 ? (
        <EmptyState
          t={t}
          onExplore={() => navigate("/solutions")}
          onViewPricing={() => navigate("/pricing")}
        />
      ) : (
        <>
          <h2 className="tcp-subs-section-heading">
            <span className="material-symbols-outlined">view_agenda</span>
            {t("view.activeSolutionsHeading")}
          </h2>
          <div className="tcp-subs-list">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                t={t}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({
  t,
  onExplore,
  onViewPricing,
}: {
  t: (key: string) => string;
  onExplore: () => void;
  onViewPricing: () => void;
}) {
  return (
    <div className="tcp-subs-empty">
      <div className="tcp-subs-empty__icon-wrap">
        <span className="material-symbols-outlined">layers_clear</span>
      </div>
      <h3 className="tcp-subs-empty__title">{t("view.empty.title")}</h3>
      <p className="tcp-subs-empty__description">
        {t("view.empty.description")}
      </p>
      <div className="tcp-subs-empty__actions">
        <button
          type="button"
          className="tcp-subs-empty__primary-btn"
          onClick={onExplore}
        >
          {t("view.empty.exploreButton")}
        </button>
        <button
          type="button"
          className="tcp-subs-empty__secondary-btn"
          onClick={onViewPricing}
        >
          {t("view.empty.pricingButton")}
        </button>
      </div>
    </div>
  );
}

// ── Subscription Card ────────────────────────────────────────────────────────

interface SubscriptionCardProps {
  subscription: SubscriptionResponse;
  t: (key: string, options?: Record<string, unknown>) => string;
}

function SubscriptionCard({ subscription, t }: SubscriptionCardProps) {
  const variant = getSubscriptionStatusVariant(subscription.statusCode);
  const isTrial = subscription.statusCode === SUBSCRIPTION_STATUS.TRIAL;

  const statusIcon =
    variant === "success"
      ? "check_circle"
      : variant === "info"
        ? null // trial uses a pulsing dot, not an icon, to match the Stitch design
        : variant === "warning"
          ? "warning"
          : variant === "error"
            ? "cancel"
            : "info";

  return (
    <div className="tcp-subs-card">
      {/* Status Badge */}
      <div className={`tcp-subs-card__status-badge tcp-subs-card__status-badge--${variant}`}>
        {statusIcon && (
          <span className="material-symbols-outlined">{statusIcon}</span>
        )}
        {subscription.statusName}
      </div>

      <div className="tcp-subs-card__body">
        {/* Icon */}
        <div className="tcp-subs-card__icon">
          <span className="material-symbols-outlined">
            {subscription.solutionIcon}
          </span>
        </div>

        <div className="tcp-subs-card__content">
          {/* Title row */}
          <div className="tcp-subs-card__title-row">
            <h3 className="tcp-subs-card__name">{subscription.solutionName}</h3>
            <span className="tcp-subs-card__code-badge">
              {subscription.solutionCode}
            </span>
          </div>

          <p className="tcp-subs-card__description">
            {subscription.subscriptionPlanDescription}
          </p>

          {subscription.notes && (
            <div className="tcp-subs-card__notes">
              <p className="tcp-subs-card__notes-text">{subscription.notes}</p>
            </div>
          )}

          {/* Stats grid */}
          <div className="tcp-subs-card__stats">
            <div>
              <p className="tcp-subs-stat__label">{t("view.card.planLabel")}</p>
              <p className="tcp-subs-stat__value">
                {subscription.subscriptionPlanName}
              </p>
            </div>
            <div>
              <p className="tcp-subs-stat__label">{t("view.card.costLabel")}</p>
              <p className="tcp-subs-stat__value tcp-subs-stat__value--price">
                {formatCurrency(subscription.price)}
                <span className="tcp-subs-stat__price-suffix">
                  {t("view.card.perCycleSuffix", {
                    cycle: subscription.billingCycleName,
                  })}
                </span>
              </p>
            </div>
            <div>
              <p className="tcp-subs-stat__label">{t("view.card.statusLabel")}</p>
              <span
                className={`tcp-subs-stat__status-row tcp-subs-stat__status-row--${variant}`}
              >
                <span
                  className={`tcp-subs-stat__status-dot ${isTrial ? "tcp-subs-stat__status-dot--pulse" : ""}`}
                />
                {subscription.statusName}
              </span>
            </div>
            <div>
              <p className="tcp-subs-stat__label">
                {t("view.card.subdomainLabel")}
              </p>
              <p className="tcp-subs-stat__value">{subscription.subdomain}</p>
            </div>
          </div>

          {/* Footer: dates + actions */}
          <div className="tcp-subs-card__footer">
            <div className="tcp-subs-card__dates">
              <div className="tcp-subs-card__date-item">
                <span className="material-symbols-outlined">calendar_today</span>
                {t("view.card.startedLabel", {
                  date: formatDate(subscription.startDate),
                })}
              </div>
              <div className="tcp-subs-card__date-item">
                <span className="material-symbols-outlined">event_busy</span>
                {isTrial
                  ? t("view.card.trialEndsLabel", {
                      date: formatDate(subscription.trialEndDate),
                    })
                  : t("view.card.endsLabel", {
                      date: formatDate(subscription.endDate),
                    })}
              </div>
            </div>
            <div className="tcp-subs-card__actions">
              <button type="button" className="tcp-subs-card__action-btn">
                {t("view.card.viewInvoices")}
              </button>
              <button
                type="button"
                className="tcp-subs-card__action-btn tcp-subs-card__action-btn--primary"
              >
                {t("view.card.managePlan")}
              </button>
              <button type="button" className="tcp-subs-card__more-btn">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
