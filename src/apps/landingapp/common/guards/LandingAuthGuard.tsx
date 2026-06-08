// LandingAuthGuard — blocks unauthenticated users from protected landing routes
// If the user is not logged in, redirect them to the login page.

import { Navigate, Outlet } from 'react-router-dom'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'

export function LandingAuthGuard() {
  const isAuthenticated = useTenantAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
