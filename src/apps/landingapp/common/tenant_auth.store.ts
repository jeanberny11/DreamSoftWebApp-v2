// tenant_auth.store.ts — Zustand store for the authenticated tenant session.
// Holds the identity/business data returned by the login and refresh endpoints.
// The access token is NOT stored here — it lives in memory via token.ts.

import { create } from 'zustand'

// The session shape holds only the identity/business data the UI needs.
// It is used as the setAuth parameter so the store is decoupled from any
// specific API response type.
export interface TenantSession {
  tenantId:     number
  email:        string
  firstName:    string
  lastName:     string
  logoUrl:      string
  tenantStatus: string
}

interface TenantAuthStore {
  session:         TenantSession | null
  isAuthenticated: boolean
  setAuth:         (data: TenantSession) => void
  clearAuth:       () => void
}

export const useTenantAuthStore = create<TenantAuthStore>((set) => ({
  session:         null,
  isAuthenticated: false,

  setAuth: (data) => set({
    isAuthenticated: true,
    session: {
      tenantId:     data.tenantId,
      email:        data.email,
      firstName:    data.firstName,
      lastName:     data.lastName,
      logoUrl:      data.logoUrl,
      tenantStatus: data.tenantStatus,
    },
  }),

  clearAuth: () => set({
    session:         null,
    isAuthenticated: false,
  }),
}))
