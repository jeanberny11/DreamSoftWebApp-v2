// AppRouter — detects subdomain at runtime and renders the correct app
// Main domain (dreamsoft.com)        → LandingApp
// Tenant subdomain (*.dreamsoft.com) → TenantApp

import { isTenantSubdomain } from '@/shared/utils/subdomain'
import { LandingApp } from '@/apps/landingapp/routes'
import { TenantApp } from '@/apps/tenant/routes'

export function AppRouter() {
  const isTenant = isTenantSubdomain()
  return isTenant ? <TenantApp /> : <LandingApp />
}
