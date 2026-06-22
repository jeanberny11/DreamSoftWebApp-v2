// EmailVerifiedGuard — blocks routes that require a verified email
// If the tenant's email is not verified, redirect them back to /account.

import { Navigate, Outlet } from 'react-router-dom'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'

export function EmailVerifiedGuard() {
  const emailVerified = useTenantAuthStore((s) => s.session?.emailVerified)

  if (!emailVerified) {
    return <Navigate to="/account" replace />
  }

  return <Outlet />
}
