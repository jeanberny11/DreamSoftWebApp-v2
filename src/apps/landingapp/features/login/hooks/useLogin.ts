// useLogin.ts — Thin bridge between LoginPage and the login slice
//
// Responsibilities:
//   1. Dispatch loginThunk with form values + t()
//   2. Navigate to /dashboard when status reaches 'success'
//   3. Expose loginState and login action to the page
//   4. Reset slice state on unmount

import { useEffect }            from 'react'
import { useDispatch,
         useSelector }          from 'react-redux'
import { useLocation,
         useNavigate }          from 'react-router-dom'
import { useTranslation }       from 'react-i18next'
import type { RootState,
              AppDispatch }     from '@/shared/store/store'
import { loginThunk,
         resetLogin }           from '../store/login.slice'
import type { LoginFormValues } from '../types/login.types'

export function useLogin() {
  const dispatch   = useDispatch<AppDispatch>()
  const navigate   = useNavigate()
  const location   = useLocation()
  const { t }      = useTranslation('auth')

  const loginState = useSelector((state: RootState) => state.login)

  const from = (location.state as { from?: string } | null)?.from

  // Navigate on success — equivalent to BlocListener reacting to LoginSuccess.
  // Returns the user to the page they were originally heading to (state.from,
  // set by LandingAuthGuard — e.g. the checkout deep-link) or /account by
  // default. replace:true so Back doesn't return to the login form.
  useEffect(() => {
    if (loginState.status === 'success') {
      navigate(from ?? '/account', { replace: true })
    }
  }, [loginState.status, navigate, from])

  // Reset slice on unmount so stale state never leaks back
  useEffect(() => {
    return () => { dispatch(resetLogin()) }
  }, [dispatch])

  const login = (values: LoginFormValues) => {
    dispatch(loginThunk({ values, t }))
  }

  return { loginState, login }
}
