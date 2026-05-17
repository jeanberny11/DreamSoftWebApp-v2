// api.types.ts — Shared API response types
// Mirrors the backend ErrorResponse and ValidationErrorResponse contracts exactly.
// Used across all features — not specific to any single domain.

// ── Raw backend response shapes ───────────────────────────────────────────────

/** Mirrors backend ErrorResponse — returned for all application & unexpected errors */
export interface ApiErrorResponse {
  statusCode:   number
  errorCode:    string
  errorType:    string
  errorMessage: string
  traceId?:     string
  timestamp:    string
  stackTrace?:  string  // only present in Development environment
}

/** Mirrors backend ValidationErrorResponse — returned for FluentValidation failures (400) */
export interface ApiValidationErrorResponse extends ApiErrorResponse {
  /** Field-level errors — key is PascalCase field name, value is array of messages */
  errors: Record<string, string[]>
}

// ── Known error codes (mirrors backend ErrorCodes.cs) ────────────────────────

export const API_ERROR_CODES = {
  VALIDATION_ERROR:    'VALIDATION_ERROR',
  NOT_FOUND:           'NOT_FOUND',
  UNAUTHORIZED:        'UNAUTHORIZED',
  FORBIDDEN:           'FORBIDDEN',
  CONFLICT:            'CONFLICT',
  INTERNAL_ERROR:      'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  EMAIL_SEND_FAILED:   'EMAIL_SEND_FAILED',
} as const

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES]

// ── Discriminated union — the normalised error shape ─────────────────────────

/** Validation error — field-level errors preserve the backend Record<string, string[]> shape */
export interface ValidationApiError {
  kind:     'validation'
  response: ApiValidationErrorResponse
}

/** Known application error — errorMessage is already localised by the API */
export interface ApplicationApiError {
  kind:     'application'
  response: ApiErrorResponse
}

/**
 * No response received — DNS failure, timeout, CORS, server completely down.
 * `message` carries a human-readable description of the specific network issue
 * detected from the Axios error code so the user knows what went wrong.
 */
export interface NetworkApiError {
  kind:    'network'
  message: string
}

/** Response received but body doesn't match any known shape */
export interface UnknownApiError {
  kind:         'unknown'
  statusCode:   number
  errorMessage: string
}

export type AppApiError =
  | ValidationApiError
  | ApplicationApiError
  | NetworkApiError
  | UnknownApiError

// ── ApiResult<T> — the single wrapper every API call returns ─────────────────

export type ApiResult<T> =
  | { success: true;  data: T }
  | { success: false; error: AppApiError }

// ── Type guards ───────────────────────────────────────────────────────────────

export function isValidationError(error: AppApiError): error is ValidationApiError {
  return error.kind === 'validation'
}

export function isApplicationError(error: AppApiError): error is ApplicationApiError {
  return error.kind === 'application'
}

export function isNetworkError(error: AppApiError): error is NetworkApiError {
  return error.kind === 'network'
}

export function isUnknownError(error: AppApiError): error is UnknownApiError {
  return error.kind === 'unknown'
}
