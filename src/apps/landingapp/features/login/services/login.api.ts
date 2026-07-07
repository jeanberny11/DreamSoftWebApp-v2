// login.api.ts â€” Tenant login API calls
//
// Endpoint : POST /api/v1/landing/tenant-auth/login
// Auth     : none (public)
// On success: access token returned in JSON body; refresh token set by the
//             server as an HTTP-only, Secure, SameSite=Strict cookie.
//
// The tenantClient interceptor normalises every response to ApiResult<T>,
// so callers never need try/catch â€” they just check result.success.

import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { ApiResult } from '@/shared/types/api.types'
import type { LoginRequest } from '../types/login.types'
import type { TenantAuthResponse } from '@/apps/landingapp/common/types/tenant-auth.types'

export const loginApi = {
  login: (body: LoginRequest): Promise<{ data: ApiResult<TenantAuthResponse> }> =>
    tenantClient.post<ApiResult<TenantAuthResponse>>('/api/v1/landing/tenant-auth/login', body),
}
