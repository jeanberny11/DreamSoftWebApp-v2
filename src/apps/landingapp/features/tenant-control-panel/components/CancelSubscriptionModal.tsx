// CancelSubscriptionModal — honest-UX cancellation dialog for the Manage page.
// From Stitch design "Manage Subscription | DreamSoft" (modal overlay) with
// the agreed fixes: survey explicitly optional, all 5 backend reason codes,
// immediate-cancel states NO REFUND, dynamic confirm label per cancel type.
// Period-end is pre-selected (recommended). Overlay/Escape close is blocked
// while submitting.

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCancelSubscription } from "../hooks/useCancelSubscription";
import { formatDate } from "@/shared/utils/formatters";
import {
  CANCELLATION_REASONS,
  SUBSCRIPTION_STATUS,
  type SubscriptionResponse,
} from "../types/subscriptions.types";

interface CancelSubscriptionModalProps {
  subscription: SubscriptionResponse;
  open: boolean;
  onClose: () => void;
  /** Called after a successful cancellation so the page can refetch */
  onCancelled: () => void;
}

type CancelType = "period_end" | "immediate";

export function CancelSubscriptionModal({
  subscription,
  open,
  onClose,
  onCancelled,
}: CancelSubscriptionModalProps) {
  const { t } = useTranslation("subscriptions");
  const { state, cancel } = useCancelSubscription();

  const [cancelType, setCancelType] = useState<CancelType>("period_end");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");

  const isSubmitting = state.status === "submitting";

  const isTrial = subscription.statusCode === SUBSCRIPTION_STATUS.TRIAL;
  const accessUntilDate = formatDate(
    isTrial ? subscription.trialEndDate : subscription.endDate,
  );

  // Reset selections each time the modal opens
  useEffect(() => {
    if (open) {
      setCancelType("period_end");
      setReason("");
      setFeedback("");
    }
  }, [open]);

  // Close on Escape (unless submitting)
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, isSubmitting, onClose]);

  if (!open) return null;

  const handleConfirm = async () => {
    const ok = await cancel(
      subscription.solutionId,
      cancelType === "immediate",
      reason || undefined,
      feedback.trim() || undefined,
    );
    if (ok) {
      onCancelled();
      onClose();
    }
  };

  return (
    <div
      className="tcp-cancel-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="tcp-cancel-modal" role="dialog" aria-modal="true">
        <div className="tcp-cancel-modal__header">
          <h2 className="tcp-cancel-modal__title">{t("manage.cancelModal.title")}</h2>
          <p className="tcp-cancel-modal__subtitle">{t("manage.cancelModal.subtitle")}</p>
        </div>

        {/* Cancel-type options */}
        <div className="tcp-cancel-modal__options">
          <label
            className={`tcp-cancel-option ${cancelType === "period_end" ? "tcp-cancel-option--selected" : ""}`}
          >
            <input
              type="radio"
              name="cancel_type"
              checked={cancelType === "period_end"}
              onChange={() => setCancelType("period_end")}
              disabled={isSubmitting}
            />
            <span className="tcp-cancel-option__icon">
              <span className="material-symbols-outlined">calendar_today</span>
            </span>
            <span className="tcp-cancel-option__text">
              <span className="tcp-cancel-option__label">
                {t("manage.cancelModal.periodEndLabel")}
              </span>
              <span className="tcp-cancel-option__description">
                {t("manage.cancelModal.periodEndDescription", { date: accessUntilDate })}
              </span>
            </span>
          </label>

          <label
            className={`tcp-cancel-option tcp-cancel-option--danger ${cancelType === "immediate" ? "tcp-cancel-option--selected" : ""}`}
          >
            <input
              type="radio"
              name="cancel_type"
              checked={cancelType === "immediate"}
              onChange={() => setCancelType("immediate")}
              disabled={isSubmitting}
            />
            <span className="tcp-cancel-option__icon">
              <span className="material-symbols-outlined">warning</span>
            </span>
            <span className="tcp-cancel-option__text">
              <span className="tcp-cancel-option__label">
                {t("manage.cancelModal.immediateLabel")}
              </span>
              <span className="tcp-cancel-option__description">
                {t("manage.cancelModal.immediateDescription")}
              </span>
            </span>
          </label>
        </div>

        {/* Optional exit survey */}
        <div className="tcp-cancel-modal__survey">
          <p className="tcp-cancel-modal__survey-heading">
            {t("manage.cancelModal.surveyHeading")}
          </p>
          <div className="tcp-cancel-modal__field">
            <label htmlFor="cancel-reason">{t("manage.cancelModal.reasonLabel")}</label>
            <select
              id="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">{t("manage.cancelModal.reasonPlaceholder")}</option>
              {CANCELLATION_REASONS.map((code) => (
                <option key={code} value={code}>
                  {t(`manage.cancelModal.reasons.${code}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="tcp-cancel-modal__field">
            <label htmlFor="cancel-feedback">{t("manage.cancelModal.feedbackLabel")}</label>
            <textarea
              id="cancel-feedback"
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t("manage.cancelModal.feedbackPlaceholder")}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {state.status === "error" && (
          <p className="tcp-cancel-modal__error">
            {state.message || t("manage.cancelModal.error")}
          </p>
        )}

        {/* Equal-weight footer — no dark patterns */}
        <div className="tcp-cancel-modal__footer">
          <button
            type="button"
            className="tcp-cancel-modal__keep-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t("manage.cancelModal.keepButton")}
          </button>
          <button
            type="button"
            className="tcp-cancel-modal__confirm-btn"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("manage.cancelModal.submitting")
              : cancelType === "period_end"
                ? t("manage.cancelModal.confirmPeriodEnd", { date: accessUntilDate })
                : t("manage.cancelModal.confirmImmediate")}
          </button>
        </div>
      </div>
    </div>
  );
}
