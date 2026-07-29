// language.api.ts — API calls for the languages domain.
// Fetches the list of active languages from the backend.
//
// Updated to use /api/v1/landing/Language (LandingApp) instead of the old
// /api/v1/admin/Languages/active (AdminApp) endpoint. The new endpoint only
// ever returns active languages, so isActive is always mapped to true.

import type { Language } from '../types/language.types'
import type { ApiResult } from '../types/api.types'
import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import i18n from '@/shared/i18n/config'

const LANGUAGES_ENDPOINT = '/api/v1/landing/Language'

/** Raw shape returned by the backend — mapped into the app's Language shape below */
interface RawLanguageResponse {
  languageId: number
  code:       string
  name:       string
  isDefault:  boolean
}

export const languagesService = {
  /**
   * Fetch all active languages from the API.
   * Unwraps the ApiResult wrapper added by the response interceptor.
   * Falls back to an empty array if the request fails so the store
   * can use its FALLBACK_LANGUAGES instead.
   */
  getActive: async (): Promise<Language[]> => {
    const res = await tenantClient.get<ApiResult<RawLanguageResponse[]>>(LANGUAGES_ENDPOINT, {
      params: { language: i18n.language },
    })
    const result = res.data as ApiResult<RawLanguageResponse[]>
    if (!result.success) return []

    return result.data.map((l) => ({
      id:        l.languageId,
      code:      l.code,
      name:      l.name,
      isDefault: l.isDefault,
      isActive:  true,
    }))
  },
}
