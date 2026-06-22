// landing.api.ts — LandingApp public page API calls
// Note: Registration API has moved to apps/landingapp/register/services/register.api.ts
// Note: Verify email API lives in apps/landingapp/features/verify-email/services/verify-email.api.ts

import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { Solution, AppFeature, PricingSolution } from '@/apps/landingapp/features/home/types/home.types'

export interface OnboardingRequest {
  [key: string]: unknown
}

export const landingApi = {
  getAppFeatures: (language: string) =>
    tenantClient.get<AppFeature[]>('/api/v1/admin/AppFeatures', { params: { language } }),

  getPricing: (language: string) =>
    tenantClient.get<PricingSolution[]>('/api/v1/landing/pricing', { params: { language } }),

  getSolutions: (language: string) =>
    tenantClient.get<Solution[]>('/api/v1/admin/Solutions/active', { params: { language } }),

  completeOnboarding: (body: OnboardingRequest) =>
    tenantClient.post('/api/v1/onboarding/complete', body),
}
