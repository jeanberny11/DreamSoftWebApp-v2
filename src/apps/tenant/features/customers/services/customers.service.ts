// Customers feature — service layer
// Wraps API calls for the customers domain

import { tenantClient } from '@/apps/landingapp/common/tenantClient'
import type { ApiResult } from '@/shared/types/api.types'
import type { Customer } from '../types/customer.types'

export const customersService = {
  getAll: () =>
    tenantClient
      .get<ApiResult<Customer[]>>('/api/v1/customers')
      .then((res) => res.data),
}
