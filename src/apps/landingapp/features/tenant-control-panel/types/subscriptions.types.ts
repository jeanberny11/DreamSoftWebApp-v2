// subscriptions.types.ts — Types for the Tenant Subscriptions feature

// ── POST /api/v1/subscription/create ────────────────────────────────────────

export interface CreateSubscriptionResponse {
  success: boolean;
  subscriptionId: number;
  checkoutUrl: string;
}

// ── POST /api/v1/landing/Subscription/retry-payment ─────────────────────────

export interface RetryPaymentResponse {
  checkoutUrl: string;
}

// ── POST /api/v1/landing/Subscription/cancel ────────────────────────────

export interface CancelSubscriptionResponse {
  message: string;
  scheduledEndDate: string | null;
}

/** Cancellation reason codes sent to the backend audit log */
export const CANCELLATION_REASONS = [
  "too_expensive",
  "missing_features",
  "switching_provider",
  "no_longer_needed",
  "other",
] as const;

export type CancellationReason = (typeof CANCELLATION_REASONS)[number];

// ── POST /api/v1/landing/Subscription/resume ────────────────────────────

export interface ResumeSubscriptionResponse {
  message: string;
}

// ── GET /api/v1/landing/Subscription ──────────────────────────────
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
  PAYMENT_FAILED: "PAYMENT_FAILED",
} as const;

export type SubscriptionStatusCode =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

// ── Status → visual badge variant ────────────────────────────────

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
  [SUBSCRIPTION_STATUS.PAYMENT_FAILED]: "error",
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

// ── "Owned" statuses ─────────────────────────────────────────────
// A subscription in one of these statuses still counts as the tenant
// "owning" that solution/plan for the purposes of the New Subscription
// picker (Select vs. Manage vs. Switch). CANCELLED, EXPIRED, and SUSPENDED
// are treated as available-again — the tenant can select a fresh plan.

const OWNED_STATUSES: readonly string[] = [
  SUBSCRIPTION_STATUS.ACTIVE,
  SUBSCRIPTION_STATUS.TRIAL,
  SUBSCRIPTION_STATUS.PAST_DUE,
  SUBSCRIPTION_STATUS.PROCESSING_PAYMENT,
  SUBSCRIPTION_STATUS.PAYMENT_FAILED,
];

export function isOwnedStatus(statusCode: string): boolean {
  return OWNED_STATUSES.includes(statusCode);
}
