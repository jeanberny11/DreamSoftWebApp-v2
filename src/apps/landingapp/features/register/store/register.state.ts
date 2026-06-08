// register.state.ts — Discriminated union state for the register feature
//
// Mirrors the flutter_bloc pattern:
//   RegisterInitial  → { status: 'initial' }
//   RegisterLoading  → { status: 'loading' }
//   RegisterSuccess  → { status: 'success' }
//   RegisterError    → { status: 'error', message, fieldErrors }
//
// fieldErrors is included on the error variant (unlike login) because the
// register API returns field-level validation errors from FluentValidation.

export type RegisterState =
  | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors: Record<string, string> | null }
