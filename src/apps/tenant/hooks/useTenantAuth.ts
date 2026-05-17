// useTenantAuth.ts — Bootstraps the tenant auth state on app load by
// attempting a silent token refresh via the httpOnly cookie.
// On success: stores the new access token and populates the session store.
// On failure: clears the session — user will be redirected to /login by AuthGuard.

import { useEffect, useState } from 'react'
import { tenantClient } from '@/apps/landingapp/common/tenantClient'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'
import { setToken } from '@/shared/utils/token'
import type { LoginResponse } from '@/apps/landingapp/login/types/login.types'
import type { ApiResult } from '@/shared/types/api.types'

export function useTenantAuth() {
  const { setAuth, clearAuth } = useTenantAuthStore()
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    tenantClient
      .post<ApiResult<LoginResponse>>('/api/v1/tenant-auth/refresh')
      .then(({ data: result }) => {
        if (result.success) {
          setToken('tenant', result.data.accessToken)
          setAuth(result.data)
        } else {
          clearAuth()
        }
      })
      .catch(() => clearAuth())
      .finally(() => setIsBootstrapping(false))
  }, [setAuth, clearAuth])

  return { isBootstrapping }
}
