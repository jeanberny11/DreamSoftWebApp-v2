// PermissionGuard — checks if the current route path exists in the user's
// menu permissions. Renders a 403 page if the route is not permitted.

import { useLocation } from 'react-router-dom'
import { useMenuStore } from '@/shared/store/menu.store'
import { ForbiddenPage } from '@/apps/tenant/pages/ForbiddenPage'

export function PermissionGuard({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const hasPath = useMenuStore((s) => s.hasPath)

  if (!hasPath(pathname)) {
    return <ForbiddenPage />
  }

  return <>{children}</>
}
