// login.slice.ts — Redux Toolkit slice for the login feature
//
// Equivalent to AuthCubit in flutter_bloc:
//   loginThunk.pending   → emit(LoginLoading())
//   loginThunk.fulfilled → emit(LoginSuccess())
//   loginThunk.rejected  → emit(LoginError(message))
//   reset                → emit(LoginInitial())
//
// All error-handling logic that previously lived in useLogin.ts
// now lives here in the thunk, keeping the hook a thin bridge.

import { createSlice, createAsyncThunk }  from '@reduxjs/toolkit'
import { setToken }                        from '@/shared/utils/token'
import { getErrorMessage }                 from '@/shared/utils/api.utils'
import { API_ERROR_CODES }                 from '@/shared/types/api.types'
import { useTenantAuthStore }              from '@/apps/landingapp/common/tenant_auth.store'
import { loginApi }                        from '../services/login.api'
import { LOGIN_FORBIDDEN_CODES }           from '../types/login.types'
import type { LoginFormValues }            from '../types/login.types'
import type { LoginState }                 from './login.state'

// ── Thunk payload ─────────────────────────────────────────────────────────────

interface LoginThunkArg {
  values: LoginFormValues
  t:      (key: string) => string   // passed in so the slice stays i18n-aware
}

// ── Async thunk — equivalent to void login() in the Cubit ────────────────────

export const loginThunk = createAsyncThunk<
  void,           // fulfilled payload  (session goes to Zustand, nothing returned)
  LoginThunkArg,  // argument
  { rejectValue: string }  // rejected payload carries the translated error message
>(
  'login/submit',
  async ({ values, t }, { rejectWithValue }) => {
    const { data: result } = await loginApi.login({
      email:      values.email.trim().toLowerCase(),
      password:   values.password,
      rememberMe: values.rememberMe,
      deviceInfo: navigator.userAgent,
    })

    if (result.success) {
      // Store token + populate Zustand session — identical to the old hook
      setToken('tenant', result.data.accessToken)
      useTenantAuthStore.getState().setAuth({
        tenantId:     result.data.tenantId,
        email:        result.data.email,
        tenantStatus: result.data.tenantStatus,
      })
      return  // fulfilled — LoginSuccess
    }

    // ── Error resolution (mirrors old useLogin.ts logic exactly) ─────────────
    const { error: apiError } = result

    if (apiError.kind === 'application') {
      const code = apiError.response.errorCode

      if (code === API_ERROR_CODES.UNAUTHORIZED) {
        return rejectWithValue(t('login.errors.invalidCredentials'))
      }

      if (code === API_ERROR_CODES.FORBIDDEN) {
        switch (apiError.response.errorCode) {
          case LOGIN_FORBIDDEN_CODES.AccountLocked:
            return rejectWithValue(apiError.response.errorMessage)
          case LOGIN_FORBIDDEN_CODES.TenantSuspended:
            return rejectWithValue(t('login.errors.suspended'))
          case LOGIN_FORBIDDEN_CODES.TenantCancelled:
            return rejectWithValue(t('login.errors.cancelled'))
          default:
            return rejectWithValue(t('login.errors.generic'))
        }
      }

      return rejectWithValue(t('login.errors.generic'))
    }

    // Network or unknown error
    return rejectWithValue(
      getErrorMessage(apiError, t('login.errors.networkError'))
    )
  }
)

// ── Slice — equivalent to the Cubit class ────────────────────────────────────

const loginSlice = createSlice({
  name: 'login',
  initialState: { status: 'initial' } as LoginState,

  reducers: {
    // Resets back to initial — call on unmount or after navigation
    reset: () => ({ status: 'initial' } as LoginState),
  },

  extraReducers: (builder) => {
    builder
      // emit(LoginLoading())
      .addCase(loginThunk.pending, () => ({
        status:  'loading',// message shown in UI comes from the t() in the hook
      } as LoginState))

      // emit(LoginSuccess())
      .addCase(loginThunk.fulfilled, () => ({
        status: 'success',
      } as LoginState))

      // emit(LoginError(message))
      .addCase(loginThunk.rejected, (_, action) => ({
        status:  'error',
        message: action.payload ?? '',
      } as LoginState))
  },
})

export const { reset: resetLogin } = loginSlice.actions
export default loginSlice.reducer
