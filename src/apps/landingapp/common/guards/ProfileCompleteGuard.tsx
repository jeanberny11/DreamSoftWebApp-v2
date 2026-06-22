// ProfileCompleteGuard — blocks routes that require a completed onboarding profile
// If the tenant has not completed onboarding, redirect them back to /account.

import { Navigate, Outlet } from 'react-router-dom'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'

export function ProfileCompleteGuard() {
  const onboardingCompleted = useTenantAuthStore((s) => s.session?.onboardingCompleted)

  if (!onboardingCompleted) {
    return <Navigate to="/account" replace />
  }

  return <Outlet />
}
