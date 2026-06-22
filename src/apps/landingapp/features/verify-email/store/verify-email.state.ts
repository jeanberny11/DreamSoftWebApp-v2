// verify-email.state.ts — Discriminated union state for the verify email feature
//
// Mirrors the flutter_bloc pattern:
//   VerifyEmailInitial → { status: 'initial' }
//   VerifyEmailLoading → { status: 'loading' }
//   VerifyEmailSuccess → { status: 'success' }
//   VerifyEmailError   → { status: 'error', message }

export type VerifyEmailState =
  | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; message: string }
