// subscriptions.service.ts — Tenant Subscriptions API calls

import { tenantClient } from "@/apps/landingapp/common/api/tenantClient";
import type { ApiResult } from "@/shared/types/api.types";
import type {
  SubscriptionResponse,
  CreateSubscriptionResponse,
  RetryPaymentResponse,
  CancelSubscriptionResponse,
  ResumeSubscriptionResponse,
} from "../types/subscriptions.types";
import type { SolutionDto } from "@/apps/landingapp/common/types/catalog.types";

const SUBSCRIPTION_ENDPOINT = "/api/v1/landing/Subscription";

export const subscriptionsService = {
  /** GET /api/v1/landing/Pricing */
  getPricing: (language: string): Promise<{ data: ApiResult<SolutionDto[]> }> =>
    tenantClient.get<ApiResult<SolutionDto[]>>("/api/v1/landing/Pricing", {
      params: { language },
    }),

  /** GET /api/v1/landing/Subscription */
  getSubscriptions: (language: string): Promise<{ data: ApiResult<SubscriptionResponse[]> }> =>
    tenantClient.get<ApiResult<SubscriptionResponse[]>>(SUBSCRIPTION_ENDPOINT, {
      params: { language },
    }),

  /** GET /api/v1/landing/Subscription/{id} */
  getSubscriptionById: (
    subscriptionId: number,
    language: string,
  ): Promise<{ data: ApiResult<SubscriptionResponse> }> =>
    tenantClient.get<ApiResult<SubscriptionResponse>>(
      `${SUBSCRIPTION_ENDPOINT}/${subscriptionId}`,
      { params: { language } },
    ),

  /** POST /api/v1/landing/Subscription/create */
  createSubscription: (
    planId: number,
    planPriceId: number,
  ): Promise<{ data: ApiResult<CreateSubscriptionResponse> }> =>
    tenantClient.post<ApiResult<CreateSubscriptionResponse>>(
      `${SUBSCRIPTION_ENDPOINT}/create`,
      { planId, planPriceId },
    ),

  /** POST /api/v1/landing/Subscription/retry-payment */
  retryPayment: (
    subscriptionId: number,
  ): Promise<{ data: ApiResult<RetryPaymentResponse> }> =>
    tenantClient.post<ApiResult<RetryPaymentResponse>>(
      `${SUBSCRIPTION_ENDPOINT}/retry-payment`,
      { subscriptionId },
    ),

  /** POST /api/v1/landing/Subscription/cancel */
  cancelSubscription: (
    solutionId: number,
    cancelImmediately: boolean,
    cancellationReason?: string,
    cancellationFeedback?: string,
  ): Promise<{ data: ApiResult<CancelSubscriptionResponse> }> =>
    tenantClient.post<ApiResult<CancelSubscriptionResponse>>(
      `${SUBSCRIPTION_ENDPOINT}/cancel`,
      { solutionId, cancelImmediately, cancellationReason, cancellationFeedback },
    ),

  /** POST /api/v1/landing/Subscription/resume */
  resumeSubscription: (
    subscriptionId: number,
  ): Promise<{ data: ApiResult<ResumeSubscriptionResponse> }> =>
    tenantClient.post<ApiResult<ResumeSubscriptionResponse>>(
      `${SUBSCRIPTION_ENDPOINT}/resume`,
      { subscriptionId },
    ),
};
