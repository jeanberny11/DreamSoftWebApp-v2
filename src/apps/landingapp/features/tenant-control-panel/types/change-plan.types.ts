// change-plan.types.ts — Types for the Change Plan preview + confirm flow

// ── POST /api/v1/landing/Subscription/change-plan/preview ───────────────────

export interface ChangePlanPreviewResponse {
  currentPlanName: string;
  currentPrice: number;
  currentBillingCycleName: string;

  solutionName: string;
  solutionIcon: string;
  newPlanName: string;
  newPrice: number;
  newBillingCycleName: string;
  newPlanPriceId: number;

  creditAmount: number;
  chargeAmount: number;
  amountDueNow: number;
  currency: string;
  nextBillingDate: string;
  nextBillingAmount: number;
  prorationDate: string;
  prorationImmediate: boolean;

  hasActiveTrial: boolean;
  trialEndDate: string | null;
}

// ── POST /api/v1/landing/Subscription/change-plan ────────────────────────────

export interface ChangePlanResponse {
  message: string;
}
