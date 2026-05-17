// LandingGuestGuard — blocks authenticated users from guest-only routes
// If the user is already logged in, redirect them to the tenant dashboard.

import { Navigate, Outlet } from 'react-router-dom'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'

export function LandingGuestGuard() {
  const isAuthenticated = useTenantAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
