// tenant_auth.store.ts — Zustand store for the authenticated tenant session.
// Holds the identity/business data returned by the login and refresh endpoints.
// The access token is NOT stored here — it lives in memory via token.ts.

import { create } from 'zustand'

// The session shape holds only the identity/business data the UI needs.
// It is used as the setAuth parameter so the store is decoupled from any
// specific API response type.
export interface TenantSession {
  tenantId:            number
  email:               string
  firstName:           string
  lastName:            string
  logoUrl:             string
  tenantStatusCode:    string   // raw status code — used for guard/routing decisions
  emailVerified:       boolean  // drives EmailVerifiedGuard + profile UI indicator
  onboardingCompleted: boolean  // drives ProfileCompleteGuard + onboarding UI
}

interface TenantAuthStore {
  session:         TenantSession | null
  isAuthenticated: boolean
  setAuth:         (data: TenantSession) => void
  patchSession:    (patch: Partial<TenantSession>) => void
  clearAuth:       () => void
}

export const useTenantAuthStore = create<TenantAuthStore>((set) => ({
  session:         null,
  isAuthenticated: false,

  setAuth: (data) => set({
    isAuthenticated: true,
    session: {
      tenantId:            data.tenantId,
      email:               data.email,
      firstName:           data.firstName,
      lastName:            data.lastName,
      logoUrl:             data.logoUrl,
      tenantStatusCode:    data.tenantStatusCode,
      emailVerified:       data.emailVerified,
      onboardingCompleted: data.onboardingCompleted,
    },
  }),

  // Surgical partial update — used after verify-email or complete-profile
  // to reflect the new status without re-fetching the full session.
  patchSession: (patch) => set((state) => ({
    session: state.session ? { ...state.session, ...patch } : null,
  })),

  clearAuth: () => set({
    session:         null,
    isAuthenticated: false,
  }),
}))
