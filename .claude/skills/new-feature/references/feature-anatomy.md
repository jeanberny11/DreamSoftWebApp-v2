# Feature Anatomy Reference

Complete folder structure and file templates for a DreamSoft WebApp feature.
Based on the `login` and `register` features in `apps/landingapp/`.

---

## Folder Structure

```
src/apps/<app>/features/<feature>/
├── components/          ← Reusable UI pieces for this feature (empty to start)
├── pages/               ← Full page views
│   └── <Feature>Page.tsx
├── hooks/               ← Feature hooks
│   └── use<Feature>.ts
├── services/            ← API client calls
│   └── <feature>.service.ts    (only if feature makes API calls)
├── store/               ← Redux slice (landingapp) — only if form-flow state needed
│   ├── <feature>.slice.ts
│   └── <feature>.state.ts
├── stores/              ← Zustand stores (tenant) — only if form-flow state needed
│   ├── <feature>.slice.ts
│   └── <feature>.state.ts
├── styles/              ← CSS files (empty to start — filled by stitch-to-code skill)
├── types/               ← TypeScript interfaces and types
│   └── <feature>.types.ts
└── utils/               ← Helpers, schemas, formatters
    └── <feature>.schema.ts     (only if feature has forms with validation)
```

> `store/` is used in `landingapp`; `stores/` is used in `tenant`. Never mix them.

---

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Feature folder | `kebab-case` | `forgot-password` |
| File names | `<feature>.<role>.ts` | `customers.service.ts` |
| Page component | `<Feature>Page.tsx` (PascalCase) | `CustomersPage.tsx` |
| Hook | `use<Feature>.ts` (camelCase) | `useCustomers.ts` |
| CSS file | `<feature>.css` (kebab-case) | `customers.css` |
| Redux slice export | `reset<Feature>` | `resetCustomers` |
| Redux reducer key | camelCase feature name | `customers` |

---

## File Templates

### `pages/<Feature>Page.tsx`

```tsx
// <Feature>Page.tsx — <Feature> page
import { useTranslation } from 'react-i18next'
import { use<Feature> }   from '../hooks/use<Feature>'
import '../styles/<feature>.css'

export function <Feature>Page() {
  const { t } = useTranslation('<namespace>')

  return (
    <div className="<feature>-page">
      <h1>{t('<feature>.title')}</h1>
    </div>
  )
}
```

---

### `hooks/use<Feature>.ts`

```ts
// use<Feature>.ts — Thin bridge between <Feature>Page and the <feature> slice
//
// Responsibilities:
//   1. Dispatch thunks with form values + t()
//   2. Navigate on success (if applicable)
//   3. Expose state and actions to the page
//   4. Reset slice state on unmount

import { useEffect }          from 'react'
import { useDispatch,
         useSelector }        from 'react-redux'
import { useNavigate }        from 'react-router-dom'
import { useTranslation }     from 'react-i18next'
import type { RootState,
              AppDispatch }   from '@/shared/store/store'
import { reset<Feature> }     from '../store/<feature>.slice'

export function use<Feature>() {
  const dispatch        = useDispatch<AppDispatch>()
  const navigate        = useNavigate()
  const { t }           = useTranslation('<namespace>')
  const <feature>State  = useSelector((state: RootState) => state.<feature>)

  // Navigate on success
  useEffect(() => {
    if (<feature>State.status === 'success') {
      navigate('/<destination>')
    }
  }, [<feature>State.status, navigate])

  // Reset slice on unmount
  useEffect(() => {
    return () => { dispatch(reset<Feature>()) }
  }, [dispatch])

  return { <feature>State }
}
```

> If no Redux slice: remove the dispatch/selector/useEffect blocks and use local state or Zustand instead.

---

### `store/<feature>.state.ts`

```ts
// <feature>.state.ts — Discriminated union state for the <feature> feature
//
// Mirrors the flutter_bloc pattern:
//   <Feature>Initial  → { status: 'initial' }
//   <Feature>Loading  → { status: 'loading' }
//   <Feature>Success  → { status: 'success' }
//   <Feature>Error    → { status: 'error', message }

export type <Feature>Status = 'initial' | 'loading' | 'success' | 'error'

export type <Feature>State =
  | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; message: string }
```

---

### `store/<feature>.slice.ts`

```ts
// <feature>.slice.ts — Redux Toolkit slice for the <feature> feature
//
// Equivalent to a Cubit in flutter_bloc:
//   <feature>Thunk.pending   → emit(<Feature>Loading())
//   <feature>Thunk.fulfilled → emit(<Feature>Success())
//   <feature>Thunk.rejected  → emit(<Feature>Error(message))
//   reset                    → emit(<Feature>Initial())

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getErrorMessage }               from '@/shared/utils/api.utils'
import type { <Feature>State }           from './<feature>.state'

interface <Feature>ThunkArg {
  t: (key: string) => string
}

export const <feature>Thunk = createAsyncThunk<
  void,
  <Feature>ThunkArg,
  { rejectValue: string }
>(
  '<feature>/submit',
  async ({ t }, { rejectWithValue }) => {
    // TODO: call the service here
    // const { data: result } = await <feature>Api.<action>(...)
    // if (result.success) return
    // return rejectWithValue(t('<feature>.errors.generic'))
  }
)

const <feature>Slice = createSlice({
  name: '<feature>',
  initialState: { status: 'initial' } as <Feature>State,

  reducers: {
    reset: () => ({ status: 'initial' } as <Feature>State),
  },

  extraReducers: (builder) => {
    builder
      .addCase(<feature>Thunk.pending,   () => ({ status: 'loading' } as <Feature>State))
      .addCase(<feature>Thunk.fulfilled, () => ({ status: 'success' } as <Feature>State))
      .addCase(<feature>Thunk.rejected,  (_, action) => ({
        status:  'error',
        message: action.payload ?? '',
      } as <Feature>State))
  },
})

export const { reset: reset<Feature> } = <feature>Slice.actions
export default <feature>Slice.reducer
```

---

### `types/<feature>.types.ts`

```ts
// <feature>.types.ts — All types for the <feature> feature

// ── API types ─────────────────────────────────────────────────────────────────

export interface <Feature>Request {
  // TODO: add request fields
}

export interface <Feature>Response {
  // TODO: add response fields
}

// ── Form types ────────────────────────────────────────────────────────────────

export interface <Feature>FormValues {
  // TODO: add form fields
}
```

---

### `services/<feature>.service.ts`

```ts
// <feature>.service.ts — <Feature> API calls
//
// Auth: include/exclude based on which client is used:
//   tenantClient  → authenticated tenant routes
//   landingClient → public/landing routes

import { tenantClient }              from '@/apps/landingapp/common/api/tenantClient'
import type { ApiResult }            from '@/shared/types/api.types'
import type { <Feature>Request,
              <Feature>Response }    from '../types/<feature>.types'

export const <feature>Api = {
  // Example:
  // getAll: (): Promise<{ data: ApiResult<<Feature>Response[]> }> =>
  //   tenantClient.get('/api/v1/<feature>'),

  // submit: (body: <Feature>Request): Promise<{ data: ApiResult<<Feature>Response> }> =>
  //   tenantClient.post('/api/v1/<feature>', body),
}
```

---

### `utils/<feature>.schema.ts` (only if feature has forms)

```ts
// <feature>.schema.ts — Yup validation schema for the <feature> form
// Built inside a function so t() is called at runtime,
// making error messages reactive to language changes.

import * as Yup        from 'yup'
import type { TFunction } from 'i18next'

export function build<Feature>Schema(t: TFunction<'<namespace>'>) {
  return Yup.object({
    // TODO: add field validations
    // email: Yup.string().required(t('<feature>.errors.emailRequired')).email(),
  })
}

export type <Feature>Schema = ReturnType<typeof build<Feature>Schema>
```

---

## Store Registration (`src/shared/store/store.ts`)

After creating a Redux slice, register it here:

```ts
// Add import
import <feature>Reducer from '@/apps/<app>/features/<feature>/store/<feature>.slice'

// Add to reducer map
export const store = configureStore({
  reducer: {
    login:     loginReducer,
    register:  registerReducer,
    <feature>: <feature>Reducer,   // ← add this line
  },
})
```

---

## i18n Keys to Create

For every new feature, add at minimum these keys to both `en/` and `es/` locale files
in the appropriate namespace (see `stitch-to-code` skill for namespace selection rules):

```json
{
  "<feature>": {
    "title": "...",
    "errors": {
      "generic": "...",
      "networkError": "..."
    }
  }
}
```
