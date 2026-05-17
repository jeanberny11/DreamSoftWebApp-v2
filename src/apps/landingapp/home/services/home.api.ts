import { tenantClient } from '@/apps/landingapp/common/tenantClient'
import type { ApiResult } from '@/shared/types/api.types'
import type { Solution, AppFeature, PricingSolution } from '../types/home.types'

export const homeApi = {
  getAppFeatures: (language: string) =>
    tenantClient.get<ApiResult<AppFeature[]>>('/api/v1/admin/AppFeatures', { params: { language } }),

  getPricing: (language: string) =>
    tenantClient.get<ApiResult<PricingSolution[]>>('/api/v1/landing/pricing', { params: { language } }),

  getSolutions: (language: string) =>
    tenantClient.get<ApiResult<Solution[]>>('/api/v1/admin/Solutions/active', { params: { language } }),
}
