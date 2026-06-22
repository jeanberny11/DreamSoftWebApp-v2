// profile.service.ts — Tenant Profile API calls.
// Shared by the view page (ProfileSection) and the edit page (ProfileEditPage) —
// both read from GET, only the edit page calls PUT.

import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { ApiResult } from '@/shared/types/api.types'
import type { ProfileResponse, UpdateProfileRequest } from '../types/profile.types'

const TENANT_PROFILE_ENDPOINT = '/api/v1/landing/TenantProfile'

export const profileService = {
  /** GET /api/v1/landing/TenantProfile */
  getProfile: (): Promise<{ data: ApiResult<ProfileResponse> }> =>
    tenantClient.get<ApiResult<ProfileResponse>>(TENANT_PROFILE_ENDPOINT),

  /**
   * PUT /api/v1/landing/TenantProfile
   * Backend returns 204 No Content on success — no response body to unwrap.
   * Also auto-completes onboarding server-side if not already done.
   */
  updateProfile: (body: UpdateProfileRequest): Promise<{ data: ApiResult<void> }> =>
    tenantClient.put<ApiResult<void>>(TENANT_PROFILE_ENDPOINT, body),
}
