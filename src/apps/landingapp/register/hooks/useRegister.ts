// useRegister.ts — Registration form logic and API submission

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getErrorMessage, getFirstFieldErrors } from '@/shared/utils/api.utils'
import { setToken } from '@/shared/utils/token'
import { useTenantAuthStore } from '@/apps/landingapp/common/tenant_auth.store'
import type { RegisterRequest } from '../types/register.types'
import { registerApi } from '../services/register.api'

interface UseRegisterReturn {
  isLoading:   boolean
  error:       string | null
  fieldErrors: Record<string, string> | null
  register:    (data: RegisterRequest) => Promise<Record<string, string> | null>
}

export function useRegister(): UseRegisterReturn {
  const navigate = useNavigate()
  const { t }    = useTranslation('auth')
  const setAuth  = useTenantAuthStore((s) => s.setAuth)

  const [isLoading,   setIsLoading]   = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null)

  async function register(data: RegisterRequest): Promise<Record<string, string> | null> {
    setIsLoading(true)
    setError(null)
    setFieldErrors(null)

    const { data: result } = await registerApi.register(data)

    if (result.success) {
      setToken('tenant', result.data.accessToken)
      setAuth({
        tenantId:     result.data.tenantId,
        email:        result.data.email,
        tenantStatus: result.data.tenantStatus,
      })
      setIsLoading(false)
      navigate('/dashboard')
      return null
    }

    const { error: apiError } = result

    // Validation errors — surface field-level messages back into the form
    if (apiError.kind === 'validation') {
      const errors = getFirstFieldErrors(apiError)
      setFieldErrors(errors)
      // Also set the general banner to the API's validation summary message
      setError(apiError.response.errorMessage)
      setIsLoading(false)
      return errors
    }

    // Application / network / unknown — single banner message
    setError(getErrorMessage(apiError, t('register.errors.networkError')))
    setIsLoading(false)
    return null
  }

  return { isLoading, error, fieldErrors, register }
}
