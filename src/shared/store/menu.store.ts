// Menu store — holds the role-based menu returned by GET /api/v1/auth/menu
// This drives all dynamic routing in the tenant app

import { create } from 'zustand'
import type { MenuItem } from '@/shared/types/menu.types'

interface MenuStore {
  items: MenuItem[]
  isLoaded: boolean
  setMenu: (items: MenuItem[]) => void
  clearMenu: () => void
  hasPath: (path: string) => boolean
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  items: [],
  isLoaded: false,

  setMenu: (items) => set({ items, isLoaded: true }),

  clearMenu: () => set({ items: [], isLoaded: false }),

  // Check if a given route path exists in the user's permitted menu
  hasPath: (path) => {
    const flattenPaths = (items: MenuItem[]): string[] =>
      items.flatMap((item) => [item.path, ...flattenPaths(item.children ?? [])])

    return flattenPaths(get().items).includes(path)
  },
}))
