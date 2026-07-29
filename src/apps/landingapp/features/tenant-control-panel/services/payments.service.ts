// payments.service.ts — Tenant Payments History API calls
// Mirrors the 4 endpoints on PaymentController.cs exactly — same split as
// InvoiceController (all / by solution / by date range / by invoice instead
// of by-stripe-id), so payments.store.ts picks whichever one best matches
// the active filter.

import { tenantClient } from "@/apps/landingapp/common/api/tenantClient";
import type { ApiResult } from "@/shared/types/api.types";
import type { PaymentHistoryDto } from "../types/payments.types";

const PAYMENT_ENDPOINT = "/api/v1/landing/payment";

export const paymentsService = {
  /** GET /api/v1/landing/payment */
  getPayments: (language: string): Promise<{ data: ApiResult<PaymentHistoryDto[]> }> =>
    tenantClient.get<ApiResult<PaymentHistoryDto[]>>(PAYMENT_ENDPOINT, {
      params: { language },
    }),

  /** GET /api/v1/landing/payment/solution/{solutionId} */
  getPaymentsBySolution: (
    solutionId: number,
    language: string,
  ): Promise<{ data: ApiResult<PaymentHistoryDto[]> }> =>
    tenantClient.get<ApiResult<PaymentHistoryDto[]>>(`${PAYMENT_ENDPOINT}/solution/${solutionId}`, {
      params: { language },
    }),

  /** GET /api/v1/landing/payment/by-date-range — startDate/endDate as ISO strings, inclusive */
  getPaymentsByDateRange: (
    startDate: string,
    endDate: string,
    language: string,
  ): Promise<{ data: ApiResult<PaymentHistoryDto[]> }> =>
    tenantClient.get<ApiResult<PaymentHistoryDto[]>>(`${PAYMENT_ENDPOINT}/by-date-range`, {
      params: { startDate, endDate, language },
    }),

  /** GET /api/v1/landing/payment/invoice/{invoiceId} — retry history for a single invoice */
  getPaymentsByInvoice: (
    invoiceId: number,
    language: string,
  ): Promise<{ data: ApiResult<PaymentHistoryDto[]> }> =>
    tenantClient.get<ApiResult<PaymentHistoryDto[]>>(`${PAYMENT_ENDPOINT}/invoice/${invoiceId}`, {
      params: { language },
    }),
};
