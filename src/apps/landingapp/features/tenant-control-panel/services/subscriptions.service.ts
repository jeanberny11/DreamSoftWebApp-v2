// subscriptions.service.ts — Tenant Subscriptions API calls (read-only for now)

import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { ApiResult } from '@/shared/types/api.types'
import type { SubscriptionResponse } from '../types/subscriptions.types'

const SUBSCRIPTION_ENDPOINT = '/api/v1/landing/Subscription'

export const subscriptionsService = {
  /** GET /api/v1/landing/Subscription */
  getSubscriptions: (): Promise<{ data: ApiResult<SubscriptionResponse[]> }> =>
    tenantClient.get<ApiResult<SubscriptionResponse[]>>(SUBSCRIPTION_ENDPOINT),
}
