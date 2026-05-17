// useMenu — fetches the menu on mount and stores it in the menu store

import { useEffect } from 'react'
import { menuApi } from '@/shared/api/menu.api'
import { useMenuStore } from '@/shared/store/menu.store'

export function useMenu() {
  const { setMenu, isLoaded } = useMenuStore()

  useEffect(() => {
    if (isLoaded) return
    menuApi.getMenu()
      .then((res) => setMenu(res.data))
      .catch((err) => console.error('[useMenu] Failed to load menu', err))
  }, [isLoaded, setMenu])
}
