// useSubdomain — returns subdomain info for the current hostname

import { useMemo } from 'react'
import { getSubdomain, isTenantSubdomain } from '@/shared/utils/subdomain'

export function useSubdomain() {
  return useMemo(() => ({
    isTenant: isTenantSubdomain(),
    subdomain: getSubdomain(),
  }), [])
}
