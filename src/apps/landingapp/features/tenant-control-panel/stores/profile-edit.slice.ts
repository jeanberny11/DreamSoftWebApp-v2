// profile-edit.slice.ts — Redux Toolkit slice for the profile edit feature
//
// Equivalent to a Cubit/Bloc in flutter_bloc:
//   profileEditThunk.pending   → emit(loading)
//   profileEditThunk.fulfilled → emit(success)
//   profileEditThunk.rejected  → emit(error, message, fieldErrors)
//   reset                      → emit(initial)
//
// The PUT /TenantProfile endpoint returns 204 No Content — there is no
// response body to read on success. Instead, the tenant auth session is
// patched directly from the submitted form values, and profile.store
// (Zustand) is reset so the view page re-fetches fresh data next time it
// mounts. The backend always sets OnboardingCompleted = true on edit
// (EditTenantProfileCommandHandler), so that's patched unconditionally too.

import { createSlice, createAsyncThunk }        from '@reduxjs/toolkit'
import { getErrorMessage, getFirstFieldErrors } from '@/shared/utils/api.utils'
import { useTenantAuthStore }                   from '@/apps/landingapp/common/tenant_auth.store'
import { useProfileStore }                      from '../stores/profile.store'
import { profileService }                       from '../services/profile.service'
import type { FormValues, UpdateProfileRequest } from '../types/profile.types'
import type { ProfileEditState }                from './profile-edit.state'

// ── Thunk types ───────────────────────────────────────────────────────────────

interface ProfileEditThunkArg {
  values: FormValues
  t:      (key: string) => string
}

interface ProfileEditThunkError {
  message:     string
  fieldErrors: Record<string, string> | null
}

// ── Async thunk ──────────────────────────────────────────────────────────────

export const profileEditThunk = createAsyncThunk<
  void,
  ProfileEditThunkArg,
  { rejectValue: ProfileEditThunkError }
>(
  'profileEdit/submit',
  async ({ values, t }, { rejectWithValue }) => {
    // Country/Province/Municipality/Language are validated as required+positive
    // by the Yup schema before onSubmit ever fires, so the non-null assertions
    // here are safe — Formik guarantees this thunk only runs on a valid form.
    const body: UpdateProfileRequest = {
      firstName:      values.firstName.trim(),
      lastName:       values.lastName.trim(),
      companyName:    values.companyName.trim(),
      phone:          values.phone.trim(),
      website:        values.website?.trim() || null,
      addressLine1:   values.addressLine1.trim(),
      addressLine2:   values.addressLine2?.trim() || null,
      countryId:      values.countryId!,
      provinceId:     values.provinceId!,
      municipalityId: values.municipalityId!,
      postalCode:     values.postalCode?.trim() || null,
      languageId:     values.languageId!,
    }

    const { data: result } = await profileService.updateProfile(body)

    if (result.success) {
      // 204 No Content — no response body. Patch the session from the
      // values we just submitted instead of re-fetching.
      useTenantAuthStore.getState().patchSession({
        firstName:           body.firstName,
        lastName:            body.lastName,
        onboardingCompleted: true,
      })

      // Force the view page to re-fetch fresh data next time it mounts.
      useProfileStore.getState().reset()
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
        message:     t('edit.errors.generic'),
        fieldErrors: null,
      })
    }

    return rejectWithValue({
      message:     getErrorMessage(apiError, t('edit.errors.networkError')),
      fieldErrors: null,
    })
  }
)

// ── Slice ────────────────────────────────────────────────────────────────────

const profileEditSlice = createSlice({
  name: 'profileEdit',
  initialState: { status: 'initial' } as ProfileEditState,

  reducers: {
    reset: () => ({ status: 'initial' } as ProfileEditState),
  },

  extraReducers: (builder) => {
    builder
      .addCase(profileEditThunk.pending, () => ({
        status: 'loading',
      } as ProfileEditState))

      .addCase(profileEditThunk.fulfilled, () => ({
        status: 'success',
      } as ProfileEditState))

      .addCase(profileEditThunk.rejected, (_, action) => ({
        status:      'error',
        message:     action.payload?.message     ?? '',
        fieldErrors: action.payload?.fieldErrors ?? null,
      } as ProfileEditState))
  },
})

export const { reset: resetProfileEdit } = profileEditSlice.actions
export default profileEditSlice.reducer
