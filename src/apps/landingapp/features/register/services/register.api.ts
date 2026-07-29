// register.api.ts â€” Registration API calls
//
// Endpoint : POST /api/v1/landing/tenant-auth/register
// Auth     : none (public)
// On success: returns the same TenantAuthResponse shape as Login/Refresh —
//             the tenant is authenticated immediately, no separate login call needed.

import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { ApiResult } from '@/shared/types/api.types'
import type { RegisterRequest } from '../types/register.types'
import type { TenantAuthResponse } from '@/apps/landingapp/common/types/tenant-auth.types'

export const registerApi = {
  register: (body: RegisterRequest): Promise<{ data: ApiResult<TenantAuthResponse> }> =>
    tenantClient.post<ApiResult<TenantAuthResponse>>('/api/v1/landing/tenant-auth/register', body),
}
