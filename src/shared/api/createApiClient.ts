// createApiClient.ts — Factory that produces a context-aware Axios instance.
// Each app context gets its own token slot, refresh endpoint,
// clearAuth action, and redirect path on session expiry.
// All shared logic (error parsing, ApiResult wrapping, refresh queue)
// lives here once and is reused across every client instance.

import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import i18n from '@/shared/i18n/config'
import { getToken, setToken, clearToken, type TokenContext } from '@/shared/utils/token'
import { parseAxiosError } from '@/shared/utils/api.utils'
import type { ApiResult } from '@/shared/types/api.types'

export interface ApiClientConfig {
  context:         TokenContext  // which in-memory token slot to use
  refreshEndpoint: string        // POST endpoint to call on 401
  loginPath:       string        // redirect target when refresh fails
  clearAuth:       () => void    // store action to call on session expiry
}

export function createApiClient(config: ApiClientConfig) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

  const client = axios.create({
    baseURL:         BASE_URL,
    withCredentials: true,
    headers:         { 'Content-Type': 'application/json' },
  })

  // ── Request interceptor ──────────────────────────────────────────────────
  client.interceptors.request.use((req: InternalAxiosRequestConfig) => {
    const token = getToken(config.context)
    if (token) req.headers.Authorization = `Bearer ${token}`
    req.headers['Accept-Language'] = i18n.language ?? 'es'
    return req
  })

  // ── Response interceptor ─────────────────────────────────────────────────
  let isRefreshing = false
  let failedQueue: Array<{
    resolve: (token: string) => void
    reject:  (err: unknown)  => void
  }> = []

  function processQueue(error: unknown, token: string | null) {
    failedQueue.forEach(({ resolve, reject }) =>
      error ? reject(error) : resolve(token!)
    )
    failedQueue = []
  }

  client.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse<ApiResult<unknown>> => {
      response.data = { success: true, data: response.data } satisfies ApiResult<unknown>
      return response
    },

    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                resolve(client(originalRequest))
              },
              reject,
            })
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const { data } = await client.post<{ accessToken: string }>(config.refreshEndpoint)
          const newToken = (data as unknown as { data: { accessToken: string } }).data.accessToken
          setToken(config.context, newToken)
          processQueue(null, newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return client(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          clearToken(config.context)
          config.clearAuth()
          window.location.href = config.loginPath
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      const apiError = parseAxiosError(error)
      const result: ApiResult<never> = { success: false, error: apiError }
      return Promise.resolve({ data: result })
    }
  )

  return client
}
