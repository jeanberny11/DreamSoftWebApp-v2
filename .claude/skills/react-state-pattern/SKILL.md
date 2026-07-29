---
name: react-state-pattern
description: >
  Use this skill whenever implementing or modifying state management in
  DreamSoftWebApp. Covers two complementary patterns inspired by flutter_bloc:
  (1) Redux Toolkit + Formik + Yup for form/input features (BLoC equivalent),
  and (2) Zustand for display/output features (Cubit equivalent).
  Trigger this skill when the user mentions: adding a new feature, creating a
  store, slice, or hook, refactoring state, implementing a form, handling API
  state, or asking about state management patterns in this project.
---

# React State Pattern — DreamSoftWebApp

Inspired by flutter_bloc. Two tools, each with a clear responsibility.
Never mix them — use the decision rule below every time.

---

## Decision Rule

| Question                              | Answer | Use                      |
|---------------------------------------|--------|--------------------------|
| Am I displaying or listing data?      | Yes    | Zustand (Cubit)          |
| Am I collecting input via a form?     | Yes    | Redux Toolkit (BLoC)     |

Examples:
- User list, invoice list, dashboard data → Zustand
- Login, register, forgot password, checkout form → Redux Toolkit

---

## Pattern A — Redux Toolkit + Formik + Yup (Form features / BLoC equivalent)

### Folder structure

Every form feature gets a store/ subfolder:

```
feature/
├── store/
│   ├── feature.state.ts   (discriminated union type)
│   └── feature.slice.ts   (Redux Toolkit slice — all business logic)
├── hooks/
│   └── useFeature.ts      (thin bridge: dispatches only, no local state)
├── pages/
│   └── FeaturePage.tsx    (switches on status — BlocBuilder equivalent)
├── services/
│   └── feature.api.ts     (API calls only, never touched by state refactors)
├── types/
│   └── feature.types.ts   (request / response / form types)
└── utils/
    └── feature.schema.ts  (Yup validation schema)
```

### 1. State type — feature.state.ts

Always four statuses. Mirror the Flutter pattern exactly:

```ts
export type FeatureState =
  | { status: 'initial' }
  | { status: 'loading'; message: string }
  | { status: 'success' }
  | { status: 'error';   message: string }
```

Rules:
- success carries NO payload. Session or result data goes to Zustand or triggers navigation.
- message on loading can be empty string if no loading text is needed.
- Never add extra fields to initial or success.

### 2. Slice — feature.slice.ts

All business logic lives here. The hook dispatches; it never decides.

```ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { FeatureState }             from './feature.state'
import type { FeatureFormValues }        from '../types/feature.types'

interface ThunkArg {
  values: FeatureFormValues
  t:      (key: string) => string
}

export const featureThunk = createAsyncThunk<void, ThunkArg, { rejectValue: string }>(
  'feature/submit',
  async ({ values, t }, { rejectWithValue }) => {
    const { data: result } = await featureApi.submit(values)

    if (result.success) {
      // Side effects here: setToken, Zustand setAuth, etc.
      return
    }

    const { error } = result
    if (error.kind === 'application') {
      return rejectWithValue(t('feature.errors.generic'))
    }
    return rejectWithValue(getErrorMessage(error, t('feature.errors.networkError')))
  }
)

const featureSlice = createSlice({
  name: 'feature',
  initialState: { status: 'initial' } as FeatureState,
  reducers: {
    reset: () => ({ status: 'initial' } as FeatureState),
  },
  extraReducers: (builder) => {
    builder
      .addCase(featureThunk.pending,   ()          => ({ status: 'loading', message: '' }                 as FeatureState))
      .addCase(featureThunk.fulfilled, ()          => ({ status: 'success' }                              as FeatureState))
      .addCase(featureThunk.rejected,  (_, action) => ({ status: 'error', message: action.payload ?? '' } as FeatureState))
  },
})

export const { reset: resetFeature } = featureSlice.actions
export default featureSlice.reducer
```

### 3. Hook — useFeature.ts

Thin bridge only. No useState, no business logic, no error mapping.

```ts
import { useEffect }                    from 'react'
import { useDispatch, useSelector }     from 'react-redux'
import { useNavigate }                  from 'react-router-dom'
import { useTranslation }               from 'react-i18next'
import type { RootState, AppDispatch }  from '@/shared/store/store'
import { featureThunk, resetFeature }   from '../store/feature.slice'

export function useFeature() {
  const dispatch     = useDispatch<AppDispatch>()
  const navigate     = useNavigate()
  const { t }        = useTranslation('namespace')
  const featureState = useSelector((state: RootState) => state.feature)

  // BlocListener equivalent — react to success
  useEffect(() => {
    if (featureState.status === 'success') navigate('/destination')
  }, [featureState.status, navigate])

  // Reset on unmount — prevent stale state leaking back
  useEffect(() => {
    return () => { dispatch(resetFeature()) }
  }, [dispatch])

  const submit = (values: FeatureFormValues) => {
    dispatch(featureThunk({ values, t }))
  }

  return { featureState, submit }
}
```

### 4. Page — FeaturePage.tsx

Switches on status — BlocBuilder equivalent.

```tsx
export function FeaturePage() {
  const { t }                                      = useTranslation('namespace')
  const { featureState, submit } = useFeature()
  const schema = useMemo(() => buildFeatureSchema(t), [t])

  // Success — brief indicator before navigation
  if (featureState.status === 'success') {
    return <SuccessIndicator message={t('feature.success')} />
  }

  // initial | loading | error — form always visible
  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={submit}>
      {() => (
        <Form>
          {/* Add disabled={featureState.status === 'loading'} to ALL fields */}
          {featureState.status === 'error' && <ErrorBanner message={featureState.message} />}
          <button type="submit" disabled={featureState.status === 'loading'}>
            {featureState.status === 'loading' ? t('feature.submitting') : t('feature.submit')}
          </button>
        </Form>
      )}
    </Formik>
  )
}
```

Page rules:
- success → render outside Formik (no form needed)
- loading → keep form visible, disabled={featureState.status === 'loading'} on ALL fields and button
- error   → keep form visible, show error banner above submit button, message comes from featureState.message
- initial → plain form, no banner

### 5. Register the slice — shared/store/store.ts

```ts
import { configureStore } from '@reduxjs/toolkit'
import loginReducer        from '@/apps/landingapp/login/store/login.slice'
// import newFeatureReducer from '@/apps/.../store/feature.slice'

export const store = configureStore({
  reducer: {
    login: loginReducer,
    // newFeature: newFeatureReducer,
  },
})

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### 6. i18n keys required per form feature

Add to every locale file (en, es, ...):

```json
{
  "featureName": {
    "submit":     "Submit",
    "submitting": "Submitting...",
    "success":    "Done! Redirecting...",
    "errors": {
      "generic":      "Something went wrong. Please try again.",
      "networkError": "Network error. Please check your connection."
    }
  }
}
```

---

## Pattern B — Zustand (Display/output features / Cubit equivalent)

### Folder structure

```
feature/
├── stores/
│   └── feature.store.ts   (Zustand store — note plural folder name)
├── hooks/useFeature.ts
├── components/FeatureList.tsx
├── services/feature.api.ts
└── types/feature.types.ts
```

### Store — feature.store.ts

```ts
import { create } from 'zustand'

type FeatureStoreState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Feature[] }
  | { status: 'error';   message: string }

type FeatureStore = FeatureStoreState & {
  fetchAll: () => Promise<void>
  reset:    () => void
}

export const useFeatureStore = create<FeatureStore>((set) => ({
  status: 'idle',

  fetchAll: async () => {
    set({ status: 'loading' })
    const result = await featureApi.getAll()
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: 'Failed to load.' })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
```

---

## Project-specific conventions

- Token storage   : setToken('tenant', accessToken) from @/shared/utils/token
- Session storage : useTenantAuthStore.getState().setAuth(...) from @/apps/landingapp/common/tenant_auth.store
- Error parsing   : getErrorMessage() from @/shared/utils/api.utils
- Error codes     : API_ERROR_CODES from @/shared/types/api.types
- API responses   : always ApiResult<T> — check result.success before result.data
- HTTP client     : tenantClient from @/apps/landingapp/common/tenantClient
- i18n            : always pass t into the thunk arg — never call t() inside the slice directly
- Folder naming   : form features use store/ (singular), display features use stores/ (plural)

## Reference

- references/login-example.md — fully annotated login feature as the canonical Pattern A example
