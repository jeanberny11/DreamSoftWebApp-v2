// menu.api.ts â€” Fetches the role-based menu/permissions for the authenticated user

import { tenantClient } from '@/apps/landingapp/common/api/tenantClient'
import type { MenuItem } from '@/shared/types/menu.types'

export const menuApi = {
  getMenu: () =>
    tenantClient.get<MenuItem[]>('/api/v1/auth/menu'),
}
