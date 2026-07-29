import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { Municipality } from '../types/municipality.types'
import type { ApiResult } from '@/shared/types/api.types'

const MUNICIPALITIES_BY_PROVINCE_ENDPOINT = '/api/v1/landing/Municipality/by-province'

export const municipalityApi = {
  getAllMunicipalities:()=> tenantClient.get<ApiResult<Municipality[]>>("/api/v1/landing/Municipality"),
  
  getAllMunicipalitiesByProvince:(provinceId: number)=> tenantClient.get<ApiResult<Municipality[]>>(MUNICIPALITIES_BY_PROVINCE_ENDPOINT, { params: { provinceId } }),
}
