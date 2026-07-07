// subscriptions.types.ts — Types for the Tenant Subscriptions feature (view only)

// ── GET /api/v1/landing/Subscription ────────────────────────────────────────
// Mirrors the backend response DTO exactly, including statusCode constants
// (Domain.Subscriptions.SubscriptionStatus): TRIAL, ACTIVE, PAST_DUE,
// SUSPENDED, CANCELLED, EXPIRED, PROCESSING_PAYMENT.

export interface SubscriptionResponse {
  id: number;
  solutionId: number;
  solutionCode: string;
  solutionName: string;
  solutionIcon: string;
  subdomain: string;
  subscriptionPlanId: number;
  subscriptionPlanCode: string;
  subscriptionPlanName: string;
  subscriptionPlanDescription: string;
  tierLevel: number;
  billingCycleCode: string;
  billingCycleName: string;
  billingCycleDescription: string;
  price: number;
  statusId: number;
  statusCode: string;
  statusName: string;
  startDate: string;
  endDate: string;
  trialEndDate: string;
  cancellationScheduledAt: string | null;
  notes: string | null;
}

// ── Status code constants (mirrors backend SubscriptionStatus) ─────────────

export const SUBSCRIPTION_STATUS = {
  TRIAL: "TRIAL",
  ACTIVE: "ACTIVE",
  PAST_DUE: "PAST_DUE",
  SUSPENDED: "SUSPENDED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  PROCESSING_PAYMENT: "PROCESSING_PAYMENT",
} as const;

export type SubscriptionStatusCode =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

// ── Status → visual badge variant ───────────────────────────────────────────

export type SubscriptionStatusVariant =
  | "success"
  | "info"
  | "warning"
  | "error"
  | "neutral";

const STATUS_VARIANT_MAP: Record<string, SubscriptionStatusVariant> = {
  [SUBSCRIPTION_STATUS.ACTIVE]: "success",
  [SUBSCRIPTION_STATUS.TRIAL]: "info",
  [SUBSCRIPTION_STATUS.PROCESSING_PAYMENT]: "info",
  [SUBSCRIPTION_STATUS.PAST_DUE]: "warning",
  [SUBSCRIPTION_STATUS.SUSPENDED]: "error",
  [SUBSCRIPTION_STATUS.CANCELLED]: "error",
  [SUBSCRIPTION_STATUS.EXPIRED]: "neutral",
};

export function getSubscriptionStatusVariant(
  statusCode: string,
): SubscriptionStatusVariant {
  return STATUS_VARIANT_MAP[statusCode] ?? "neutral";
}
