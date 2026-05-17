// tenant.api.ts — Tenant app API calls (subscription management)

import { tenantClient } from '@/apps/landingapp/common/tenantClient'

export interface CreateSubscriptionRequest {
  planId:          string
  paymentMethodId: string
}

export interface ChangePlanRequest {
  newPlanId: string
}

export const tenantApi = {
  createSubscription: (body: CreateSubscriptionRequest) =>
    tenantClient.post('/api/v1/subscription/create', body),

  cancelSubscription: () =>
    tenantClient.post('/api/v1/subscription/cancel'),

  changePlan: (body: ChangePlanRequest) =>
    tenantClient.post('/api/v1/subscription/change-plan', body),
}
