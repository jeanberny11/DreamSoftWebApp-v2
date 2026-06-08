// login.state.ts — Discriminated union state for the login feature
//
// Mirrors the flutter_bloc pattern:
//   LoginInitial  → { status: 'initial' }
//   LoginLoading  → { status: 'loading', message }
//   LoginSuccess  → { status: 'success' }
//   LoginError    → { status: 'error',   message }
//
// Session data on success is NOT stored here — it lives in
// useTenantAuthStore (Zustand) exactly as before.

export type LoginStatus = 'initial' | 'loading' | 'success' | 'error'

export type LoginState =
  | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error';   message: string }
