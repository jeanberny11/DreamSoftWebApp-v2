// register.api.ts — Registration API calls

import { tenantClient } from '@/apps/landingapp/common/tenantClient'
import type { ApiResult } from '@/shared/types/api.types'
import type { RegisterRequest, RegisterResponse } from '../types/register.types'

export const registerApi = {
  register: (body: RegisterRequest): Promise<{ data: ApiResult<RegisterResponse> }> =>
    tenantClient.post<ApiResult<RegisterResponse>>('/api/v1/registration', body),
}
