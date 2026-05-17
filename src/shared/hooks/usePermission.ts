// usePermission — checks whether the current user has access to a given path

import { useMenuStore } from '@/shared/store/menu.store'

export function usePermission(path: string): boolean {
  return useMenuStore((s) => s.hasPath(path))
}
