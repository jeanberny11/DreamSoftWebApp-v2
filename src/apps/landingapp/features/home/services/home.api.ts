import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { ApiResult } from '@/shared/types/api.types'
import type { Solution, AppFeature, PricingSolution, SolutionDetail, FeatureCatalogItem, BillingCycle } from '../types/home.types'

export const homeApi = {
  getAppFeatures: (language: string) =>
    tenantClient.get<ApiResult<AppFeature[]>>('/api/v1/landing/Features/GetAllAppFeatures', { params: { language } }),

  getPricing: (language: string) =>
    tenantClient.get<ApiResult<PricingSolution[]>>('/api/v1/landing/Pricing', { params: { language } }),

  getSolutions: (language: string) =>
    tenantClient.get<ApiResult<Solution[]>>('/api/v1/landing/Solutions-Features', { params: { language } }),

  getSolutionDetail: (code: string) =>
    tenantClient.get<ApiResult<SolutionDetail>>(`/api/v1/landing/Solutions-Features/${code}`),

  getFeaturesCatalog: () =>
    tenantClient.get<ApiResult<FeatureCatalogItem[]>>('/api/v1/landing/Features/GetAllFeatures'),

  getByllingCycles:(language: string) =>
    tenantClient.get<ApiResult<BillingCycle[]>>('/api/v1/admin/billing-cycles/active', { params: { language } }),
}
