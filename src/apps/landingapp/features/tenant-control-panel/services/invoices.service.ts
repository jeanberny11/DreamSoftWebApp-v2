// invoices.service.ts — Tenant Invoices API calls
// Mirrors the 4 endpoints on InvoiceController.cs exactly — the backend
// splits "all" / "by solution" / "by date range" / "by stripe id" into
// separate single-purpose routes (no combined-filter endpoint), so
// invoices.store.ts picks whichever one best matches the active filter.

import { tenantClient } from "@/apps/landingapp/common/api/tenantClient";
import type { ApiResult } from "@/shared/types/api.types";
import type { InvoiceDto } from "../types/invoices.types";

const INVOICE_ENDPOINT = "/api/v1/landing/invoice";

export const invoicesService = {
  /** GET /api/v1/landing/invoice */
  getInvoices: (language: string): Promise<{ data: ApiResult<InvoiceDto[]> }> =>
    tenantClient.get<ApiResult<InvoiceDto[]>>(INVOICE_ENDPOINT, {
      params: { language },
    }),

  /** GET /api/v1/landing/invoice/solution/{solutionId} */
  getInvoicesBySolution: (
    solutionId: number,
    language: string,
  ): Promise<{ data: ApiResult<InvoiceDto[]> }> =>
    tenantClient.get<ApiResult<InvoiceDto[]>>(`${INVOICE_ENDPOINT}/solution/${solutionId}`, {
      params: { language },
    }),

  /** GET /api/v1/landing/invoice/by-date-range — startDate/endDate as ISO strings, inclusive */
  getInvoicesByDateRange: (
    startDate: string,
    endDate: string,
    language: string,
  ): Promise<{ data: ApiResult<InvoiceDto[]> }> =>
    tenantClient.get<ApiResult<InvoiceDto[]>>(`${INVOICE_ENDPOINT}/by-date-range`, {
      params: { startDate, endDate, language },
    }),

  /** GET /api/v1/landing/invoice/by-stripe-id/{stripeInvoiceId} — single invoice, 404 if not found */
  getInvoiceByStripeId: (
    stripeInvoiceId: string,
    language: string,
  ): Promise<{ data: ApiResult<InvoiceDto> }> =>
    tenantClient.get<ApiResult<InvoiceDto>>(`${INVOICE_ENDPOINT}/by-stripe-id/${stripeInvoiceId}`, {
      params: { language },
    }),
};
