// change-plan.service.ts — Change Plan preview + confirm API calls

import { tenantClient } from "@/apps/landingapp/common/api/tenantClient";
import type { ApiResult } from "@/shared/types/api.types";
import type { ChangePlanPreviewResponse, ChangePlanResponse } from "../types/change-plan.types";

const SUBSCRIPTION_ENDPOINT = "/api/v1/landing/Subscription";

export const changePlanService = {
  /** POST /api/v1/landing/Subscription/change-plan/preview */
  previewChangePlan: (
    newPlanPriceId: number,
    prorationImmediate: boolean,
    language: string,
  ): Promise<{ data: ApiResult<ChangePlanPreviewResponse> }> =>
    tenantClient.post<ApiResult<ChangePlanPreviewResponse>>(
      `${SUBSCRIPTION_ENDPOINT}/change-plan/preview`,
      { newPlanPriceId, prorationImmediate, language },
    ),

  /** POST /api/v1/landing/Subscription/change-plan */
  changePlan: (
    newPlanPriceId: number,
    prorationImmediate: boolean,
    prorationDate: string,
  ): Promise<{ data: ApiResult<ChangePlanResponse> }> =>
    tenantClient.post<ApiResult<ChangePlanResponse>>(
      `${SUBSCRIPTION_ENDPOINT}/change-plan`,
      { newPlanPriceId, prorationImmediate, prorationDate },
    ),
};
