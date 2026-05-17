// language.api.ts — API calls for the languages domain.
// Fetches the list of active languages from the backend.

import type { Language } from '../types/language.types'
import type { ApiResult } from '../types/api.types'
import { tenantClient } from '@/apps/landingapp/common/tenantClient'

const LANGUAGES_ENDPOINT = '/api/v1/admin/Languages/active'

export const languagesService = {
  /**
   * Fetch all active languages from the API.
   * Unwraps the ApiResult wrapper added by the response interceptor.
   * Falls back to an empty array if the request fails so the store
   * can use its FALLBACK_LANGUAGES instead.
   */
  getActive: async (): Promise<Language[]> => {
    const res = await tenantClient.get<ApiResult<Language[]>>(LANGUAGES_ENDPOINT)
    const result = res.data as ApiResult<Language[]>
    if (result.success) return result.data
    return []
  },
}
