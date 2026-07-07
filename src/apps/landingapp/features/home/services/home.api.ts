import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { ApiResult } from '@/shared/types/api.types'
import type { SolutionResponse, ModuleDto, SolutionDto, BillingCycle } from '../types/home.types'

export const homeApi = {
  getMainFeatures: (language: string) =>
    tenantClient.get<ApiResult<ModuleDto[]>>('/api/v1/landing/Features/get-main-features', { params: { language } }),

  getPricing: (language: string) =>
    tenantClient.get<ApiResult<SolutionDto[]>>('/api/v1/landing/Pricing', { params: { language } }),

  getAllActiveSolutions: (language: string) =>
    tenantClient.get<ApiResult<SolutionResponse[]>>('/api/v1/landing/Solutions/all-active', { params: { language } }),

    getAllActiveSolutionsWithFeatures: (language: string) =>
    tenantClient.get<ApiResult<SolutionDto[]>>('/api/v1/landing/Solutions/with-features', { params: { language } }),

  getSolutionDetail: (code: string) =>
    tenantClient.get<ApiResult<SolutionDto>>(`/api/v1/landing/Solutions/solution-by-code/${code}`),

  getFeaturesCatalog: (language: string) =>
    tenantClient.get<ApiResult<ModuleDto[]>>('/api/v1/landing/Features/GetAllFeatures', { params: { language } }),

  getByllingCycles:(language: string) =>
    tenantClient.get<ApiResult<BillingCycle[]>>('/api/v1/admin/billing-cycles/active', { params: { language } }),
}
