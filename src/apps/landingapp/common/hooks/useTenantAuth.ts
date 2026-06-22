// useTenantAuth.ts — Bootstraps the tenant auth state on app load by
// attempting a silent token refresh via the httpOnly cookie.
// On success: stores the new access token and fully populates the session store.
// On failure: clears the session — user will be redirected to /login by AuthGuard.

import { useEffect, useState } from "react";
import { tenantRefreshClient } from "@/apps/landingapp/common/api/tenantClient";
import { useTenantAuthStore } from "@/apps/landingapp/common/tenant_auth.store";
import { setToken, clearToken } from "@/shared/utils/token";
import type { RefreshResponse } from "@/apps/landingapp/features/login/types/login.types";

export function useTenantAuth() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    tenantRefreshClient
      .post<RefreshResponse>("/api/v1/tenant-auth/refresh")
      .then(({ data }) => {
        setToken("tenant", data.accessToken);
        useTenantAuthStore.getState().setAuth({
          tenantId:            data.tenantId,
          email:               data.email,
          firstName:           data.firstName,
          lastName:            data.lastName,
          logoUrl:             data.logoUrl,
          tenantStatusCode:    data.tenantStatusCode,
          emailVerified:       data.emailVerified,
          onboardingCompleted: data.onboardingCompleted,
        });
      })
      .catch((error) => {
        const status = error?.response?.status;
        if (status === 401) {
          // Expected — no active session (no cookie or cookie expired)
          console.info("[useTenantAuth] No active session found, proceeding as guest.");
        } else {
          // Unexpected — network error, server down, etc.
          console.error("[useTenantAuth] Token refresh failed unexpectedly:", error);
        }
        clearToken("tenant");
        useTenantAuthStore.getState().clearAuth();
      })
      .finally(() => {
        setIsBootstrapping(false);
      });
  }, []);

  return { isBootstrapping };
}
