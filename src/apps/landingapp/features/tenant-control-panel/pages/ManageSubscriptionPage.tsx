// ManageSubscriptionPage — manage a single subscription (view details, and —
// in later phases — cancel/resume and change plan).
// Built from Stitch design "Manage Subscription | DreamSoft", translated to
// the tcp- design system. Route: /account/subscriptions/:subscriptionId/manage
// Data comes from the dedicated GET-by-id endpoint via useManageSubscription.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useManageSubscription } from "../hooks/useManageSubscription";
import { useResumeSubscription } from "../hooks/useResumeSubscription";
import { CancelSubscriptionModal } from "../components/CancelSubscriptionModal";
import { getFeatureIcon } from "@/apps/landingapp/features/home/utils/featureIconMap";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import {
  getSubscriptionStatusVariant,
  SUBSCRIPTION_STATUS,
} from "../types/subscriptions.types";
import "../styles/subscriptions.css";
import "../styles/checkout-review.css";
import "../styles/manage-subscription.css";

export function ManageSubscriptionPage() {
  const { t } = useTranslation("subscriptions");
  const navigate = useNavigate();
  const { status, subscription, refetch, errorMessage } = useManageSubscription();
  const { state: resumeState, resume } = useResumeSubscription();
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);

  if (status === "idle" || status === "loading") {
    return (
      <div className="tcp-subs-loading">
        <div className="tcp-subs-spinner" role="status" aria-label={t("manage.loading")} />
        <p>{t("manage.loading")}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="tcp-subs-error">
        <span className="material-symbols-outlined tcp-manage-error-icon">error</span>
        <p className="tcp-subs-error__title">{t("manage.errorTitle")}</p>
        <p>{errorMessage || t("manage.errorMessage")}</p>
        <button type="button" className="tcp-subs-error__retry" onClick={refetch}>
          {t("manage.retry")}
        </button>
      </div>
    );
  }

  if (!subscription) return null;

  const variant = getSubscriptionStatusVariant(subscription.statusCode);
  const isTrial = subscription.statusCode === SUBSCRIPTION_STATUS.TRIAL;
  const hasPendingCancellation = subscription.cancellationScheduledAt !== null;

  const canChangePlan =
    (subscription.statusCode === SUBSCRIPTION_STATUS.ACTIVE ||
      subscription.statusCode === SUBSCRIPTION_STATUS.TRIAL) &&
    !hasPendingCancellation;

  const changePlanDisabledReason = hasPendingCancellation
    ? t("manage.changePlanDisabledPendingCancellation")
    : !canChangePlan
      ? t("manage.changePlanDisabledStatus")
      : undefined;

  return (
    <div className="tcp-manage-page">
      {/* Back link */}
      <button
        type="button"
        className="tcp-checkout-back-link"
        onClick={() => navigate("/account/subscriptions")}
      >
        <span className="material-symbols-outlined">arrow_back</span>
        {t("manage.backLink")}
      </button>

      {/* Header */}
      <div className="tcp-manage-header">
        <div className="tcp-manage-header__icon">
          <FontAwesomeIcon icon={getFeatureIcon(subscription.solutionIcon)} />
        </div>
        <div className="tcp-manage-header__text">
          <div className="tcp-manage-header__title-row">
            <h1 className="tcp-manage-header__title">{subscription.solutionName}</h1>
            <span className="tcp-manage-header__plan-badge">
              {subscription.subscriptionPlanName}
            </span>
          </div>
          <span className={`tcp-manage-header__status tcp-manage-header__status--${variant}`}>
            <span className="material-symbols-outlined">
              {variant === "success" ? "check_circle" : variant === "error" ? "cancel" : "info"}
            </span>
            {subscription.statusName}
          </span>
        </div>
      </div>

      {/* Pending-cancellation banner */}
      {hasPendingCancellation && (
        <div className="tcp-manage-cancel-banner" role="status">
          <span className="material-symbols-outlined">event_upcoming</span>
          <div className="tcp-manage-cancel-banner__body">
            <p>
              {t("manage.pendingCancellation", {
                date: formatDate(subscription.cancellationScheduledAt!),
              })}
            </p>
            <button
              type="button"
              className="tcp-manage-cancel-banner__keep-btn"
              disabled={resumeState.status === "submitting"}
              onClick={async () => {
                const ok = await resume(subscription.id);
                if (ok) refetch();
              }}
            >
              {resumeState.status === "submitting"
                ? t("manage.resuming")
                : t("manage.keepSubscription")}
            </button>
            {resumeState.status === "error" && (
              <p className="tcp-manage-cancel-banner__error">
                {resumeState.message || t("manage.resumeError")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Details card */}
      <section className="tcp-manage-card">
        <h2 className="tcp-manage-card__title">{t("manage.detailsTitle")}</h2>
        <div className="tcp-manage-details-grid">
          <DetailItem label={t("manage.planLabel")} value={subscription.subscriptionPlanName} />
          <DetailItem
            label={t("manage.priceLabel")}
            value={`${formatCurrency(subscription.price)} / ${subscription.billingCycleName}`}
          />
          <div className="tcp-manage-detail">
            <p className="tcp-manage-detail__label">{t("manage.statusLabel")}</p>
            <span className={`tcp-subs-stat__status-row tcp-subs-stat__status-row--${variant}`}>
              <span
                className={`tcp-subs-stat__status-dot ${isTrial ? "tcp-subs-stat__status-dot--pulse" : ""}`}
              />
              {subscription.statusName}
            </span>
          </div>
          <DetailItem label={t("manage.subdomainLabel")} value={subscription.subdomain} />
          <DetailItem
            label={t("manage.memberSinceLabel")}
            value={formatDate(subscription.startDate)}
          />
          {isTrial ? (
            <DetailItem
              label={t("manage.trialEndsLabel")}
              value={formatDate(subscription.trialEndDate)}
            />
          ) : (
            <DetailItem
              label={t("manage.endsLabel")}
              value={formatDate(subscription.endDate)}
            />
          )}
        </div>
      </section>

      {/* Update Plan card */}
      <section className="tcp-manage-card tcp-manage-action-card">
        <div className="tcp-manage-action-card__text">
          <h3 className="tcp-manage-action-card__title">{t("manage.updatePlanTitle")}</h3>
          <p className="tcp-manage-action-card__description">
            {t("manage.updatePlanDescription")}
          </p>
        </div>
        {/* Enabled only for ACTIVE/TRIAL subscriptions with no pending
            cancellation — same disable-with-reason pattern as Cancel below. */}
        <button
          type="button"
          className="tcp-manage-change-plan-btn"
          disabled={!canChangePlan}
          title={changePlanDisabledReason}
          onClick={() => navigate("/account/subscriptions/new")}
        >
          <span className="material-symbols-outlined">swap_horiz</span>
          {t("manage.changePlanButton")}
        </button>
      </section>

      {/* Cancel section */}
      <section className="tcp-manage-card tcp-manage-action-card tcp-manage-danger-card">
        <div className="tcp-manage-action-card__text">
          <h3 className="tcp-manage-action-card__title tcp-manage-danger-card__title">
            {t("manage.cancelTitle")}
          </h3>
          <p className="tcp-manage-action-card__description">
            {hasPendingCancellation
              ? t("manage.cancelAlreadyScheduled", {
                  date: formatDate(subscription.cancellationScheduledAt!),
                })
              : isTrial
                ? t("manage.cancelDescriptionTrial", {
                    date: formatDate(subscription.trialEndDate),
                  })
                : t("manage.cancelDescription", { date: formatDate(subscription.endDate) })}
          </p>
        </div>
        {/* Opens the cancellation modal — disabled while a cancellation is
            already scheduled, so the user can't queue up a second one.
            Use the "Keep my subscription" banner above to undo it first. */}
        <button
          type="button"
          className="tcp-manage-cancel-btn"
          disabled={hasPendingCancellation}
          title={hasPendingCancellation ? t("manage.cancelAlreadyScheduledTooltip") : undefined}
          onClick={() => setCancelModalOpen(true)}
        >
          {hasPendingCancellation
            ? t("manage.cancelButtonScheduled")
            : t("manage.cancelButton")}
        </button>
      </section>

      <CancelSubscriptionModal
        subscription={subscription}
        open={isCancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onCancelled={refetch}
      />
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="tcp-manage-detail">
      <p className="tcp-manage-detail__label">{label}</p>
      <p className="tcp-manage-detail__value">{value}</p>
    </div>
  );
}
