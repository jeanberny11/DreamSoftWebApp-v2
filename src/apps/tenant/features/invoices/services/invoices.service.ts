// Invoices feature â€” service layer
// Wraps API calls for the invoices domain

import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { ApiResult } from '@/shared/types/api.types'
import type { Invoice } from '../types/invoice.types'

export const invoicesService = {
  getAll: () =>
    tenantClient
      .get<ApiResult<Invoice[]>>('/api/v1/invoices')
      .then((res) => res.data),
}
