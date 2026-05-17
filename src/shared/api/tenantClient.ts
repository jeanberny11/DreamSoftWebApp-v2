// tenantClient.ts — Axios instance for the LandingApp tenant auth context.
// Handles: tenant owner login, onboarding, subscription management.
// Token slot : 'tenant'
// Refresh    : POST /api/v1/tenant-auth/refresh
// On expiry  : clears tenant session, redirects to /login

import { createApiClient } from './createApiClient'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'

export const tenantClient = createApiClient({
  context:         'tenant',
  refreshEndpoint: '/api/v1/tenant-auth/refresh',
  loginPath:       '/login',
  clearAuth:       () => useTenantAuthStore.getState().clearAuth(),
})
