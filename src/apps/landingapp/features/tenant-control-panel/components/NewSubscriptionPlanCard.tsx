// NewSubscriptionPlanCard.tsx — Plan card for the Add New Subscription flow
//
// Distinct from home's PricingCard — this is the TCP's own presentation of a
// plan, styled to match the tenant control panel (Material Symbols icons,
// tcp-* CSS classes). The CTA button has four states driven by `planAction`
// (computed by useNewSubscriptions().getPlanAction — see subscriptions.types
// isOwnedStatus) plus billing-cycle availability:
//   - unavailable: plan isn't offered in the active billing cycle
//   - select:      tenant doesn't own this solution — normal Select/Selected flow
//   - manage:      this IS the tenant's current plan for this solution
//   - switch:      tenant owns a DIFFERENT plan of this same solution — navigates
//                  straight into the Confirm Plan Change review flow (real
//                  Stripe proration preview), independent of this page's cart

import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/shared/utils/formatters";
import type { SubscriptionPlanDto } from "@/apps/landingapp/common/types/catalog.types";
import "../styles/new-subscription.css";

export type PlanAction = "select" | "manage" | "switch";

interface NewSubscriptionPlanCardProps {
  plan: SubscriptionPlanDto;
  isPopular: boolean;
  isSelected: boolean;
  planAction: PlanAction;
  billingCycleCode: string;
  solutionCode: string;
  onSelect: (planId: number, planPriceId: number) => void;
}

export function NewSubscriptionPlanCard({
  plan,
  isPopular,
  isSelected,
  planAction,
  billingCycleCode,
  solutionCode,
  onSelect,
}: NewSubscriptionPlanCardProps) {
  const { t } = useTranslation("subscriptions");
  const navigate = useNavigate();

  const price = plan.prices.find((p) => p.billingCycle.code === billingCycleCode);
  const isUnavailable = !price;

  return (
    <div
      className={[
        "tcp-newsub-card",
        isSelected && !isUnavailable && "tcp-newsub-card--selected",
        isUnavailable && "tcp-newsub-card--unavailable",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isPopular && (
        <span className="tcp-newsub-card__popular-badge">
          {t("newSubscription.mostPopular")}
        </span>
      )}

      <div className="tcp-newsub-card__top">
        <div>
          <h3 className="tcp-newsub-card__name">{plan.name}</h3>
          <p className="tcp-newsub-card__description">{plan.description}</p>
        </div>
        {!isUnavailable && plan.trialDays > 0 && (
          <span className="tcp-newsub-card__trial-badge">
            {t("newSubscription.trialBadge", { days: plan.trialDays })}
          </span>
        )}
      </div>

      {isUnavailable ? (
        <p className="tcp-newsub-card__unavailable-msg">
          {t("newSubscription.notAvailableForCycle")}
        </p>
      ) : (
        <div className="tcp-newsub-card__price-row">
          <span className="tcp-newsub-card__price">{formatCurrency(price.price)}</span>
          <span className="tcp-newsub-card__price-cycle">
            {t("newSubscription.perCycle", { cycle: price.billingCycle.name })}
          </span>
        </div>
      )}

      <hr className="tcp-newsub-card__divider" />

      <ul className="tcp-newsub-card__limits">
        {plan.limits.map((limit) => (
          <li key={limit.planLimitId} className="tcp-newsub-card__limit">
            <span className="material-symbols-outlined tcp-newsub-card__limit-icon">
              check_circle
            </span>
            <span className="tcp-newsub-card__limit-desc">{limit.description}</span>
            <span className="tcp-newsub-card__limit-value">
              {limit.limitValue === 0 ? t("newSubscription.unlimited") : limit.limitValue}
            </span>
          </li>
        ))}
      </ul>

      {isUnavailable ? (
        <button type="button" disabled className="tcp-newsub-card__cta tcp-newsub-card__cta--disabled">
          {t("newSubscription.unavailable")}
        </button>
      ) : planAction === "manage" ? (
        // Own current plan — no action needed on its own card.
        <button type="button" disabled className="tcp-newsub-card__cta tcp-newsub-card__cta--disabled">
          {t("newSubscription.currentPlan")}
        </button>
      ) : planAction === "switch" ? (
        <button
          type="button"
          className="tcp-newsub-card__cta tcp-newsub-card__cta--outline"
          onClick={() =>
            navigate(`/account/subscriptions/change-plan/review?planPriceId=${price.planPriceId}`)
          }
        >
          {t("newSubscription.switchPlan")}
        </button>
      ) : isSelected ? (
        <button
          type="button"
          className="tcp-newsub-card__cta tcp-newsub-card__cta--selected"
          onClick={() => onSelect(plan.planId, price.planPriceId)}
        >
          <span className="material-symbols-outlined">check</span>
          {t("newSubscription.selected")}
        </button>
      ) : (
        <button
          type="button"
          className="tcp-newsub-card__cta tcp-newsub-card__cta--outline"
          onClick={() => onSelect(plan.planId, price.planPriceId)}
        >
          {t("newSubscription.selectPlan")}
        </button>
      )}

      <Link to={`/solutions/${solutionCode}`} className="tcp-newsub-card__learn-more">
        {t("newSubscription.learnMore")}
      </Link>
    </div>
  );
}
