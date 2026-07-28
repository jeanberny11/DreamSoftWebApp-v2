// payments.types.ts — Types for the Tenant Payments History feature
// Mirrors the backend DTO exactly:
// Features/Apps/LandingApp/Payment/GetPayments/GetPaymentsQuery.cs

export interface PaymentHistoryDto {
  id: number;
  subscriptionInvoiceId: number;
  amount: number;
  currency: string;
  status: string;
  paymentDate: string;
  stripePaymentId: string | null;
  failureReason: string | null;
  solutionId: number;
  solutionName: string;
  solutionIcon: string;
  planName: string;
  invoiceNumber: string | null;
}

// ── Status code constants (mirrors backend SubscriptionPayment.Status) ─────

export const PAYMENT_STATUS = {
  PAID: "paid",
  FAILED: "failed",
} as const;

export type PaymentStatusCode =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// ── Status → visual badge variant ───────────────────────────────────────────

export type PaymentStatusVariant = "success" | "error" | "neutral";

const PAYMENT_STATUS_VARIANT_MAP: Record<string, PaymentStatusVariant> = {
  [PAYMENT_STATUS.PAID]: "success",
  [PAYMENT_STATUS.FAILED]: "error",
};

export function getPaymentStatusVariant(status: string): PaymentStatusVariant {
  return PAYMENT_STATUS_VARIANT_MAP[status.toLowerCase()] ?? "neutral";
}
