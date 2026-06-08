import { create } from 'zustand'
import { homeApi } from '../services/home.api'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { FeatureCatalogItem } from '../types/home.types'

type FeaturesCatalogState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: FeatureCatalogItem[] }
  | { status: 'error'; message: string }

type FeaturesCatalogStore = FeaturesCatalogState & {
  fetch: () => Promise<void>
  reset: () => void
}

export const useFeaturesCatalogStore = create<FeaturesCatalogStore>((set) => ({
  status: 'idle',

  fetch: async () => {
    set({ status: 'loading' })
    const res = await homeApi.getFeaturesCatalog()
    const result = res.data
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: getErrorMessage(result.error) })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
