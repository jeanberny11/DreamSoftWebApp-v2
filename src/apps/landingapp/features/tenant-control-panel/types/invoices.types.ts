// invoices.types.ts — Types for the Tenant Invoices feature
// Mirrors the backend DTOs exactly:
// Features/Apps/LandingApp/Invoice/GetInvoices/GetInvoicesQuery.cs

export interface PaymentAttemptDto {
  id: number;
  amount: number;
  currency: string;
  status: string;
  paymentDate: string;
  stripePaymentId: string | null;
  failureReason: string | null;
}

export interface InvoiceDto {
  id: number;
  tenantSubscriptionId: number;
  solutionId: number;
  solutionName: string;
  solutionIcon: string;
  planName: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  paidAt: string | null;
  invoiceNumber: string | null;
  billingReason: string | null;
  hostedInvoiceUrl: string | null;
  invoicePdfUrl: string | null;
  payments: PaymentAttemptDto[];
}

// ── Status code constants (mirrors backend SubscriptionInvoice.Status) ─────

export const INVOICE_STATUS = {
  UNPAID: "unpaid",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type InvoiceStatusCode =
  (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

// ── Status → visual badge variant ───────────────────────────────────────────

export type InvoiceStatusVariant = "success" | "warning" | "error" | "neutral";

const INVOICE_STATUS_VARIANT_MAP: Record<string, InvoiceStatusVariant> = {
  [INVOICE_STATUS.PAID]: "success",
  [INVOICE_STATUS.UNPAID]: "warning",
  [INVOICE_STATUS.FAILED]: "error",
  [INVOICE_STATUS.REFUNDED]: "neutral",
};

export function getInvoiceStatusVariant(status: string): InvoiceStatusVariant {
  return INVOICE_STATUS_VARIANT_MAP[status.toLowerCase()] ?? "neutral";
}

// ── Payment attempt status (mirrors backend SubscriptionPayment.Status) ────

export const PAYMENT_ATTEMPT_STATUS = {
  PAID: "paid",
  FAILED: "failed",
} as const;
