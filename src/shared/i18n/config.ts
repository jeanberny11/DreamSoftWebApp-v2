/**
 * i18n configuration
 *
 * Initializes i18next with:
 * - Static EN and ES locale files bundled with the app
 * - Default language: 'es' (overridden at runtime by language.store on boot)
 * - Fallback language: always 'es'
 * - Namespaces: common, auth, validation, landing
 *
 * The actual startup language is set dynamically by language.store
 * after fetching supported languages from the API.
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// ── English translations ────────────────────────────────────────────────────
import enCommon     from './locales/en/common.json'
import enAuth       from './locales/en/auth.json'
import enValidation from './locales/en/validation.json'
import enLanding    from './locales/en/landing.json'
import enDashboard  from './locales/en/dashboard.json'
import enProfile    from './locales/en/profile.json'

// ── Spanish translations ────────────────────────────────────────────────────
import esCommon     from './locales/es/common.json'
import esAuth       from './locales/es/auth.json'
import esValidation from './locales/es/validation.json'
import esLanding    from './locales/es/landing.json'
import esDashboard  from './locales/es/dashboard.json'
import esProfile    from './locales/es/profile.json'

export const resources = {
  en: {
    common:     enCommon,
    auth:       enAuth,
    validation: enValidation,
    landing:    enLanding,
    dashboard:  enDashboard,
    profile:    enProfile,
  },
  es: {
    common:     esCommon,
    auth:       esAuth,
    validation: esValidation,
    landing:    esLanding,
    dashboard:  esDashboard,
    profile:    esProfile,
  },
} as const

i18n
  .use(initReactI18next)
  .init({
    resources,

    // Start with 'es' — language.store will override this
    // with the API default language once fetchLanguages() resolves
    lng: 'es',

    // Always fall back to Spanish for any missing key or unsupported language
    fallbackLng: 'es',

    defaultNS: 'common',
    ns: ['common', 'auth', 'validation', 'landing', 'dashboard', 'profile'],

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false,
    },
  })

export default i18n
