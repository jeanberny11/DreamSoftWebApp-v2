// ProfileCompleteGuard — blocks routes that require a completed profile setup.
// Assumes it is nested inside LandingAuthGuard (session is present).
// session.onboardingCompleted maps to the backend's Tenant.OnboardingCompleted,
// which the onboarding checklist exposes as ProfileSetup.Completed.
// If the profile is not complete, redirect to the account dashboard,
// where the OnboardingChecklist shows the pending step and its action button.

import { Navigate, Outlet } from 'react-router-dom'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'

export function ProfileCompleteGuard() {
  const profileCompleted = useTenantAuthStore(
    (s) => s.session?.onboardingCompleted ?? false,
  )

  if (!profileCompleted) {
    return <Navigate to="/account" replace />
  }

  return <Outlet />
}
