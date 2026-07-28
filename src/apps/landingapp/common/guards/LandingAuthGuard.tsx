// LandingAuthGuard — blocks unauthenticated users from protected landing routes
// If the user is not logged in, redirect them to the login page, remembering
// the URL they were trying to reach (incl. query string) so login can
// round-trip them back — e.g. the checkout deep-link ?planId=&planPriceId=.

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'

export function LandingAuthGuard() {
  const isAuthenticated = useTenantAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    )
  }

  return <Outlet />
}
