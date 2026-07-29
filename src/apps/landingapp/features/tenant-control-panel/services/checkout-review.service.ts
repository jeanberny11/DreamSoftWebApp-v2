// checkout-review.service.ts — Checkout Review page API calls
//
// Only the detail-fetch is unique to this page. The actual subscription
// creation (POST /Subscription/create) is a shared API concern already
// implemented in subscriptions.service.ts — the checkout-review store calls
// that directly rather than duplicating it here.

import { tenantClient } from "@/apps/landingapp/common/api/tenantClient";
import type { ApiResult } from "@/shared/types/api.types";
import type { CheckoutDetailDto } from "../types/checkout-review.types";

export const checkoutReviewService = {
  /** GET /api/v1/landing/Pricing/checkout-detail */
  getCheckoutDetail: (
    planId: number,
    language: string,
  ): Promise<{ data: ApiResult<CheckoutDetailDto> }> =>
    tenantClient.get<ApiResult<CheckoutDetailDto>>(
      "/api/v1/landing/Pricing/checkout-detail",
      { params: { planId, language } },
    ),
};
