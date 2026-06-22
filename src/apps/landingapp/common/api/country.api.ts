// country.api.ts — API calls for the countries lookup domain.
// Fetches the list of active countries from the backend.

import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { Country } from '../types/country.types'
import type { ApiResult } from '@/shared/types/api.types'

const COUNTRIES_ENDPOINT = '/api/v1/landing/Country'

export const countryApi = {
  getAllCountries:(language: string)=> tenantClient.get<ApiResult<Country[]>>(COUNTRIES_ENDPOINT, { params: { language } }),
}
