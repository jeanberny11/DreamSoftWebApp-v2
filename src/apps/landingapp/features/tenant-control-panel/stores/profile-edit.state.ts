// profile-edit.state.ts — Discriminated union state for the profile edit feature
//
// Mirrors register.state.ts exactly — "BLoC equivalent" for the edit form.
// fieldErrors is included on the error variant because the backend's
// EditTenantProfileCommandValidator returns field-level FluentValidation errors.

export type ProfileEditState =
  | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors: Record<string, string> | null }
