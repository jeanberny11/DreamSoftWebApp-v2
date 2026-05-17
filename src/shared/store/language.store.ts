/**
 * language.store.ts
 *
 * Global language state. Fetches supported languages from the API on boot,
 * sets the i18n language to the API-defined default, and exposes
 * changeLanguage() for the LanguageSwitcher component.
 *
 * Fallback: if the API fails, uses FALLBACK_LANGUAGES with 'es' as default.
 */

import { create } from 'zustand'
import i18n from '../i18n/config'
import { languagesService } from '../api/language.api'
import {
  type Language,
  FALLBACK_LANGUAGE,
  FALLBACK_LANGUAGES,
} from '../types/language.types'

interface LanguageStore {
  currentLanguage: Language
  languages: Language[]
  isLoading: boolean
  fetchLanguages: () => Promise<void>
  changeLanguage: (language: Language) => void
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  currentLanguage: FALLBACK_LANGUAGE,
  languages: FALLBACK_LANGUAGES,
  isLoading: true,

  /**
   * Fetch supported languages from the API and set the default.
   * Called once on app boot inside main.tsx Root component.
   */
  fetchLanguages: async () => {
    try {
      const data = await languagesService.getActive()
      const defaultLang = data.find((l) => l.isDefault) ?? FALLBACK_LANGUAGE
      i18n.changeLanguage(defaultLang.code.toLowerCase())
      document.documentElement.lang = defaultLang.code.toLowerCase()
      set({ languages: data, currentLanguage: defaultLang, isLoading: false })
    } catch {
      i18n.changeLanguage(FALLBACK_LANGUAGE.code)
      document.documentElement.lang = FALLBACK_LANGUAGE.code
      set({ languages: FALLBACK_LANGUAGES, currentLanguage: FALLBACK_LANGUAGE, isLoading: false })
    }
  },

  /**
   * Switch the active language manually.
   * Called by LanguageSwitcher when the user picks a different language.
   *
   * @param language - Full Language object from the languages list
   */
  changeLanguage: (language: Language) => {
    i18n.changeLanguage(language.code.toLowerCase())
    document.documentElement.lang = language.code.toLowerCase()
    set({ currentLanguage: language })
  },
}))
