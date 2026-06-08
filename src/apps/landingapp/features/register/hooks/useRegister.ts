// useRegister.ts — Thin bridge between RegisterPage and the register slice
//
// Responsibilities:
//   1. Dispatch registerThunk with form values + t()
//   2. Navigate to /dashboard when status reaches 'success'
//   3. Expose registerState and register action to the page
//   4. Reset slice state on unmount

import { useEffect }           from 'react'
import { useDispatch,
         useSelector }         from 'react-redux'
import { useNavigate }         from 'react-router-dom'
import { useTranslation }      from 'react-i18next'
import type { RootState,
              AppDispatch }    from '@/shared/store/store'
import { registerThunk,
         resetRegister }       from '../store/register.slice'
import type { FormValues }     from '../types/register.types'

export function useRegister() {
  const dispatch      = useDispatch<AppDispatch>()
  const navigate      = useNavigate()
  const { t }         = useTranslation('auth')
  const registerState = useSelector((state: RootState) => state.register)

  // Navigate on success — equivalent to BlocListener reacting to RegisterSuccess
  useEffect(() => {
    if (registerState.status === 'success') {
      navigate('/onboarding')
    }
  }, [registerState.status, navigate])

  // Reset slice on unmount so stale state never leaks back
  useEffect(() => {
    return () => { dispatch(resetRegister()) }
  }, [dispatch])

  const register = (values: FormValues) => {
    dispatch(registerThunk({ values, t }))
  }

  return { registerState, register }
}
