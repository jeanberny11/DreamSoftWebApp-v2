// useApi — thin wrapper around Axios calls with loading/error state

import { useState, useCallback } from 'react'
import type { AxiosError } from 'axios'
import type { ApplicationApiError } from '../types/api.types'

interface UseApiResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  execute: (...args: unknown[]) => Promise<T | null>
}

export function useApi<T>(
  fn: (...args: unknown[]) => Promise<{ data: T }>
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fn(...args)
        setData(response.data)
        return response.data
      } catch (err) {
        const axiosError = err as AxiosError<ApplicationApiError>
        const message = axiosError.response?.data?.response.errorMessage ?? 'An unexpected error occurred.'
        setError(message)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [fn]
  )

  return { data, isLoading, error, execute }
}
