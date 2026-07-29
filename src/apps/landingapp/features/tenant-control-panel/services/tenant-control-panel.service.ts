import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { ApiResult } from '@/shared/types/api.types'
import type { OnboardingChecklistResponse } from '../types/tenant-control-panel.types'

export const onboardingApi = {
  getChecklist: (): Promise<{ data: ApiResult<OnboardingChecklistResponse> }> =>
    tenantClient.get<ApiResult<OnboardingChecklistResponse>>('/api/v1/landing/Onboarding/checklist'),
}
