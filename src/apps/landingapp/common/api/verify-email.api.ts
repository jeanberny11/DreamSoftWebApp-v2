// verify-email.api.ts — Email verification API calls
//
// Endpoints:
//   POST /api/v1/landing/SendEmailVerificationCode — no body, returns SendCodeResponse
//   POST /api/v1/landing/VerifyEmail               — body: { code }, returns VerifyCodeResponse
// Auth: both require a valid tenant Bearer token (TenantOnly policy)
//
// The tenantClient interceptor normalises every response to ApiResult<T>,
// so callers never need try/catch — they just check result.success.

import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { ApiResult } from '@/shared/types/api.types'
import type { SendCodeResponse, VerifyCodeRequest, VerifyCodeResponse } from '../types/verify-email.types'

export const verifyEmailApi = {
  sendCode: (): Promise<{ data: ApiResult<SendCodeResponse> }> =>
    tenantClient.post<ApiResult<SendCodeResponse>>('/api/v1/landing/SendEmailVerificationCode'),

  verifyCode: (body: VerifyCodeRequest): Promise<{ data: ApiResult<VerifyCodeResponse> }> =>
    tenantClient.post<ApiResult<VerifyCodeResponse>>('/api/v1/landing/VerifyEmail', body),
}
