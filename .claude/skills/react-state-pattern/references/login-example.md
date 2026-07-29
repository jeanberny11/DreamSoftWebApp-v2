# Login Feature — Canonical Pattern A Example

The login feature is the reference implementation of Pattern A (Redux Toolkit + Formik + Yup).
When in doubt about how to apply the pattern, look at these files first.

---

## File map

```
src/apps/landingapp/login/
├── store/
│   ├── login.state.ts     (discriminated union)
│   └── login.slice.ts     (thunk + slice — all business logic)
├── hooks/
│   └── useLogin.ts        (thin bridge — dispatches only)
├── pages/
│   └── LoginPage.tsx      (switches on status)
├── services/
│   └── login.api.ts       (untouched)
├── types/
│   └── login.types.ts     (untouched)
└── utils/
    └── login.schema.ts    (untouched)

src/shared/store/
└── store.ts               (login slice registered here)
```

---

## State type

```ts
export type LoginState =
  | { status: 'initial' }
  | { status: 'loading'; message: string }
  | { status: 'success' }
  | { status: 'error';   message: string }
```

success has no payload. The session is written to useTenantAuthStore (Zustand)
inside the thunk. Navigation happens in the hook via useEffect.

---

## Key decisions made in this feature

### Error handling location
All error code mapping (UNAUTHORIZED, FORBIDDEN, LOGIN_FORBIDDEN_CODES) lives in
login.slice.ts inside the thunk. The hook has zero error logic.

### i18n
t is passed as part of the thunk argument { values, t } so the slice stays
i18n-aware without importing hooks directly (hooks cannot run outside React components).

### Navigation
navigate('/dashboard') lives in useLogin.ts inside a useEffect that watches
loginState.status === 'success'. This mirrors BlocListener in Flutter.

### Session data
On success the thunk calls useTenantAuthStore.getState().setAuth(...) directly.
Accessing Zustand outside React via .getState() is safe and intentional.
The Redux slice itself stays clean and carries no session data.

### Unmount reset
useLogin.ts dispatches resetLogin() on unmount so navigating back to the login
page always shows a clean initial state, never a stale error or success.

### Hook return
useLogin.ts returns only { loginState, login } — nothing else.
Never return derived booleans like isLoading or error from the hook.
The page reads directly from loginState.status — it is the single source of truth.

### Page structure
LoginPage.tsx renders the success state outside Formik (no form needed).
initial, loading, and error all render the same Formik form.
The page checks loginState.status === 'loading' directly on every field and button.
The page checks loginState.status === 'error' directly to show the error banner.
The error message comes from loginState.message — never from a derived variable.
Static display text like loading button label is handled in the view via t() directly,
not stored in the state, since it never changes based on server data.
