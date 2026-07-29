// store.ts — Redux root store
//
// Only form-flow slices live here (BLoC equivalent).
// Display/output features continue to use Zustand (Cubit equivalent).
//
// Adding a new form feature:
//   1. Create your slice in its feature/store/ folder
//   2. Import the reducer here and add it to the reducer map

import { configureStore } from '@reduxjs/toolkit'
import loginReducer        from '@/apps/landingapp/features/login/store/login.slice'
import registerReducer     from '@/apps/landingapp/features/register/store/register.slice'
import verifyEmailReducer  from '@/apps/landingapp/features/verify-email/store/verify-email.slice'
import profileEditReducer  from '@/apps/landingapp/features/tenant-control-panel/stores/profile-edit.slice'

export const store = configureStore({
  reducer: {
    login:       loginReducer,
    register:    registerReducer,
    verifyEmail: verifyEmailReducer,
    profileEdit: profileEditReducer,
    // forgotPassword: forgotReducer,
  },
})

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
