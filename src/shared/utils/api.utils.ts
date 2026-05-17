// api.utils.ts — Shared API error parsing utilities
// Converts raw Axios errors into the normalised AppApiError discriminated union.
// Used across all features — not specific to any single domain.

import { isAxiosError } from 'axios'
import {
  API_ERROR_CODES,
  type AppApiError,
  type ApiErrorResponse,
  type ApiValidationErrorResponse,
} from '@/shared/types/api.types'

// ── Network message resolver ──────────────────────────────────────────────────

/**
 * Maps Axios error codes to human-readable network issue descriptions.
 * These are intentionally kept in English here because they are used as
 * the internal `message` field on NetworkApiError — callers that need
 * a translated version should pass a `networkFallback` to getErrorMessage()
 * and use their own i18n key.
 *
 * Axios error codes: https://axios-http.com/docs/handling_errors
 */
function resolveNetworkMessage(code: string | undefined): string {
  switch (code) {
    case 'ECONNABORTED':
      return 'The request timed out. The server took too long to respond.'
    case 'ERR_NETWORK':
      return 'Network error. Please check your internet connection.'
    case 'ERR_CANCELED':
      return 'The request was cancelled.'
    case 'ERR_BAD_REQUEST':
      return 'The request could not be sent. Please try again.'
    case 'ENOTFOUND':
    case 'EAI_AGAIN':
      return 'Unable to reach the server. Please check your DNS or internet connection.'
    case 'ECONNREFUSED':
      return 'Connection refused. The server may be down or unreachable.'
    case 'ERR_SSL_PROTOCOL_ERROR':
    case 'ERR_CERT_COMMON_NAME_INVALID':
      return 'A secure connection could not be established (SSL error).'
    case 'ERR_INTERNET_DISCONNECTED':
      return 'No internet connection. Please check your network settings.'
    default:
      return 'No response from the server. Please check your connection and try again.'
  }
}

// ── Core parser ───────────────────────────────────────────────────────────────

/**
 * Converts any Axios error into the normalised AppApiError shape.
 * Called by the response interceptor so every failed request
 * is already normalised before it reaches any hook or component.
 */
export function parseAxiosError(error: unknown): AppApiError {
  if (!isAxiosError(error)) {
    // Non-Axios throw (e.g. programming error) — treat as unknown
    return {
      kind:         'unknown',
      statusCode:   0,
      errorMessage: error instanceof Error ? error.message : 'An unexpected error occurred.',
    }
  }

  // No response — network / DNS / timeout / CORS / server completely down
  if (!error.response) {
    return {
      kind:    'network',
      message: resolveNetworkMessage(error.code),
    }
  }

  const { status, data } = error.response

  // Validation error — backend always sets errorCode = 'VALIDATION_ERROR'
  if (
    data &&
    typeof data === 'object' &&
    'errorCode' in data &&
    data.errorCode === API_ERROR_CODES.VALIDATION_ERROR
  ) {
    return {
      kind:     'validation',
      response: data as ApiValidationErrorResponse,
    }
  }

  // Known application error — has our standard ErrorResponse shape
  if (
    data &&
    typeof data === 'object' &&
    'errorCode' in data &&
    'errorMessage' in data
  ) {
    return {
      kind:     'application',
      response: data as ApiErrorResponse,
    }
  }

  // Unknown — response received but body doesn't match any known shape.
  // Surface HTTP status + whatever message we can extract so the user
  // always sees something meaningful (e.g. "HTTP 502 — Bad Gateway")
  const rawMessage =
    (data as Record<string, unknown>)?.title as string ||
    (data as Record<string, unknown>)?.message as string ||
    error.message ||
    'An unexpected error occurred.'

  return {
    kind:         'unknown',
    statusCode:   status,
    errorMessage: `HTTP ${status} — ${rawMessage}`,
  }
}

// ── Field error helpers ───────────────────────────────────────────────────────

/**
 * Extracts field-level errors from a validation error preserving the
 * backend's Record<string, string[]> shape.
 * Returns null for any other error kind.
 *
 * The backend sends PascalCase keys (e.g. "Email", "FirstName").
 * This helper lowercases the first letter so keys match Formik field names
 * (e.g. "email", "firstName") without losing the string[] value structure.
 */
export function getFieldErrors(
  error: AppApiError
): Record<string, string[]> | null {
  if (error.kind !== 'validation') return null

  const raw = error.response.errors
  return Object.fromEntries(
    Object.entries(raw).map(([key, messages]) => [
      key.charAt(0).toLowerCase() + key.slice(1),
      messages,
    ])
  )
}

/**
 * Extracts the first error message per field — useful when a component
 * needs a flat Record<string, string> (e.g. Formik's setErrors).
 * Returns null for any other error kind.
 */
export function getFirstFieldErrors(
  error: AppApiError
): Record<string, string> | null {
  const fields = getFieldErrors(error)
  if (!fields) return null

  return Object.fromEntries(
    Object.entries(fields).map(([key, messages]) => [key, messages[0]])
  )
}

/**
 * Extracts a human-readable error message from any AppApiError.
 *
 * For network errors, `error.message` already contains a specific description
 * from resolveNetworkMessage(). Pass `networkFallback` to override it with
 * a translated string from i18n when you need localisation.
 */
export function getErrorMessage(
  error: AppApiError,
  networkFallback?: string
): string {
  switch (error.kind) {
    case 'validation':
      return error.response.errorMessage
    case 'application':
      return error.response.errorMessage
    case 'network':
      return networkFallback ?? error.message
    case 'unknown':
      return error.errorMessage
  }
}
