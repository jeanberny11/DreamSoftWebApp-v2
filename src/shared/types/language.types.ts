/**
 * language.types.ts
 *
 * Language type and fallback constants used across i18n config,
 * language API, and language store.
 */

/** Language object returned by GET /api/v1/admin/Languages/active */
export interface Language {
  id: number
  code: string
  name: string
  isDefault: boolean
  isActive: boolean
}

/** Available translation namespaces */
export type I18nNamespace =
  | 'common'
  | 'auth'
  | 'validation'
  | 'landing'
  | 'dashboard'

/** Default fallback language — used when API is unavailable or key is missing */
export const FALLBACK_LANGUAGE: Language = {
  id: 0,
  code: 'es',
  name: 'Español',
  isDefault: true,
  isActive: true,
}

/** Static fallback language list — used when API is unavailable */
export const FALLBACK_LANGUAGES: Language[] = [
  FALLBACK_LANGUAGE,
  { id: 1, code: 'en', name: 'English', isDefault: false, isActive: true },
]
