// store.ts — Redux root store
//
// Only form-flow slices live here (BLoC equivalent).
// Display/output features continue to use Zustand (Cubit equivalent).
//
// Adding a new form feature:
//   1. Create your slice in its feature/store/ folder
//   2. Import the reducer here and add it to the reducer map

import { configureStore } from '@reduxjs/toolkit'
import loginReducer        from '@/apps/landingapp/login/store/login.slice'

export const store = configureStore({
  reducer: {
    login: loginReducer,
    // register: registerReducer,      ← plug future form slices in here
    // forgotPassword: forgotReducer,
  },
})

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
