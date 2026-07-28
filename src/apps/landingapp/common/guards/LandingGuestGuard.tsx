// LandingGuestGuard — blocks authenticated users from guest-only routes
// If the user is already logged in, redirect them to where they originally
// wanted to go (state.from, set by LandingAuthGuard) or /account by default.

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'

export function LandingGuestGuard() {
  const isAuthenticated = useTenantAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={from ?? '/account'} replace />
  }

  return <Outlet />
}
