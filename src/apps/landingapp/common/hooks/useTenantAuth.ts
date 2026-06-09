// useTenantAuth.ts — Bootstraps the tenant auth state on app load by
// attempting a silent token refresh via the httpOnly cookie.
// On success: stores the new access token and populates the session store.
// On failure: clears the session — user will be redirected to /login by AuthGuard.

import { useEffect, useState } from "react";
import { tenantRefreshClient } from "@/apps/landingapp/common/api/tenantClient";
import { useTenantAuthStore } from "@/apps/landingapp/common/tenant_auth.store";
import { setToken, clearToken } from "@/shared/utils/token";
import type { LoginResponse } from "@/apps/landingapp/features/login/types/login.types";

export function useTenantAuth() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    tenantRefreshClient
      .post<LoginResponse>("/api/v1/tenant-auth/refresh")
      .then(({ data }) => {
        setToken("tenant", data.accessToken);
        useTenantAuthStore.getState().setAuth(data);
      })
      .catch((error) => {
        console.error("Tenant auth refresh failed:", error);
        clearToken("tenant");
        useTenantAuthStore.getState().clearAuth();
      })
      .finally(() => {
        setIsBootstrapping(false);
      });
  }, []);

  return { isBootstrapping };
}
