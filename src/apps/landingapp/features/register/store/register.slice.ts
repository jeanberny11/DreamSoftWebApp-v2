// register.slice.ts — Redux Toolkit slice for the register feature
//
// Equivalent to AuthCubit in flutter_bloc:
//   registerThunk.pending   → emit(RegisterLoading())
//   registerThunk.fulfilled → emit(RegisterSuccess())
//   registerThunk.rejected  → emit(RegisterError(message, fieldErrors))
//   reset                   → emit(RegisterInitial())
//
// All error-handling logic lives here in the thunk, keeping the hook a thin bridge.

import { createSlice, createAsyncThunk }  from '@reduxjs/toolkit'
import { setToken }                        from '@/shared/utils/token'
import { getErrorMessage, getFirstFieldErrors } from '@/shared/utils/api.utils'
import { useTenantAuthStore }              from '@/apps/landingapp/common/tenant_auth.store'
import { registerApi }                     from '../services/register.api'
import type { FormValues }                 from '../types/register.types'
import type { RegisterState }              from './register.state'

const TERMS_VERSION = '1.0'

// ── Thunk types ───────────────────────────────────────────────────────────────

interface RegisterThunkArg {
  values: FormValues
  t:      (key: string) => string
}

interface RegisterThunkError {
  message:     string
  fieldErrors: Record<string, string> | null
}

// ── Async thunk — equivalent to void register() in the Cubit ─────────────────

export const registerThunk = createAsyncThunk<
  void,
  RegisterThunkArg,
  { rejectValue: RegisterThunkError }
>(
  'register/submit',
  async ({ values, t }, { rejectWithValue }) => {
    const { data: result } = await registerApi.register({
      firstName:    values.firstName.trim(),
      lastName:     values.lastName.trim(),
      companyName:  values.companyName.trim(),
      email:        values.email.trim(),
      password:     values.password,
      termsVersion: TERMS_VERSION,
      acceptTerms:  values.acceptTerms,
    })

    if (result.success) {
      setToken('tenant', result.data.accessToken)
      useTenantAuthStore.getState().setAuth({
        tenantId:            result.data.tenantId,
        email:               result.data.email,
        firstName:           result.data.firstName,
        lastName:            result.data.lastName,
        logoUrl:             result.data.logoUrl,
        tenantStatusCode:    result.data.tenantStatusCode,
        emailVerified:       result.data.emailVerified,
        onboardingCompleted: result.data.onboardingCompleted,
      })
      return
    }

    const { error: apiError } = result

    if (apiError.kind === 'validation') {
      return rejectWithValue({
        message:     apiError.response.errorMessage,
        fieldErrors: getFirstFieldErrors(apiError),
      })
    }

    if (apiError.kind === 'application') {
      return rejectWithValue({
        message:     t('register.errors.generic'),
        fieldErrors: null,
      })
    }

    return rejectWithValue({
      message:     getErrorMessage(apiError, t('register.errors.networkError')),
      fieldErrors: null,
    })
  }
)

// ── Slice — equivalent to the Cubit class ────────────────────────────────────

const registerSlice = createSlice({
  name: 'register',
  initialState: { status: 'initial' } as RegisterState,

  reducers: {
    reset: () => ({ status: 'initial' } as RegisterState),
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending,   () => ({
        status: 'loading',
      } as RegisterState))

      .addCase(registerThunk.fulfilled, () => ({
        status: 'success',
      } as RegisterState))

      .addCase(registerThunk.rejected,  (_, action) => ({
        status:      'error',
        message:     action.payload?.message     ?? '',
        fieldErrors: action.payload?.fieldErrors ?? null,
      } as RegisterState))
  },
})

export const { reset: resetRegister } = registerSlice.actions
export default registerSlice.reducer
