import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { Province } from '../types/province.types'
import type { ApiResult } from '@/shared/types/api.types'

const PROVINCES_BY_COUNTRY_ENDPOINT = '/api/v1/landing/Province/by-country'

export const provinceApi = {
  getAllProvinces:()=> tenantClient.get<ApiResult<Province[]>>("/api/v1/landing/Province"),
    
  getAllProvincesByCountry:(countryId: number)=> tenantClient.get<ApiResult<Province[]>>(PROVINCES_BY_COUNTRY_ENDPOINT, { params: { countryId } }),
}
