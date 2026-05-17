// useLogin.ts — Tenant login form logic and API submission
//
// Responsibilities:
//   1. Submit credentials to the login API
//   2. On success  → store the token, populate the session, redirect
//   3. On 401      → show invalid credentials message
//   4. On 403      → detect the exact forbidden code and show a specific message
//   5. On network  → show network error message
//   6. On other    → show generic fallback message

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getErrorMessage } from '@/shared/utils/api.utils'
import { setToken } from '@/shared/utils/token'
import { API_ERROR_CODES } from '@/shared/types/api.types'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'
import { loginApi } from '../services/login.api'
import {
  LOGIN_FORBIDDEN_CODES,
  type LoginFormValues,
} from '../types/login.types'

interface UseLoginReturn {
  isLoading: boolean
  error:     string | null
  login:     (values: LoginFormValues) => Promise<void>
}

export function useLogin(): UseLoginReturn {
  const navigate = useNavigate()
  const { t }    = useTranslation('auth')
  const setAuth  = useTenantAuthStore((s) => s.setAuth)

  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  async function login(values: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    const { data: result } = await loginApi.login({
      email:      values.email.trim().toLowerCase(),
      password:   values.password,
      rememberMe: values.rememberMe,
      deviceInfo: navigator.userAgent,
    })

    if (result.success) {
      setToken('tenant', result.data.accessToken)
      setAuth({
        tenantId:     result.data.tenantId,
        email:        result.data.email,
        tenantStatus: result.data.tenantStatus,
      })
      navigate('/dashboard')
    } else {
      const { error: apiError } = result

      if (apiError.kind === 'application') {
        const code = apiError.response.errorCode

        // 401 — invalid credentials (backend returns generic message to prevent enumeration)
        if (code === API_ERROR_CODES.UNAUTHORIZED) {
          setError(t('login.errors.invalidCredentials'))

        // 403 — credentials valid but access blocked; show specific reason
        } else if (code === API_ERROR_CODES.FORBIDDEN) {
          switch (apiError.response.errorCode) {
            case LOGIN_FORBIDDEN_CODES.AccountLocked:
              // Backend localizes and interpolates the remaining minutes server-side
              setError(apiError.response.errorMessage)
              break
            case LOGIN_FORBIDDEN_CODES.TenantSuspended:
              setError(t('login.errors.suspended'))
              break
            case LOGIN_FORBIDDEN_CODES.TenantCancelled:
              setError(t('login.errors.cancelled'))
              break
            default:
              setError(t('login.errors.generic'))
          }
        } else {
          setError(t('login.errors.generic'))
        }
      } else {
        // Network or unknown error
        setError(getErrorMessage(apiError, t('login.errors.networkError')))
      }
    }
    setIsLoading(false)
  }

  return { isLoading, error, login }
}
