// useVerifyEmail.ts — Thin bridge between VerifyEmailPage and the verify email slice
//
// Responsibilities:
//   1. Dispatch verifyCodeThunk with code + t()
//   2. Read ?returnTo= from URL, sanitize it, navigate there on success
//   3. Expose verifyEmailState and verifyCode action to the page
//   4. Expose sendVerificationCodeStore (secondsRemaining, resendCooldown, sendCode)
//   5. Reset slice state on unmount
//   6. Bounce already-verified tenants back to /account (direct visit or stale back-nav)

import { useEffect }                       from 'react'
import { useDispatch, useSelector }        from 'react-redux'
import { useNavigate, useSearchParams }    from 'react-router-dom'
import { useTranslation }                  from 'react-i18next'
import type { RootState, AppDispatch }     from '@/shared/store/store'
import { useTenantAuthStore }              from '@/apps/landingapp/common/tenant_auth.store'
import { useSendVerificationCodeStore }    from '@/apps/landingapp/common/store/sendVerificationCode.store'
import { verifyCodeThunk, resetVerifyEmail } from '../store/verify-email.slice'

export function useVerifyEmail() {
  const dispatch          = useDispatch<AppDispatch>()
  const navigate          = useNavigate()
  const [searchParams]    = useSearchParams()
  const { t }             = useTranslation('auth')

  const verifyEmailState  = useSelector((state: RootState) => state.verifyEmail)
  const senderStore       = useSendVerificationCodeStore()
  const emailVerified     = useTenantAuthStore(s => s.session?.emailVerified)

  // Sanitize returnTo — only allow relative paths, block open redirects
  const raw      = searchParams.get('returnTo')
  const returnTo = raw?.startsWith('/') && !raw.startsWith('//')
    ? raw
    : '/account'

  // Already verified — direct visit or stale back-navigation. Bounce to /account
  // with replace so this page never sits in browser history once verified.
  useEffect(() => {
    if (emailVerified) {
      navigate('/account', { replace: true })
    }
  }, [emailVerified, navigate])

  // Navigate on success — equivalent to BlocListener reacting to VerifyEmailSuccess
  useEffect(() => {
    if (verifyEmailState.status === 'success') {
      navigate(returnTo)
    }
  }, [verifyEmailState.status, navigate, returnTo])

  // Reset both slice and sender store on unmount so stale state
  // (and any running timers) never leak into the next visit.
  useEffect(() => {
    return () => {
      dispatch(resetVerifyEmail())
      senderStore.reset()
    }
  }, [dispatch])

  const verifyCode = (code: string) => {
    dispatch(verifyCodeThunk({ code, t }))
  }

  return {
    verifyEmailState,  // from Redux slice — drives verify button + error message
    verifyCode,        // call with the 6-digit code string
    senderStore,       // { state, secondsRemaining, resendCooldown, sendCode, reset }
  }
}
