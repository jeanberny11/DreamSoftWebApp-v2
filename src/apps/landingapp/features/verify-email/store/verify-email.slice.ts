// verify-email.slice.ts — Redux Toolkit slice for the verify email feature
//
// Equivalent to VerifyEmailCubit in flutter_bloc:
//   verifyCodeThunk.pending   → emit(VerifyEmailLoading())
//   verifyCodeThunk.fulfilled → emit(VerifyEmailSuccess()) + patchSession
//   verifyCodeThunk.rejected  → emit(VerifyEmailError(message))
//   reset                     → emit(VerifyEmailInitial())
//
// The send-code side of this flow is owned by sendVerificationCodeStore (Zustand).
// This slice is only responsible for the verifyCode() call and its resulting state.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getErrorMessage }               from '@/shared/utils/api.utils'
import { useTenantAuthStore }            from '@/apps/landingapp/common/tenant_auth.store'
import { verifyEmailApi }                from '@/apps/landingapp/common/api/verify-email.api'
import type { VerifyEmailState }         from './verify-email.state'

// ── Thunk types ───────────────────────────────────────────────────────────────

interface VerifyCodeThunkArg {
  code: string
  t:    (key: string) => string
}

// ── Async thunk ───────────────────────────────────────────────────────────────

export const verifyCodeThunk = createAsyncThunk<
  void,
  VerifyCodeThunkArg,
  { rejectValue: string }
>(
  'verifyEmail/submit',
  async ({ code, t }, { rejectWithValue }) => {
    const { data: result } = await verifyEmailApi.verifyCode({ code })

    if (result.success) {
      // Patch session so guards and UI reflect the verified state immediately
      useTenantAuthStore.getState().patchSession({ emailVerified: true })
      return  // fulfilled — VerifyEmailSuccess
    }

    const { error: apiError } = result

    if (apiError.kind === 'application') {
      return rejectWithValue(t('verifyEmail.errors.invalidCode'))
    }

    if (apiError.kind === 'validation') {
      return rejectWithValue(getErrorMessage(apiError, t('verifyEmail.errors.invalidCode')))
    }

    // Network or unknown error
    return rejectWithValue(
      getErrorMessage(apiError, t('verifyEmail.errors.networkError'))
    )
  }
)

// ── Slice ─────────────────────────────────────────────────────────────────────

const verifyEmailSlice = createSlice({
  name: 'verifyEmail',
  initialState: { status: 'initial' } as VerifyEmailState,

  reducers: {
    reset: () => ({ status: 'initial' } as VerifyEmailState),
  },

  extraReducers: (builder) => {
    builder
      // emit(VerifyEmailLoading())
      .addCase(verifyCodeThunk.pending, () => ({
        status: 'loading',
      } as VerifyEmailState))

      // emit(VerifyEmailSuccess())
      .addCase(verifyCodeThunk.fulfilled, () => ({
        status: 'success',
      } as VerifyEmailState))

      // emit(VerifyEmailError(message))
      .addCase(verifyCodeThunk.rejected, (_, action) => ({
        status:  'error',
        message: action.payload ?? '',
      } as VerifyEmailState))
  },
})

export const { reset: resetVerifyEmail } = verifyEmailSlice.actions
export default verifyEmailSlice.reducer
