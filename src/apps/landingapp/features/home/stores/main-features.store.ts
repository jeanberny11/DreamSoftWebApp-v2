import { create } from 'zustand'
import { homeApi } from '../services/home.api'
import { getErrorMessage } from '@/shared/utils/api.utils'
import type { ModuleDto } from '../types/home.types'

type MainFeaturesState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: ModuleDto[] }
  | { status: 'error';   message: string }

type MainFeaturesStore = MainFeaturesState & {
  fetch: (language: string) => Promise<void>
  reset: () => void
}

export const useMainFeaturesStore = create<MainFeaturesStore>((set) => ({
  status: 'idle',

  fetch: async (language: string) => {
    set({ status: 'loading' })
    const res = await homeApi.getMainFeatures(language)
    const result = res.data
    if (result.success) {
      set({ status: 'success', data: result.data })
    } else {
      set({ status: 'error', message: getErrorMessage(result.error) })
    }
  },

  reset: () => set({ status: 'idle' }),
}))
