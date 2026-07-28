// EmailVerifiedGuard — blocks routes that require a verified email.
// Assumes it is nested inside LandingAuthGuard (session is present).
// If the tenant's email is not verified, redirect to the account dashboard,
// where the OnboardingChecklist shows the pending step and its action button.

import { Navigate, Outlet } from 'react-router-dom'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'

export function EmailVerifiedGuard() {
  const emailVerified = useTenantAuthStore(
    (s) => s.session?.emailVerified ?? false,
  )

  if (!emailVerified) {
    return <Navigate to="/account" replace />
  }

  return <Outlet />
}
